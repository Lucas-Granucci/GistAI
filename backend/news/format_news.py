def format_news_for_gist(articles: dict) -> str:
    formatted_news = ""
    for i, batch in enumerate(articles.items()):
        title, article_data = batch

        article = f"""
        --------------------------------------------------
        Article {i+1}
        Title: {title}
        Author: {article_data["author"]}
        Published at: {article_data["publishedAt"]}
        Introduction: {article_data["content"]}
        Summary: {article_data['summary']}
        """

        formatted_news += article

    return formatted_news


def format_news_for_deep_dive(article: dict) -> str:
    for headline, article_data in article.items():
        formatted_news = f"""
        Title: {headline}
        Author: {article_data["author"]}
        Published at: {article_data["publishedAt"]}
        Introduction: {article_data["content"]}
        
        Content: {article_data["extracted_content"]}
        """

    return formatted_news
