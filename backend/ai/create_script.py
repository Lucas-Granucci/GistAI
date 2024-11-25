import os
from groq import Groq


def create_script(news_content: str) -> str:
    prompt = f"""
    Create a natural-sounding news podcast script that covers today's top stories. Your script should:

    DO NOT INVENT ANY INFORMATION. Only use information given.

    STYLE:

    Begin with a brief, welcoming introduction
    Present stories in a conversational but professional tone
    Use everyday language, avoid jargon
    Keep the focus on what matters most to general audiences

    STRUCTURE:

    Begin with a friendly greeting
    Present stories in order they are given
    End with a brief, natural conclusion
    Don't include speaker tags, sound effects, or production notes

    ARTICLES:
    {news_content}
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
        model="llama3-70b-8192",
    )

    return chat_completion.choices[0].message.content


def generate_deep_dive_script(news_content: str) -> str:
    prompt = f"""
    Do a deep dive into this article. Explore the entities involved (like people, countries, etc.). Also
    explore the real-world implications and how it will affect the world.

    DO NOT INVENT ANY INFORMATION. Only use information given.

    STYLE:

    Begin with a brief, welcoming introduction
    Present stories in a conversational but professional tone
    Use everyday language, avoid jargon
    Keep the focus on what matters most to general audiences

    STRUCTURE:

    Begin with a friendly greeting
    End with a brief, natural conclusion
    Don't include speaker tags, sound effects, or production notes

    ARTICLES:
    {news_content}
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
        model="llama3-70b-8192",
    )

    return chat_completion.choices[0].message.content
