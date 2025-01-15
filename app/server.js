const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Simulate real-time data every second
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value: Math.random() * 100, // Random simulated data
    };
    ws.send(JSON.stringify(data)); // Send data to the client
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
