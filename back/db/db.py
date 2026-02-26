from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
Base = declarative_base()

SENHA_BD = os.getenv("SENHA_BD")
DATABASE_URL = f"mysql+mysqlconnector://root:{SENHA_BD}@localhost/fogazza"

engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    pool_timeout=30,
)

SessionFactory = sessionmaker(
    bind=engine, autoflush=False, expire_on_commit=False)

Base.metadata.create_all(engine)
