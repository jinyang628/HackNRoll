import React, { useState, useEffect } from 'react';

function Record() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);


  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const handleClick = () => {
    setIsRecording(!isRecording);
  }


  const sendAudio = (audioBlob: string | Blob) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob);
    fetch('http://127.0.0.1:8000/voice_input', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    // store the response somewhere
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  };


  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      setStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
      mediaRecorder.addEventListener("dataavailable", event => {
        setAudioChunks(prev => [...prev, event.data]);
      });
    });
  }

  const stopRecording = () => {
    if (mediaRecorder && stream) {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      sendAudio(audioBlob);
      setStream(null);
      setMediaRecorder(null);
    }
  }



  return (
    <div className="recordContainer">
      <h2 className="recordPrompt">Press the button below to start recording </h2>
      <button id="record-button" onClick={handleClick}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default Record;

