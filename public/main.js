const socket = new WebSocket('wss://localhost:8888');
const video = document.getElementById('video');
let mediaRecorder;

socket.onopen = () => {
  console.log('socket::onopen');
};

socket.onmessage = async (message) => {

};

socket.onerror = error => {
  console.error('socket::onerror');
  alert('socket error');
};

socket.onclose = () => {
  console.log('socket::onclose');
  stop();
};

const sendSocketMessage = (action, data) => {
  const message = { action, data };
  socket.send(JSON.stringify(message));
};

const start = async () => {
  const mimeType = 'video/webm;codecs=vp8,opus';

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    alert('vp8/opus is not supported');

    return;
  }

  const options = {
    audioBitsPerSecond: 128000,
    mimeType,
    videoBitsPerSecond: 2500000
  };

  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true });

  video.srcObject = mediaStream;
  mediaRecorder = new MediaRecorder(mediaStream, options);

  setListeners();

  mediaRecorder.start(1000);
};

const stop = () => {
  if(!mediaRecorder) return;

  mediaRecorder.stop();
};

const setListeners = () => {
  mediaRecorder.ondataavailable = handleOnDataAvailable;
  mediaRecorder.onStop = handleOnStop;
};

const destroyListeners = () => {
  mediaRecorder.ondataavailable = undefined;
  mediaRecorder.onstop = undefined;
};

const handleOnStop = () => {
  destroyListeners();
  mediaRecorder = undefined;

  socket.close();
};

const handleOnDataAvailable = ({ data }) => {
  if (data.size > 0) {
    sendSocketMessage('chunk', data);
  }
};
