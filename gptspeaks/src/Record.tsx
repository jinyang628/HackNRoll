import React, { useState, useEffect } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

function Record() {
  const [isRecording, setIsRecording] = useState<boolean | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [downloadLink, setDownloadLink] = useState<HTMLAnchorElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  //const [blob, setBlob] = useState<Blob|null>(null);
  useEffect(() => {
    if (isRecording !== null){
      if (isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
  }, [isRecording]);

  const handleClick = () => {
    setIsRecording(prev => !prev);
  }

  const downloadAudio = (audioUrl: string) => {
    if (downloadLink) {
      document.body.removeChild(downloadLink);
      setDownloadLink(null);
    }
    const newDownloadLink = document.createElement("a");
    newDownloadLink.href = audioUrl;
    newDownloadLink.download = "recording.wav";
    newDownloadLink.innerHTML = "Download Recording";
    setDownloadLink(newDownloadLink);
    document.body.appendChild(newDownloadLink);
  };

  const sendAudio = (audioBlob: string | Blob) => {
    const formData = new FormData();
    formData.append("audio_file", new File([audioBlob], 'audio.wav', { type: 'audio/wav' }));
    /*
    fetch('http://127.0.0.1:8000/test', {
      method: 'POST',
      */
    fetch('http://127.0.0.1:8000/voice_input', {
      method: 'POST',
      body: formData
    }).then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        console.log(url)
        setAudioUrl(url);
      });
    /*
    .then(res => res.json())
    // store the response somewhere
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
    */
  };


  console.log('error arrives here');
  console.log(audioChunks);

  if(mediaRecorder){
    mediaRecorder.addEventListener("dataavailable", event => {
      setAudioChunks(prev => [...prev, event.data]);
    });
  }
  

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      setStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
    });
  }

  const stopRecording = () => {
    if (mediaRecorder && stream) {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      const audioBlob = new Blob([audioChunks[audioChunks.length-1]], { type: 'audio/wav' });
      sendAudio(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioChunks);
      console.log('help me');
      console.log(mediaRecorder);
      console.log('check media');
      downloadAudio(audioUrl);
      setAudioChunks([]);
      setStream(null);
      setMediaRecorder(null);
    }
  }

  // const handleAudioEnded = () => {
    // const audio = document.querySelector("audio");
    // if(audio){
      // if(audio.parentNode)
        // audio.parentNode.removeChild(audio);
    // }
  // };

  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        // render={({ status, mediaBlobUrl }) => (
          <div className="recordContainer">
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            {/* <button >Start Recording</button> */}
            {/* <button >Stop Recording</button> */}
            <audio src={mediaBlobUrl} controls autoPlay loop />
          </div>
        )}
        onStop = {(blobUrl: string, blobObject: Blob) => {
          console.log("stopped here!");
          sendAudio(blobObject);
        }}
      />
      {/* <h2 className="recordPrompt">Press the button below to start recording </h2> */}
      {/* <button id={isRecording ? "record-button-true" : "record-button-false"} onClick={handleClick}> */}
      {/* </button> */}
      <div>
      {audioUrl && <audio src={audioUrl} autoPlay controls/>}
      </div>
      {/* <h2 className="recordPrompt">Press the button below to start recording </h2> */}
      {/* <button id={isRecording ? "record-button-true" : "record-button-false"} onClick={handleClick}> */}
      {/* <div id="redDot"></div> REC */}
      {/* </button> */}
    </div>
  );
}

export default Record;


