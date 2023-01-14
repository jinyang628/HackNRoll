import React, { useState, useEffect } from 'react';

function Record() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // const [fileName, setFileName] = useState("recording.wav")


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
      {/* {audioUrl && (
        <a href={audioUrl} download={fileName}>
          Download recording
        </a>
      )} */}
    </div>
  );
}

export default Record;

