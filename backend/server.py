from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from user import User
from fake import Fake
import os
import json
from dotenv import load_dotenv

load_dotenv(".env")

countries = {"USA": "en_US", "France": "fr_FR", "Russia": "ru_RU", "China": "zh_CN"}

def init_app():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=json.loads(os.getenv("ALLOWED_ORIGINS")),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app

app = init_app()

class UsersRequest(BaseModel):
    country: str
    errors: float
    seed: int
    count: int = 20
    offset: int | None = 0

    class Config:
        arbitrary_types_allowed = True

@app.post("/users")
def generate_users(request: UsersRequest):
    users = []
    locale = countries.get(request.country, "unknown")
    seed = request.seed
    if locale == "unknown":
        raise HTTPException(
            400,
            f"Unknown country {request.country}. Available countries: {list(countries.keys())}",
        )

    for any_seed in range(seed + request.offset, seed + request.offset + request.count):
        fake = Fake(locale,any_seed)
        user = User(
            _fake=fake,
            number=any_seed - seed + 1,
            name=fake.faker.name(),
            phone=fake.faker.phone_number(),
            address=fake.faker.address(),
            id=fake.faker.uuid4(),
        )
        user.create_mistakes(request.errors)
        users.append(user)
    return users
