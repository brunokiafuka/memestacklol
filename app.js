const http = require("http");

http.createServer(function (req, res){
 res.write("Mastering the Craft");
 res.end();
}).listen(3000);

console.log("Server running on port 3000");

