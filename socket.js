const { WebSocketServer } = require('ws');
const crypto = require('node:crypto');

// Create a WebSocket server instance on port 8080
const hostname = '127.0.0.1'
const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: port});
console.log(`Server running at http: ${hostname}:${port}`)
const clients = new Map();
var chat_history = `${new Date().toLocaleString()} New chat history <br>`;

wss.on('connection', (ws) => {
    console.log(`${new Date().toLocaleString()} socket L16 Client connected`);
            ws.send(JSON.stringify({"type": "message", "message": chat_history}));
    ws.on('message', (data) => {
        // FIX: Convert Buffer to string to avoid encoding issues
        const raw_message = data.toString();
        var parsed_json;
        console.log("JS L21 raw message:", raw_message)
        try {
          parsed_json = JSON.parse(raw_message);
          console.log("JS L25 parsed JSON:", parsed_json)
          } catch (error) {
          console.error("Failed to parse JSON:", error.message);
}
        //console.log(`${new Date().toLocaleString()} JS L26 Received raw message: ${raw_message} \n`);

        // Send a message back to the client
        if (parsed_json.type == 'message') {
          chat_history += ` ${new Date ().toLocaleString()} ${parsed_json.message} <br>`;
          for (const client of clients.values()) {
            const chat_json = JSON.stringify({"type": "message", "message": chat_history});
            client.send(chat_json);
          }
        //ws.send(`JS L36 received your message: ${JSON.stringify(parsed_json, null, 2)}`);
        }
        if (parsed_json.type == 'clientId') {
            console.log("got a clientId")
            if (parsed_json.clientId == "null") {
              const clientId = crypto.randomUUID();
              console.log(`generated new UUID: ${clientId}`);
            sendMessage(JSON.stringify({"type": "clientId", "clientId": clientId}));
            } else {
            console.log(`${new Date().toLocaleString()} JS L46 received clientId: ${parsed_json.clientId}`)
            }
            //const ws = this
            ws.clientId = parsed_json.clientId
            clients.set(parsed_json.clientId, ws)
            console.log("JS L58 clients:", clients)
        }
    });

    ws.on('close', () => {
            console.log("JS L56 clients:", clients)
        console.log(`${new Date().toLocaleString()} socket L57 Client: ${this.clientId} disconnected`);
        clients.delete(ws.clientId);
            console.log("JS L59 clients:", clients)
    });
    function sendMessage(message) {
          if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
          } else {
        console.error("WebSocket is not open. Current state: " + socket.readyState);
        // Optional: Queue the message to send later when onopen fires
    }
        }

    // Handle internal errors to prevent the server from crashing
    ws.on('error', console.error);
});
