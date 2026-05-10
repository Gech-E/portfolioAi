from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:4000"
    openai_api_key: str = ""
    openai_model_primary: str = "gpt-4o"
    openai_model_fast: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    redis_url: str = "redis://localhost:6379"
    jwt_secret: str = "dev-secret-change-in-production"

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
