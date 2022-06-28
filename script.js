const video = document.querySelector("video");
const mediaOptions = document.querySelector(".selectmedia>select");
const screenshotImage = document.querySelector("img");
const snapshotbtn = document.querySelector(".snapshot");

// Enumerate Device

const selectCamera = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();

  const videoDevices = devices.filter((device) => device.kind === "videoinput");

  const options = videoDevices.map((videoDevice) => {
    console.log("select Media", videoDevice);
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  mediaOptions.innerHTML = options.join("");
};

selectCamera(); //run selectcamera function
streaming();

//end enumerate device
async function streaming() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // request cam
  video.srcObject = stream;
  video.play();
  snapshotbtn.disabled = false;

  snapshotbtn.onclick = () => {
    console.log("clicked");
    snapshot();
  };
}

// capture image
function snapshot() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  screenshotImage.src = canvas.toDataURL("image/webp");
  screenshotImage.classList.remove("d-none");

  setTimeout(function () {
    screenshotImage.classList.add("d-none");
  }, 5000);

  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/webp");
  a.download = "screenshort.webp";
  a.click();
}

// video
var mediaRecorder;

var _videoTrack = null;
var recordeddata = [];

const screensharebtn = document.querySelector(".sharescreen");
const stoprecording = document.querySelector(".stopRecording");
const pauserecording = document.querySelector(".pauseRecording");
const startrecording = document.querySelector(".startRecording");
const recordicon = document.getElementById("record");
var videoRecPlayer = document.querySelector(".playvideo");
var resumerecording = document.querySelector(".resumerecording");

startrecording.onclick = () => {
  console.log("start recording");
  streamingVideo();
};

async function streamingVideo() {
  const videostream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  video.srcObject = videostream;
  video.play();
  video.muted = true;

  if (videostream && videostream.getVideoTracks().length > 0) {
    _videoTrack = videostream.getVideoTracks()[0];
    _audioTrack = videostream.getAudioTracks()[0];
    console.log("video track", _videoTrack);
    // video.srcObject = new MediaStream([_videoTrack]);
  }

  var stream = new MediaStream([_videoTrack]);
  console.log("stream", stream);
  if (_videoTrack && _videoTrack.readyState === "live") {
    stream.addTrack(_audioTrack);
  }

  var mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp8,opus",
  });

  mediaRecorder.start(1000);

  mediaRecorder.ondataavailable = (e) => {
    console.log("size", e.data.size);
    if (e.data.size > 0) recordeddata.push(e.data);
  };

  mediaRecorder.onstart = () => {
    //display stop recording btn
    stoprecording.classList.remove("d-none");
    //display pause recording btn
    pauserecording.classList.remove("d-none");
    // record icon display
    recordicon.classList.remove("d-none");
    // sharescreen remove display
    screensharebtn.classList.add("d-none");
    // remove snapshot btn
    snapshotbtn.classList.add("d-none");
    // resume btn
    resumerecording.classList.remove("d-none");
  };

  stoprecording.onclick = () => {
    console.log("stoped");
    mediaRecorder.stop();
  };
  mediaRecorder.onstop = async () => {
    console.log("onstop");
    var blob = new Blob(recordeddata, { type: "video/webm" });
    console.log("blob", blob);
    let url = URL.createObjectURL(blob);

    videoRecPlayer.srcObject = null;
    videoRecPlayer.load();
    videoRecPlayer.src = url;
    videoRecPlayer.play();
    videoRecPlayer.muted = false;

    videoRecPlayer.classList.remove("d-none");
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    a.download = "video.webm";
    a.click();

    setTimeout(function () {
      location.reload();
    }, 5000);
  };
  pauserecording.onclick = () => {
    mediaRecorder.pause();
  };
  mediaRecorder.onpause = () => {
    console.log("pause");
  };
  resumerecording.onclick = () => {
    mediaRecorder.resume();
  };
  mediaRecorder.onresume = () => {
    console.log("resume");
  };
}

// screen share

var screenmediaRecorder;
var _screenvideoTrack = null;
var _screenaudioTrack= null;
var recordedscreendata = [];

const recorderbtn = document.querySelector('.startRecording');

 const stopscreensharebtn = document.querySelector('.stopsharescreen');
screensharebtn.onclick=()=>{
  console.log("share screen start");

  getaudio()
  streamingScreenshort()

}
async function streamingScreenshort() {
  const screenstream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  video.srcObject = screenstream;
  video.play();
  video.muted = true;

  if (screenstream && screenstream.getVideoTracks().length > 0) {
    _screenvideoTrack = screenstream.getVideoTracks()[0];
  //  await video.srcObject = new MediaStream([_screenvideoTrack,_screenaudioTrack]);
  }

  var sstream = new MediaStream([_screenvideoTrack]);
   console.log("stream", sstream);
  if (_screenvideoTrack && _screenvideoTrack.readyState === "live") {
    
   console.log("live", _screenaudioTrack);
   sstream.addTrack(_screenaudioTrack);
  }

  var screenmediaRecorder = new MediaRecorder(sstream, {
    mimeType: "video/webm; codecs=vp8,opus",
  });

  screenmediaRecorder.start(1000);

  screenmediaRecorder.ondataavailable = (e) => {
    console.log("size", e.data.size);
    if (e.data.size > 0) recordedscreendata.push(e.data);
  };

  screenmediaRecorder.onstart = () => {
    
    //hide recording btn
    recorderbtn.classList.add("d-none");
    //display stop recording btn
    stoprecording.classList.add("d-none");  
    // screenshare.classList.add("d-none");
    stopscreensharebtn.classList.remove("d-none");
    // remove snapshot btn
    snapshotbtn.classList.add("d-none");
    
  };

  stopscreensharebtn.onclick = () => {
    console.log("stoped");
    screenmediaRecorder.stop();
  };
  screenmediaRecorder.onstop = async () => {
    console.log("onstop");
    var blob = new Blob(recordedscreendata, { type: "video/webm" });
    console.log("blob", blob);
    let url = URL.createObjectURL(blob);

    videoRecPlayer.srcObject = null;
    videoRecPlayer.load();
    videoRecPlayer.src = url;
    videoRecPlayer.play();
    videoRecPlayer.muted = false;

    videoRecPlayer.classList.remove("d-none");
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    a.download = "video.webm";
    a.click();

    setTimeout(function () {
      location.reload();
    }, 5000);
  };
  
}
getaudio =async()=>{
  const audiotrack = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  _screenaudioTrack = audiotrack.getAudioTracks()[0];

  _screenaudioTrack.enabled = true;

}
