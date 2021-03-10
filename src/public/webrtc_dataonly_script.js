const socket = io('/');
const otherUser = {
  userId: ''
};
const peerCon = {
  peer: ''
};

const sendChannel = {
  current: ''
};

/**
 * Sample structure:
 * const messageList = [
 * {
 *   self: false,
 *   message: 'Hello'
 * },
 * {
 *   self: true,
 *   message: 'Fine!'
 * }
 * ]
 */
const messageList = [];
const message = {
  current: ''
};

const throttledEvent = _.throttle(emitTypeEvent, 500);
document.getElementById('m').addEventListener('input', handleInput);

initiateChat();

function emitTypeEvent() {
  socket.emit('on-type', { id: socket.id, room: roomId });
}

function setMessages(message, type) {
  if (type === 'self') {
    messageList.push({ self: true, message });
  } else {
    messageList.push({ self: false, message });
  }

  renderHtml('messages', { message, type }, 'li');
}

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

  if (content.type === 'self') {
    newElement.innerText = `You --> ${content.message}`;
  } else {
    newElement.innerText = `Remote --> ${content.message}`;
  }

  if (!parentEl) {
    document.body.appendChild(newElement);
    return;
  }

  return parentEl.appendChild(newElement);
}

function handleInput() {
  throttledEvent();
}

function handleTypingStopEvent() {
  socket.emit('on-type-stop', { id: socket.id, room: roomId });
}

function handleRecieveDataChannel(event) {
  sendChannel.current = event.channel;
  sendChannel.current.onmessage = handleRecieveMessage;
}

function sendMessage() {
  const message = document.getElementById('m');
  sendChannel.current.send(message.value);
  setMessages(message.value, 'self');
  message.value = '';
  message.focus();
  handleTypingStopEvent();
}
// This is when we are recieving the call from the other peer. That is, we are on the receiver side of this call.
async function handleCallRequest(incomingCall) {
  peerCon.peer = createPeer();
  peerCon.peer.ondatachannel = handleRecieveDataChannel;
  const desc = new RTCSessionDescription(incomingCall.sdp);

  try {
    await peerCon.peer.setRemoteDescription(desc);
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
  peer.onnegotiationneeded = () => handleNegotiationNeeded(userId);

  return peer;
}

function handleRecieveMessage(event) {
  setMessages(event.data, 'remote');
}

function requestForChat(userId) {
  peerCon.peer = createPeer(userId);
  sendChannel.current = peerCon.peer.createDataChannel('send-message');
  sendChannel.current.onmessage = handleRecieveMessage;
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

function handleTypeEvent(id, active) {
  const p = document.getElementById('typing');
  p.innerHTML = active ? `<strong>${id}</strong> is typing.....` : '';
}

function initiateChat() {
  socket.emit('join-room', roomId);

  socket.on('new-user', (userId) => {
    requestForChat(userId);
    otherUser.userId = userId;
  });

  socket.on('user-joined', (userId) => {
    otherUser.userId = userId;
  });

  socket.on('offer', handleCallRequest);
  socket.on('answer', handleAnswer);
  socket.on('ice-candidate', handleIceCandidateMsg);

  socket.on('on-type', (id) => {
    handleTypeEvent(id, true);
  });

  socket.on('on-type-stop', (id) => {
    handleTypeEvent(id, false);
  });
}
