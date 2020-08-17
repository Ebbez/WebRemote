//A small NodeJS application meant for controlling presentations over WiFi/LAN using the HTTP protocol and the sendkeys NodeJS module.
// Copyright (C) 2020  Ebbe Zeinstra

const sendkeys = require('sendkeys');
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  if (req.url == "/left") {
    console.log("Left sendkeypress request");
    sendkeys("{left}");
    res.writeHead(200);
    res.write("OK");
  } else if (req.url == "/right") {
    console.log("Right sendkeypress request");
    sendkeys("{right}")
    res.writeHead(200);
    res.write("OK");
  } else if (req.url == "/") {
    console.log("literemote.html request")
    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(fs.readFileSync(path.join(__dirname, "literemote.html")));
  } else {
    console.log("connection requested non-existing file.")
    res.writeHead(404, {"Content-Type": "text/html"});
    res.write("<h1>404 Page not found!</h1>The page you were trying to access could not be found.")
  }
  res.end();
}).listen(5223, () => {
  console.log("Started a WebRemote Server on this host using port " + 5223);
})