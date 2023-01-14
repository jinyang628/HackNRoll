import React, { useState } from 'react';


function Record() {
  const [isRecording, setIsRecording] = useState(false);

  const handleClick = () => {
    setIsRecording(!isRecording);
    console.log(`Recording: ${isRecording}`);
  }

  return (
    <div className="recordContainer">
      <h2 className="recordPrompt">Press the button below to start recording </h2>
      <button id="record-button" onClick={handleClick}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
      <audio id="recorded-audio"></audio>
    </div>
  );
}


export default Record