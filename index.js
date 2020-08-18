// A small NodeJS application meant for controlling presentations over WiFi/LAN using the HTTP protocol and the sendkeys NodeJS module.
// Copyright (C) 2020  Ebbe Zeinstra

const sendkeys = require('sendkeys');
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');

if (process.argv[2] == "local") {
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
      res.write(fs.readFileSync(path.join(__dirname, "webremote.html")));
    } else {
      console.log("connection requested non-existing file.")
      res.writeHead(404, {"Content-Type": "text/html"});
      res.write("<h1>404 Page not found!</h1>The page you were trying to access could not be found.")
    }
    res.end();
  }).listen(5223, () => {
    console.log("Started a WebRemote Server on this host using port 5223");
  })
} else if (process.argv[2] == "proxy") {
  var host = "webremote.cequention.com";
  const port = 5224;
  if (process.argv[3]) host = process.argv[3];
  if (process.argv[4]) port = parseInt(process.argv[4]);

  const con = net.createConnection(port, host, () => {
    console.log("Connected to host " + host + ":" + port);
  });

  con.on('data', (data) => {
    const dataS = data.toString();
    if (dataS.startsWith("ID")) {
      console.log("You should now be able to go to http://" + host + ", and log in with ID: " + dataS.split(" ")[1]);
    } else if (dataS == "left") {
      sendkeys("{left}");
    } else if (dataS == "right") {
      sendkeys("{right}");
    }
  });
  
  con.on('end', () => {
    console.log('Disconnect from sock server');
  });

  con.on('error', (err) => {
    if (err.code == "ECONNREFUSED") console.log("Could not connect to " + host + " on port " + port + ". Connection was refused.");
    if (err.code == "ENOTFOUND") console.log(host + " does not exist!");
    else console.log("Error: " + err);
  })

  const cleanup = () => {
    con.end();
  }
  process.on('exit', cleanup)
 
  process.on('SIGINT', cleanup);
}