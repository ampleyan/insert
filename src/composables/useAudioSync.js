import { ref, onUnmounted } from 'vue';

export function useAudioSync() {
  const audioContext = ref(null);
  const analyser = ref(null);
  const audioSource = ref(null);
  const audioElement = ref(null);
  const audioData = ref({
    frequency: 0,
    amplitude: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    beat: false,
  });
  const isPlaying = ref(false);
  const animationFrameId = ref(null);

  const initAudio = (audioFile) => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    }

    audioElement.value = new Audio(URL.createObjectURL(audioFile));
    audioSource.value = audioContext.value.createMediaElementSource(audioElement.value);
    analyser.value = audioContext.value.createAnalyser();
    analyser.value.fftSize = 256;

    audioSource.value.connect(analyser.value);
    analyser.value.connect(audioContext.value.destination);

    return audioElement.value;
  };

  const analyzeAudio = () => {
    if (!analyser.value) return;

    const bufferLength = analyser.value.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.value.getByteFrequencyData(dataArray);

    const bassEnd = Math.floor(bufferLength * 0.1);
    const midEnd = Math.floor(bufferLength * 0.5);

    const bass = dataArray.slice(0, bassEnd).reduce((a, b) => a + b, 0) / bassEnd;
    const mid = dataArray.slice(bassEnd, midEnd).reduce((a, b) => a + b, 0) / (midEnd - bassEnd);
    const treble = dataArray.slice(midEnd).reduce((a, b) => a + b, 0) / (bufferLength - midEnd);

    const amplitude = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const frequency = dataArray.findIndex((val) => val > 0);

    const beatThreshold = 180;
    const beat = bass > beatThreshold;

    audioData.value = {
      frequency,
      amplitude: amplitude / 255,
      bass: bass / 255,
      mid: mid / 255,
      treble: treble / 255,
      beat,
    };

    if (isPlaying.value) {
      animationFrameId.value = requestAnimationFrame(analyzeAudio);
    }
  };

  const play = () => {
    if (audioElement.value && audioContext.value) {
      audioContext.value.resume();
      audioElement.value.play();
      isPlaying.value = true;
      analyzeAudio();
    }
  };

  const pause = () => {
    if (audioElement.value) {
      audioElement.value.pause();
      isPlaying.value = false;
      if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value);
      }
    }
  };

  const stop = () => {
    pause();
    if (audioElement.value) {
      audioElement.value.currentTime = 0;
    }
  };

  const setVolume = (volume) => {
    if (audioElement.value) {
      audioElement.value.volume = Math.max(0, Math.min(1, volume));
    }
  };

  onUnmounted(() => {
    stop();
    if (audioContext.value) {
      audioContext.value.close();
    }
  });

  return {
    audioData,
    isPlaying,
    initAudio,
    play,
    pause,
    stop,
    setVolume,
  };
}
