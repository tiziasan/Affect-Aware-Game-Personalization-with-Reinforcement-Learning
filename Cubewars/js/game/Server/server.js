const http = require('http');
const WebSocket = require('ws');

class Server {
  constructor() {}

  serve() {
    const httpServer = http.createServer((req, res) => {

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);


      if (req.method === 'OPTIONS') {

        res.writeHead(200);
        res.end();
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          console.log(`Received data from server: ${body}`);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(body);
            }
          });
          res.writeHead(200);
          res.end(JSON.stringify({ message: 'Data received' }));
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });

    const wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket');
    });

    httpServer.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  }
}

const server = new Server();
server.serve();
