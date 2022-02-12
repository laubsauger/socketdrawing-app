const config = {
  socketServer: process.env.NODE_ENV === 'production' ? 'https://socket.osc.link' : 'http://localhost:8080',
  socketRoom: 'users',
};

export default config;