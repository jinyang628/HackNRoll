import React, { useState, useEffect } from 'react';

function Record() {
  const [isRecording, setIsRecording] = useState(false);
  // const [isWaiting, setIsWaiting] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  // const [fileName, setFileName] = useState("recording.wav")


  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    // if (isWaiting)
  }, [isRecording]);

  const handleClick = () => {
    setIsRecording(!isRecording);
  }

  function sendAudio(audioUrl: string) {
    const formData = new FormData();
    formData.append("audio_file", audioUrl);
    fetch('/voice_input', {
      method: 'POST',
      body: formData
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    });
  }

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
      setAudioUrl(URL.createObjectURL(audioBlob));
      //audioURL contains the wav file//
      sendAudio(audioUrl);
      setStream(null);
      setMediaRecorder(null);
      // setIsWaiting(true);
    }
  }



  return (
    <div className="recordContainer">
      <h2 className="recordPrompt">Press the button below to start recording </h2>
      <button id="record-button" onClick={handleClick}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
      {/* {audioUrl && (
        <a href={audioUrl} download={fileName}>
          Download recording
        </a>
      )} */}
    </div>
  );
}

export default Record;

