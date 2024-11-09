import aiosqlite
import asyncio

async def create_database():
    async with aiosqlite.connect("backend/database/voice_recordings.db") as conn:
        async with conn.cursor() as c:
            await c.execute('''
                CREATE TABLE IF NOT EXISTS voice_recordings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    request_url TEXT,
                    voiceover_link TEXT,
                    created_at TIMESTAMP
                )
            ''')
            await conn.commit()

# Use asyncio to run the function
if __name__ == "__main__":
    asyncio.run(create_database())
