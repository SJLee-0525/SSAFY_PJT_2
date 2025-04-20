# app/models/ingredients.py

from typing import List
from pydantic import BaseModel


class Ingredients(BaseModel):
    ingredients: List[str] = None
    main_ingredients: List[str] = None
    preferred_ingredients: List[str] = None
    disliked_ingredients: List[str] = None
    categories: List[str] = None
    dietaries: List[str] = None
    allergies: List[str] = None
