from pydantic import BaseModel
from typing import Literal


class UserInput(BaseModel):
    role: Literal["user"]
    content: str


class SystemInput(BaseModel):
    role: Literal["system"]
    content: str
