export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Join board room
    const { boardId } = socket.handshake.query;
    if (boardId) {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    }

    // Listen for card moves
    socket.on('card:move', (data) => {
      io.to(data.boardId).emit('card:moved', data);
    });

    // Listen for list changes
    socket.on('list:add', (data) => {
      io.to(data.boardId).emit('list:added', data);
    });
    socket.on('list:update', (data) => {
      io.to(data.boardId).emit('list:updated', data);
    });

    // Card updates (title, description, etc.)
    socket.on('card:update', (data) => {
      io.to(data.boardId).emit('card:updated', data);
    });

    // Timer expired event (triggered by cron job)
    socket.on('timer:expired', (data) => {
      io.to(data.boardId).emit('timer:expired', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });
};