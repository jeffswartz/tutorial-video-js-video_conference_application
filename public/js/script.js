var sessionIdText = document.getElementById('session');
var joinButton = document.getElementById('join');
var createButton = document.getElementById('create');
var previewContainer = document.getElementById('preview');
var previewButton = document.getElementById('start-preview');
var audioSelector = document.getElementById('audio-source');
var videoSelector = document.getElementById('video-source');
var nameText = document.getElementById('name');
let publisher;

async function onCreateClicked() {
  try {
    const response = await fetch('/api/create', {method: 'post'})
    const data = await response.json();
    const name = nameText.value;
    if(name !== "") {
      if(publisher) {
        setDevicePreference();
      }
      window.location.href = `/session/${data.sessionId}?name=${name}`;
    } else {
      alert("Name required");
    }
  } 
  catch (e) {
    console.log(e);
  }
}

function setDevicePreference() {
  const audioSourceId = publisher.getAudioSource().id;
  const videoSourceId = publisher.getVideoSource().deviceId;
  const videoEnabled = publisher.getVideoSource().track ? true : false;
  const audioEnabled = publisher.getAudioSource().enabled;

  localStorage.setItem('audioSourceId', audioSourceId);
  localStorage.setItem('videoSourceId', videoSourceId);
  localStorage.setItem('audioEnabled', JSON.stringify(audioEnabled));
  localStorage.setItem('videoEnabled', JSON.stringify(videoEnabled));
}

function onJoinClicked() {
  const sessionId = sessionIdText.value;
  const name = nameText.value;
  if(sessionId !== "" && name !== "") {
    if(publisher) {
      setDevicePreference();
    }
    window.location.href = `/session/${sessionId}?name=${name}`;
  } else {
    alert("Name and SessionID required");
  }
}

async function loadAVSources() {
  let audioCount = 0;
  let videoCount = 0;
  OT.getDevices((err, devices) => {
    if (err) {
      alert('Not a supported browser');
    }
    devices.forEach(device => {
      if (device.kind.toLowerCase() === 'audioinput') {
        audioCount += 1;
        audioSelector.innerHTML += `<option value="${device.deviceId}">${device.label}</option>`;
      }
      if (device.kind.toLowerCase() === 'videoinput') {
        videoCount += 1;
        videoSelector.innerHTML += `<option value="${device.deviceId}">${device.label}</option>`;
      }
    });
    audioSelector.innerHTML += `<option value="">No audio</option>`;
    videoSelector.innerHTML += `<option value="">No video</option>`; 
  })
}

loadAVSources();

createButton.addEventListener('click', onCreateClicked);
joinButton.addEventListener('click', onJoinClicked);

previewButton.addEventListener('click', () => {
  publisher = OT.initPublisher(previewContainer, {height: '100%', width: '100%'})
  if(audioSelector.value === "") {
    publisher.publishAudio(false);
  } else {
    publisher.setAudioSource(audioSelector.value);
    publisher.publishAudio(true);
  }

  if(videoSelector.value === "") {
    publisher.publishVideo(false);
  } else {
    publisher.setVideoSource(audioSelector.value);
    publisher.publishVideo(true);
  }
})

audioSelector.addEventListener('change', e => {
  if(publisher) {
    console.log(publisher.getVideoSource());
    console.log(publisher.getAudioSource());
    if(audioSelector.value === "") {
      publisher.publishAudio(false);
    } else {
      publisher.setAudioSource(audioSelector.value);
      publisher.publishAudio(true);
    }
  }
})

videoSelector.addEventListener('change', () => {
  if(publisher) {
    console.log(publisher.getVideoSource());
    console.log(publisher.getAudioSource())
    if(videoSelector.value === "") {
      publisher.publishVideo(false);
    } else {
      publisher.setVideoSource(audioSelector.value);
      publisher.publishVideo(true);
    }
  }
})

