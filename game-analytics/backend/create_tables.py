from sqlalchemy import text

from database import engine, Base
import models

with engine.begin() as conn:
    conn.execute(text("""
        CREATE SCHEMA IF NOT EXISTS gamehub_analytics
    """))

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")