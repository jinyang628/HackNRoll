import React, { useState, useEffect } from 'react';

function Record() {
  const [isRecording, setIsRecording] = useState<boolean | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [downloadLink, setDownloadLink] = useState<HTMLAnchorElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  //Definitely correct
  useEffect(() => {
    if (isRecording !== null){
      if (isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
  }, [isRecording]);

  //check later
  const handleClick = () => {
    setIsRecording(prev => !prev);
  }

  //works fine
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
    // fetch('http://127.0.0.1:8000/test', {
      // method: 'POST',
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
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
    */
  };

  const startRecording = () => {
    console.log("start recording");
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
      const audioBlob = new Blob([audioChunks[audioChunks.length-1]], { type: 'audio/wav' });
      sendAudio(audioBlob);
      console.log(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      downloadAudio(audioUrl);
      setAudioChunks([]);
      setStream(null);
      setMediaRecorder(null);
    }
    console.log("stop recording");
  }

  return (
    <div className="recordContainer">
      <h2 className="recordPrompt">Press the button below to start recording </h2>
      <button id={isRecording ? "record-button-true" : "record-button-false"} onClick={handleClick}>
      </button>
      <div>
      {audioUrl && <audio src={audioUrl} autoPlay controls />}
      </div>
    </div>
  );
}

export default Record;