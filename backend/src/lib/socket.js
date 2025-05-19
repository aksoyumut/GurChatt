import http from "http";
import express from "express";
import {Server} from "socket.io";



const userSocketMap = {};
const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors : {
    origin : ["http://localhost:5173"],
    credentials: true
}
});


export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


io.on ("connection" , (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    //io.emit() tüm bağlı kullancılara olayı göndermek için kullanılır.  
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Kullanıcı bağlandı " , socket.id);

    socket.on ("disconnect" , ()=> {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("Kullancının bağlantısı kesildi" , socket.id);
        
    });
});




export {
    io , app  , server , userSocketMap
};
