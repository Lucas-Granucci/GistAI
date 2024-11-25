import os
import warnings
from groq import Groq
from transformers import pipeline


def summarize_article(article_content: dict) -> dict:
    if article_content["extracted_content"] != "":
        article_content["summary"] = llm_summarize(article_content["extracted_content"])
    else:
        article_content["summary"] = ""
    return article_content


def summarize_content(article_text: str) -> str:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    tokens = summarizer.tokenizer(article_text, return_tensors="pt", truncation=False)

    if tokens["input_ids"].size(1) > 1024:
        article_text = summarizer.tokenizer.decode(
            tokens["input_ids"][0][:1020], skip_special_tokens=True
        )

    warnings.filterwarnings("ignore", "Your max_length is set to")
    summary = summarizer(article_text, max_length=350, min_length=150, do_sample=False)
    return summary[0]["summary_text"]


def llm_summarize(article_text: str) -> str:
    prompt = f"""
    Provide a summary of the main points in the following article. Focus on the essential ideas and key takeaways.
    Ignoring any irrelevant information such as cookie consent messages or disclaimers.

    ARTICLE:
    {article_text}
    """

    client = Groq(
        api_key=os.environ["GROQ_GIST"],
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "you are a helpful news assistant."},
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="llama3-8b-8192",
    )

    return chat_completion.choices[0].message.content
