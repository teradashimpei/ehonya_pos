import os
import pymysql
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=3306,
)

with conn.cursor() as cursor:
    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME')} "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )

conn.commit()
conn.close()
print("スキーマ作成完了")