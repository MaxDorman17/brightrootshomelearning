from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    OAK_API_KEY: str = ""
    OAK_BASE_URL: str = "https://open-api.thenational.academy"
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = ""
    FRONTEND_URL: str = "http://localhost:3000"
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_MONTHLY_PRICE_ID: str = "price_1UJb5zD6aHVbx1WGHlgqqk7o"
    STRIPE_YEARLY_PRICE_ID: str = "price_1UJb71D6aHVbx1WGMn3IzCEd"

    class Config:
        env_file = ".env"


settings = Settings()
