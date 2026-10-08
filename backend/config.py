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
    SUPPORT_EMAIL: str = "help@brightrootshomelearning.co.uk"  # where Help and feedback messages are sent
    ADMIN_EMAILS: str = ""
    # Nightly off-site backups, to any S3-compatible bucket (see backups.py). Off until these are filled in.
    BACKUP_S3_ENDPOINT: str = ""  # e.g. https://s3.fr-par.scw.cloud
    BACKUP_S3_REGION: str = ""  # e.g. fr-par
    BACKUP_S3_BUCKET: str = ""
    BACKUP_S3_ACCESS_KEY: str = ""
    BACKUP_S3_SECRET_KEY: str = ""
    BACKUP_KEEP_DAYS: int = 30  # how long daily database copies are kept
    BACKUP_HOUR: int = 3  # UK time; the nightly backup runs at or after this hour  # comma-separated; these parent accounts can send the newsletter
    OWNER_NUMBERS_KEY: str = ""  # secret key for the owner's own dashboard to read totals (routers/owner_numbers.py); off when empty
    GLITCHTIP_DSN: str = ""  # where unexpected server errors are reported (see error_reports.py); off when empty
    # Spoken words for spelling games, made by Azure Speech so every device hears the same voice (routers/speech.py).
    # Off when empty: devices then use their own built-in voice.
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "uksouth"
    AZURE_SPEECH_VOICE: str = "en-GB-LibbyNeural"
    # A made-up family anyone can try from the login page, rebuilt every night (see demo.py). Off unless true.
    DEMO_ENABLED: bool = False
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_MONTHLY_PRICE_ID: str = "price_1UJb5zD6aHVbx1WGHlgqqk7o"
    STRIPE_YEARLY_PRICE_ID: str = "price_1UJb71D6aHVbx1WGMn3IzCEd"

    class Config:
        env_file = ".env"


settings = Settings()
