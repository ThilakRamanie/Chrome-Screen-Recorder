console.log("I have been injected");

var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  recorder.start();
  recorder.onstop = function () {
    stream.getTracks().map((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  recorder.ondataavailable = function (event) {
    var recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("Requesting Recording");
    sendResponse("Processed: start recording");
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 99999999999,
          height: 99999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }
  if(message.action === "stopvideo") {
    sendResponse("Processed: stop recording");
    if(!recorder) return console.log("no recorder")
    recorder.stop();
  }
});
