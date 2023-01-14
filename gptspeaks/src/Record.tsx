import React from 'react'

function Record() {
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Perform login or registration logic here
    // ...
  };

  return (
    <div>
      <h2 className="recordPrompt">Press the button below to start recording</h2>
      <button id="record-button">Start Recording</button>
      <audio id="recorded-audio"></audio>
    </div>
  );
}

export default Record