import aiosqlite
import asyncio


async def create_articles_database():
    async with aiosqlite.connect("backend/database/news_articles.db") as conn:
        async with conn.cursor() as c:
            await c.execute("""
                CREATE TABLE IF NOT EXISTS articles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT UNIQUE,
                    author TEXT,
                    publishedAt TEXT,
                    url TEXT,
                    urlToImage TEXT,
                    content TEXT,
                    extracted_content TEXT,
                    summary TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await conn.commit()


# Use asyncio to run the function
if __name__ == "__main__":
    asyncio.run(create_articles_database())
