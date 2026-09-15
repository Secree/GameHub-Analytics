import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def get_connection():

    connection_url = (
        os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_URL")
    )

    if connection_url:
        return psycopg2.connect(connection_url)

    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )