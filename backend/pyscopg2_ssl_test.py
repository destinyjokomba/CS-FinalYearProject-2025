import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        sslmode="require",  # this tells psycopg2 to use SSL and trust the default certs (e.g. Let's Encrypt)
        sslrootcert="render-ca.crt"
    )
    print(" psycopg2 connected successfully with SSL.")
    conn.close()
except Exception as e:
    print("psycopg2 connection failed:", e)
