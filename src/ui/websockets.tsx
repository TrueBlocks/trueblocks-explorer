let {
  socket, socketReady, listeners, messageQueue,
} = getInitialState();

function getInitialState() {
  return {
    socket: null,
    socketReady: false,
    listeners: [],
    messageQueue: [],
  };
}

function callListeners(message: any) {
  // @ts-ignore
  listeners.forEach((listener) => listener(message));
}

export function addMessageListener(listener: any) {
  // @ts-ignore
  listeners.push(listener);
}

export function addActionListener(actionToListenFor: any, listener: any) {
  const actionListener = (message: any) => {
    const { action } = message;

    if (!action) {
      throw new Error('Unsupported message format, missing action');
    }

    if (action !== actionToListenFor) return;

    listener(message);
  };

  // @ts-ignore
  listeners.push(actionListener);

  return actionListener;
}

export function removeListener(listenerToRemove: any) {
  listeners = listeners.filter((listener) => listener !== listenerToRemove);
}

export function send(action: any, message: any) {
  if (!socketReady) {
    // @ts-ignore
    messageQueue.push([action, message]);
    return false;
  }

  const messageObject = {
    action,
    ...message,
  };
  // @ts-ignore
  socket.send(JSON.stringify(messageObject));
  return true;
}

export function clear() {
  const state = getInitialState();

  // @ts-ignore
  socket.close();

  socket = state.socket;
  socketReady = state.socketReady;
  listeners = state.listeners;
  messageQueue = state.messageQueue;
}

export function setup({ host = 'localhost', port = 8080, path = 'websocket' } = {}) {
  // @ts-ignore
  socket = new WebSocket(`ws://${host}:${port}/${path}`);
  // @ts-ignore
  socket.addEventListener('open', () => {
    socketReady = true;
    messageQueue.forEach((message) => send.apply(null, message));
    messageQueue = [];
  });
  // @ts-ignore
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);

    callListeners(message);
  });
}
