import os
import time
import sqlite3
from bs4 import BeautifulSoup
from selenium import webdriver
from newsapi import NewsApiClient

def get_top_k_articles(k: int) -> dict:

    articles = {}

    newsapi = NewsApiClient(os.environ["NEWSAPI_KEY"])
    top_headlines = newsapi.get_top_headlines(language='en')

    if top_headlines["status"] == 'ok':
        top_k_articles = top_headlines["articles"][:k]

        for article in top_k_articles:
            articles[article["title"]] = article

    return articles

def get_articles_from_db(titles: list):
    conn = sqlite3.connect("backend/database/news_articles.db")
    c = conn.cursor()

    placeholders = ', '.join('?' for _ in titles)
    query = f"SELECT title, author, publishedAt, url, urlToImage, content, extracted_content, summary FROM articles WHERE title IN ({placeholders})"

    c.execute(query, titles)

    articles_dict = {}
    for row in c.fetchall():
        title, author, publishedAt, url, urlToImage, content, extracted_content, summary = row
        articles_dict[title] = {
            'author': author,
            'publishedAt': publishedAt,
            'url': url,
            'urlToImage': urlToImage,
            'content': content,
            'extracted_content': extracted_content,
            'summary': summary
        }
    conn.close()
    return articles_dict

def extract_article_content(article_content: dict) -> dict:

    current_url = article_content["url"]

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    max_redirects = 5
    attempts = 0

    try:
        while attempts < max_redirects:
            driver.get(current_url)
            time.sleep(2)

            soup = BeautifulSoup(driver.page_source, "html.parser")

            paragraphs = soup.find_all("p")
            texts = [s.text for s in paragraphs]
            complete_text = " ".join(texts)

            if complete_text.strip():
                article_content["extracted_content"] = complete_text
                break
            else:
                current_url = driver.current_url
                attempts += 1

        if "extracted_content" not in article_content:
            article_content["extracted_content"] = ""

    finally:
        driver.quit()

    return article_content