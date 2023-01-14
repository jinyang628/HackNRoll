from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# create a connection to the SQLite database
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

# create the users table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)
""")
conn.commit()

class User(BaseModel):
    username: str
    email: str
    password: str

# API endpoint for user login
@app.get("/login")
async def login(email: str, password: str):
    cursor.execute("SELECT user_id FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    if user:
        return {"user_id": user[0]}
    else:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

# API endpoint for user registration
@app.post("/register")
async def register(user: User):
    cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (user.username, user.email, user.password))
    conn.commit()
    return {"user_id": cursor.lastrowid}

# API endpoint for editing user details
@app.post("/edit_details/{user_id}")
async def edit_details(user_id: int, details: str):
    cursor.execute("UPDATE users SET details = ? WHERE user_id = ?", (details, user_id))
    conn.commit()
    return {"message": "User details updated successfully"}

# API endpoint for voice input
@app.post("/voice_input")
async def voice_input(audio_file: bytes):
    # process the voice input here
    return {"message": "Voice input received and processed"}
