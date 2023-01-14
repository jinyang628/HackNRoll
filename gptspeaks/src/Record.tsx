import React, { useState, useEffect } from 'react';

function Record() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // const [fileName, setFileName] = useState("recording.wav");

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
      if(audioChunks.length > 0) {
        const audioBlob = new Blob([audioChunks[audioChunks.length-1]], { type: 'audio/wav' });
        sendAudio(audioBlob);
      }
      setAudioChunks([]);
      setStream(null);
      setMediaRecorder(null);
    }
  }

  
  // const stopRecording = () => {
  //   if (mediaRecorder && stream) {
  //     mediaRecorder.stop();
  //     stream.getTracks().forEach(track => track.stop());
  //     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  //     sendAudio(audioBlob);
  //     setAudioChunks([]);
  //     setStream(null);
  //     setMediaRecorder(null);
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = audioUrl;
  //     downloadLink.download = "recording.wav";
  //     downloadLink.innerHTML = "Download Recording";
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);
  //   }

  return (
    <div className="recordContainer">
      <h2 className="recordPrompt">Press the button below to start recording </h2>
      <button id={isRecording ? "record-button-true" : "record-button-false"} onClick={handleClick}>
      <div id="redDot"></div>REC
      </button>
    </div>
  );
}

export default Record;

