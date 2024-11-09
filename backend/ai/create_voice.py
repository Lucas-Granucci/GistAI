import os
import vlc
import time
import requests
from io import BytesIO
from pydub import AudioSegment

def create_voice(script: str):
    unreal_speech_key = os.environ["UNREAL_API_KEY"]
    response = requests.post(
        'https://api.v7.unrealspeech.com/synthesisTasks',
        headers = {
            'Authorization' : f'Bearer {unreal_speech_key}'
        },
        json = {
            'Text': script, # Up to 500,000 characters
            'VoiceId': 'Will', # Dan, Will, Scarlett, Liv, Amy
            'Bitrate': '192k', # 320k, 256k, 192k, ...
            'Speed': '0.25', # -1.0 to 1.0
            'Pitch': '0.92', # -0.5 to 1.5
            'TimestampType': 'sentence', # word or sentence
        #'CallbackUrl': '<URL>', # pinged when ready
        }
        )
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch audio synthesis")
    return response.json()