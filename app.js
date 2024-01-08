const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
}).listen(3000);

console.log("Server running on port 3000");

