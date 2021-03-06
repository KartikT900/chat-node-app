const socket = io('/');
const otherUser = {
  userId: ''
};
const peerCon = {
  peer: ''
};
const userStream = {
  stream: ''
};

getUserMedia();

/**
 *
 * @param {string} element to be created onto the DOM
 * @param {string} parent to which the newly created element will be appended. * If no parent is specified, then the element will be added directly to the
 * document.
 * @param {string} content the content to be added as innerText to the created element.
 */
function renderHtml(parent, content, element = 'p') {
  const parentEl = document.getElementById(parent);
  const newElement = document.createElement(element);

  newElement.innerText = content;
  if (!parentEl) {
    document.body.appendChild(newElement);
    return;
  }

  return parentEl.appendChild(newElement);
}

// This is when we are recieving the call from the other peer. That is, we are on the receiver side of this call.
async function handleCallRequest(incomingCall) {
  console.log(incomingCall);
  peerCon.peer = createPeer();
  const desc = new RTCSessionDescription(incomingCall.sdp);

  try {
    await peerCon.peer.setRemoteDescription(desc);
    await userStream.stream
      .getTracks()
      .forEach((track) => peerCon.peer.addTrack(track, userStream.stream));
    await peerCon.peer.setLocalDescription(await peerCon.peer.createAnswer());

    const payload = {
      target: incomingCall.caller,
      caller: socket.id,
      sdp: peerCon.peer.localDescription
    };
    console.log({ payload });
    socket.emit('answer', payload);
  } catch (e) {
    console.log(e);
  }
}

async function handleNegotiationNeeded(userId) {
  try {
    console.log('called');
    await peerCon.peer.setLocalDescription(await peerCon.peer.createOffer());

    const payload = {
      target: userId,
      caller: socket.id,
      sdp: peerCon.peer.localDescription
    };

    socket.emit('offer', payload);
  } catch (e) {
    console.log(e);
  }
}

// remoteStream may contain both audio and video (depending on what the remote peer accepted to share).
function handleTrackEvent(remoteStream) {
  console.log('inside handletrackevent');
  const remoteVideo = document.getElementById('partner-video');
  remoteVideo.srcObject = remoteStream.streams[0];
}

// This userId represents the id of the person we are going to call/will be sending out offer to.
function createPeer(userId) {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.ideasip.com'
      },
      {
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }
    ]
  });

  peer.onicecandidate = handleIceCandidateEvent;
  peer.ontrack = handleTrackEvent;
  peer.onnegotiationneeded = () => handleNegotiationNeeded(userId);

  return peer;
}

function requestForCall(userId) {
  peerCon.peer = createPeer(userId);
  userStream.stream
    .getTracks()
    .forEach((track) => peerCon.peer.addTrack(track, userStream.stream));
}

async function handleAnswer(message) {
  const desc = new RTCSessionDescription(message.sdp);
  try {
    await peerCon.peer.setRemoteDescription(desc);
  } catch (e) {
    console.log('error inside handlenaswer:', e);
  }
}

function handleIceCandidateEvent(event) {
  if (event?.candidate) {
    const payload = {
      target: otherUser.userId,
      candidate: event?.candidate
    };

    socket.emit('ice-candidate', payload);
  }
}

async function handleIceCandidateMsg(incomingMsg) {
  const candidate = new RTCIceCandidate(incomingMsg);
  try {
    await peerCon.peer.addIceCandidate(candidate);
  } catch (e) {
    console.log(e);
  }
}

async function getUserMedia() {
  await navigator.getUserMedia(
    { video: true },
    (stream) => {
      selfVideo = document.getElementById('self-video');
      userStream.stream = stream;
      selfVideo.srcObject = stream;

      socket.emit('join-room', roomId);

      socket.on('new-user', (userId) => {
        requestForCall(userId);
        otherUser.userId = userId;
      });

      socket.on('user-joined', (userId) => {
        otherUser.userId = userId;
      });

      socket.on('offer', handleCallRequest);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidateMsg);
    },
    () => console.log('no media device found!!')
  );
}
