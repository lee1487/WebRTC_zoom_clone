//const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    console.log(2);
    // 1: 내 영상 2:상대방 일 때 2에서 사용
    peer.on('call', call => {
        call.answer(stream);
        console.log("면접자 : "+ 3);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            console.log("면접자 : "+ 4);
            addVideoStream(video, userVideoStream);
        })
    });

    socket.on('user-connected', (userId) => {
        console.log("면접관 : "+ 3);
        setTimeout(function () {
            connectToNewUser(userId, stream);
        }, 1000);
    });

    let text =$('input');

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            console.log(text.val());
            socket.emit('message', text.val());
            text.val('');
        }
    });

    socket.on('createMessage', message => {
        console.log("message::: " + message);
        console.log($('ul'));
        $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom();
    });

});

peer.on('open', id => {
    console.log(1);
    console.log("peerId:" + id);
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
    console.log('new user');
    console.log("connectToNewUser In userId:" + userId);
    console.log("면접관 : "+ 4);
    // 1: 내 영상 2:상대방 일 때 1에서 사용
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        console.log("면접관 : "+ 5);
        addVideoStream(video, userVideoStream);
    });

}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}

// Mute our video 
const  muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }