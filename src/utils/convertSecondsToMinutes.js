export default function converSecondsToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 60);
    let seconds = Math.floor(ms % 60);
    seconds = seconds < 10 ? seconds.toString().padStart(1, '0') : seconds;
    return minutes + ':' + seconds;
  }