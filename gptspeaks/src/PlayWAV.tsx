import AudioPlayer from 'react-audio-player';
import audioClip from './WAV/testing.wav';

function PlayWAV() {
  return (
    <div>
      <AudioPlayer
        src={audioClip}
        controls
      />
    </div>
  );
}

export default PlayWAV;
