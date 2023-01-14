import React from 'react'

function Record() {
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Perform login or registration logic here
    // ...
  };

  return (
    <h2 className="recordPrompt">Press the button below to start recording
    <button id="record-button">Start Recording</button>
    <audio id="recorded-audio"></audio>
    </h2>
  );
}

export default Record