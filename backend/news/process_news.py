import sqlite3
from tqdm import tqdm
from backend.news.summarize_news import summarize_article
from backend.news.fetch_news import extract_article_content

def process_and_store_articles(articles_to_process: dict):

    conn = sqlite3.connect("backend/database/news_articles.db")
    c = conn.cursor()

    for _, article_data in tqdm(articles_to_process.items()):
        article_data = extract_article_content(article_data)
        article_data = summarize_article(article_data)

        c.execute("INSERT INTO articles (title, author, publishedAt, url, urlToImage, content, extracted_content, summary, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", 
                  (article_data["title"], article_data["author"], article_data["publishedAt"], article_data["url"], article_data["urlToImage"], article_data["content"], article_data["extracted_content"], article_data["summary"]))
        
    c.execute('SELECT COUNT(*) FROM articles')
    count = c.fetchone()[0]

    MAX_COUNT = 100

    if count > MAX_COUNT:
        delete_count = count - MAX_COUNT
        c.execute("""
                DELETE FROM articles
                WHERE rowid IN (
                    SELECT rowid FROM articles
                    ORDER BY timestamp ASC
                    LIMIT ?
                  )
                  """, (delete_count,))

    conn.commit()
    conn.close()

def get_unprocessed_articles(articles: dict) -> dict:

    articles_to_process = {}

    conn = sqlite3.connect("backend/database/news_articles.db")
    c = conn.cursor()

    for title, article_data in articles.items():
        c.execute('SELECT * FROM articles WHERE title = ?', (title,))
        if c.fetchone() is None:
            articles_to_process[title] = article_data

    conn.commit()
    conn.close()

    return articles_to_process

