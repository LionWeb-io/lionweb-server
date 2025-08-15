import { WebSocketServer } from "ws";

const server = new WebSocketServer({
    port: 3005
});

server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        const m = JSON.parse(message.toString())
        console.log(JSON.stringify(m, null, 4))
        socket.send(`Server: ${message}`);
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:5000');
console.log("Listening ...")
