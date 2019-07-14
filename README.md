# PotatoChat-NodeJS-Server-V1.04
This is a websocket server written in Node JS to work with the web chat client and Android chat client.  
This is an amatueur project written out of boredom and without a purpose hence the only purpose it has got would be sharing with everyone.


Instruction of how to use
1) Place the two files Wss.js and userinfo.txt in any folder in your local disc.
2) You must have Node.js installed before you could excecute this server.  I am using visual studio code for Node JS.
3) Instruction on installing Node JS for VSC can be found here https://code.visualstudio.com/docs/nodejs/nodejs-tutorial.
4) In VS code terminal, type in, "cd /Users/jetty/Visual\ Studio\ Code\ project/Node\ js/WebSocketServer" to set path of folder in your local disc.
5) Then, type in, "node Wss.js" to execute the server.

Instruction on how to change websocket port number of server
1) Open Wss.js file.
2) Go to line 184, by default, this line should have code as "const wss = new WebSocket.Server({ port: 8080 })".
3) Simply change port number 8080 to any number you desire.



