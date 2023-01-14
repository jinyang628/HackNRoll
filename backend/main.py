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
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    details TEXT 
)
""")
conn.commit()

class User(BaseModel):
    username: str
    email: str
    password: str
    details: str

print("running");
# API endpoint for user login
@app.get("/login")
async def login(email: str, password: str):
    cursor.execute("SELECT user_id, username, details FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    if user:
        return {"user_id": user[0],
                "username": user[1],
                "details":user[2]}
    else:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

# API endpoint for user registration
@app.post("/register")
async def register(user: User):
    cursor.execute("SELECT email FROM users WHERE email = ?", (user.email,))
    email_exists = cursor.fetchone()
    if not email_exists:
        cursor.execute("INSERT INTO users (username, email, password,details) VALUES (?, ?, ?,?)", (user.username, user.email, user.password,user.details))
        conn.commit()
        return {"user_id": cursor.lastrowid}
    else:
        raise HTTPException(status_code=400, detail="Email already exists")

# API endpoint for editing user details
@app.post("/edit_details")
async def edit_details(user_id: int, details: str):
    cursor.execute("UPDATE users SET details = ? WHERE user_id = ?", (details, user_id))
    conn.commit()
    return {"message": "User details updated successfully"}

# API endpoint for voice input
@app.post("/voice_input")
async def voice_input(audio_file: bytes):
    # process the voice input here
    return {"message": "Voice input received and processed"}
