import time
import aiosqlite  # Use aiosqlite for async database access
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

from backend.news.format_news import format_news_for_gist, format_news_for_deep_dive
from backend.news.fetch_news import get_top_k_articles, get_articles_from_db
from backend.news.process_news import (
    process_and_store_articles,
    get_unprocessed_articles,
)
from backend.ai.create_script import create_script, generate_deep_dive_script
from backend.ai.create_voice import create_voice


# Pydantic models for request/response validation
class ArticleKey(BaseModel):
    key: str


class ArticleKeys(BaseModel):
    keys: List[str]


class ArticleData(BaseModel):
    data: Dict


class Script(BaseModel):
    content: str


class VoiceoverResponse(BaseModel):
    speech_data: Dict


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------- HELPER FUNCTIONS ---------------------------------------------------------- #


async def get_voiceover_link(request_url: str, script_response: Script) -> str:
    async with aiosqlite.connect("backend/database/voice_recordings.db") as conn:
        c = await conn.cursor()

        await c.execute(
            "SELECT voiceover_link, created_at FROM voice_recordings WHERE request_url = ?",
            (request_url,),
        )
        result = await c.fetchone()
        current_time = int(time.time())

        CACHE_DURATION = 3600  # 1 hour

        if result and (current_time - result[1] < CACHE_DURATION):
            print("Using cached link")
            return result[0]

        voiceover_response = await generate_voiceover(
            Script(content=script_response.content)
        )
        new_link = voiceover_response.speech_data["SynthesisTask"]["OutputUri"]

        if result:
            await c.execute(
                "UPDATE voice_recordings SET voiceover_link = ?, created_at = ? WHERE request_url = ?",
                (new_link, current_time, request_url),
            )
        else:
            await c.execute(
                "INSERT INTO voice_recordings (request_url, voiceover_link, created_at) VALUES (?, ?, ?)",
                (request_url, new_link, current_time),
            )

        await conn.commit()

    return new_link


# Full pipeline endpoint: Fetch articles, generate script, and voiceover
@app.get("/news/full-pipeline")
async def full_pipeline(count: int):
    """Execute the full pipeline: fetch articles, generate script, and voiceover."""
    try:
        request_url = f"/news/full-pipeline?count={count}"

        # Fetch and store articles
        fetch_response = await fetch_and_store_articles(count)
        article_keys = fetch_response["article_keys"]
        print("Got article response", flush=True)

        # Generate script
        script_response = await generate_script(ArticleKeys(keys=article_keys))
        print("Got script response", flush=True)

        # Check cache for voiceover, otherwise generate voiceover
        voiceover_link = await get_voiceover_link(request_url, script_response)
        print("Got voiceover link", flush=True)

        return {
            "article_data": fetch_response["article_data"],
            "script": script_response.content,
            "speech_url": voiceover_link,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Pipeline processing failed: {str(e)}"
        )


# Endpoint for generating a full deep dive with voiceover
@app.get("/news/deep-dive")
async def deep_dive_pipeline(article_title: str):
    """Generate a deep dive with voiceover for a specific article."""
    try:
        request_url = f"/news/deep-dive?article_title={article_title}"

        # Generate deep dive script
        deep_dive_response = await generate_deep_dive_script_endpoint(article_title)

        # Check cache for voiceover, otherwise generate voiceover
        voiceover_link = await get_voiceover_link(request_url, deep_dive_response)

        return {
            "deep_dive_script": deep_dive_response.content,
            "speech_url": voiceover_link,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Deep dive generation failed: {str(e)}"
        )


# Endpoint to fetch and store articles
@app.post("/articles/fetch-and-store")
async def fetch_and_store_articles(count: Optional[int] = Body(5, embed=True)):
    """Fetch and store top articles, returning article keys and data."""
    try:
        articles = get_top_k_articles(count)
        unprocessed_articles = get_unprocessed_articles(articles)
        process_and_store_articles(unprocessed_articles)

        # Remove 'extracted_content' key from each article if it exists
        articles = {
            article_key: {
                k: v for k, v in article_data.items() if k != "extracted_content"
            }
            for article_key, article_data in articles.items()
        }

        article_keys = list(articles.keys())
        return {"article_keys": article_keys, "article_data": articles}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch articles: {str(e)}"
        )


# Endpoint to generate script for given article keys
@app.post("/script/generate")
async def generate_script(article_keys: ArticleKeys):
    """Generate a script based on provided article keys."""
    try:
        articles = get_articles_from_db(article_keys.keys)
        if not articles:
            raise HTTPException(
                status_code=404, detail="No articles found for provided keys"
            )

        formatted_news = format_news_for_gist(articles)
        script = create_script(formatted_news)
        return Script(content=script)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate script: {str(e)}"
        )


# Endpoint for generating a deep-dive script for a specific article
@app.get("/script/generate-deep-dive")
async def generate_deep_dive_script_endpoint(article_title: str):
    """Generate a deep-dive script for a specific article."""
    try:
        article = get_articles_from_db([article_title])
        if not article:
            raise HTTPException(
                status_code=404, detail="No article found for the given title"
            )

        formatted_news = format_news_for_deep_dive(article)
        deep_dive = generate_deep_dive_script(formatted_news)
        return Script(content=deep_dive)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate deep dive: {str(e)}"
        )


# Endpoint to generate a voiceover from a provided script
@app.post("/voiceover/generate")
async def generate_voiceover(script: Script):
    """Generate a voiceover from a provided script."""
    try:
        unreal_json = create_voice(script.content)
        return VoiceoverResponse(speech_data=unreal_json)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate voiceover: {str(e)}"
        )
