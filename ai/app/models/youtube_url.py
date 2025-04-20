# app/models/youtube_url.py

from typing import List, Optional
from pydantic import BaseModel


class YoutubeURL(BaseModel):
    youtube_url: str
