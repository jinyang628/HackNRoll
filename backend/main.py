from fastapi import FastAPI, HTTPException, File
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import sqlite3
import replicate
import google.cloud.texttospeech as tts
import openai

model = replicate.models.get("openai/whisper")
version = model.versions.get(
    "30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed")
pre_prompt = """Awexa is a chatbot that responses to things in an uwu-voice.
Awexa responds to questions like this.
You: "What is your name?"
Awexa: "oowoo hehe my name is awexa daysoo"
You: "How many legs do you have?"
Awexa: "oowoo im a big twansfowmer modew being wun on azure cwoud compwuting so i actwually have no wegs daysoo
If Awexa is not sure of an answer, she can reply with "oowoo senpai i dont know that daysoo"""""


def text_to_wav(voice_name: str, text: str):
    language_code = "-".join(voice_name.split("-")[:2])
    text_input = tts.SynthesisInput(text=text)
    voice_params = tts.VoiceSelectionParams(
        language_code=language_code, name=voice_name
    )
    audio_config = tts.AudioConfig(audio_encoding=tts.AudioEncoding.LINEAR16)

    client = tts.TextToSpeechClient()
    response = client.synthesize_speech(
        input=text_input, voice=voice_params, audio_config=audio_config
    )

    filename = f"{language_code}.wav"
    with open(filename, "wb") as out:
        out.write(response.audio_content)
        print(f'Generated speech saved to "{filename}"')


def text_to_audio(voice_name: str, text: str):
    language_code = "-".join(voice_name.split("-")[:2])
    text_input = tts.SynthesisInput(text=text)
    voice_params = tts.VoiceSelectionParams(
        language_code=language_code, name=voice_name
    )
    audio_config = tts.AudioConfig(audio_encoding=tts.AudioEncoding.LINEAR16)

    client = tts.TextToSpeechClient()
    response = client.synthesize_speech(
        input=text_input, voice=voice_params, audio_config=audio_config
    )
    return response.audio_content


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


print("running")
# API endpoint for user login


@app.get("/login")
async def login(email: str, password: str):
    cursor.execute(
        "SELECT user_id, username, details FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    if user:
        return {"user_id": user[0],
                "username": user[1],
                "details": user[2]}
    else:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

# API endpoint for user registration


@app.post("/register")
async def register(user: User):
    cursor.execute("SELECT email FROM users WHERE email = ?", (user.email,))
    email_exists = cursor.fetchone()
    if not email_exists:
        cursor.execute("INSERT INTO users (username, email, password,details) VALUES (?, ?, ?,?)",
                       (user.username, user.email, user.password, user.details))
        conn.commit()
        return {"user_id": cursor.lastrowid}
    else:
        raise HTTPException(status_code=400, detail="Email already exists")

# API endpoint for editing user details


@app.post("/edit_details")
async def edit_details(user_id: int, details: str):
    cursor.execute(
        "UPDATE users SET details = ? WHERE user_id = ?", (details, user_id))
    conn.commit()
    return {"message": "User details updated successfully"}

# API endpoint for voice input


@app.post("/voice_input")
async def voice_input(audio_file: bytes = File(..., media_type="audio/wav")):
    print("test1")
    with open('test.wav', 'wb') as f:
        # save with UUID, the ndelete
        f.write(audio_file)
    print("test2")
    text_input = version.predict(audio=open("test.wav", "rb"))
    # pass to gpt
    # print(text_input.transcription)
    print("test3")
    print(text_input["transcription"])
    # get output from gpt
    print("test4")
    prompt = f"{pre_prompt}You:{text_input['transcription']}\nAwexa:"
    text_response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.5,
        max_tokens=60,
        top_p=0.3,
        frequency_penalty=0.5,
        presence_penalty=0.0
    )
    # pass to tts
    text_output = text_response["choices"][0]["text"]
    print(text_output)
    audio_output = text_to_wav("en-AU-Wavenet-A", text_output)
    return FileResponse(path="en-AU.wav", media_type="audio/wav")
    # pass audio and tts out
    # with open("en-AU.wav", "rb") as f:
    # audio_response = Response(content=f.read(), media_type="audio/wav")
    # return JSONResponse(content=audio_response, media_type="audio/wav", headers={"content-disposition": "attachment;filename=audio.wav"},
    # json={"message": text_output})
