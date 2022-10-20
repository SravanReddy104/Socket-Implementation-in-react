// import express from "express"
// import cors from "cors"
// import {Server} from "socket.io";
// import http from "http"


// const app = express()
// var server = http.createServer(app)
// app.use(express.json())
// app.use(cors())
// const io = new Server(server,{
//     cors:{
//         origin:"*",
      
//     }
// })
// io.on("connection",(socket)=>{
//     console.log(`a user connected at ${socket.id}`)
//     socket.on("join_room",({room})=>{
//         socket.join(room)
//     })
//     socket.on("send_msg",({room,user,message})=>{
//         const d = {user:user,message:message}
//         socket.to(room).emit("recieve_msg",d)
//     })
// })


// const PORT = process.env.PORT || 9000;
// server.listen(PORT,()=>{console.log(`listened at ${PORT}`);})

import express from "express"
import {Server} from "socket.io"
import cors from "cors"

const port = process.env.PORT || 9000;
const app = express();
app.use(cors())
const server = app.listen(port,console.log("connected at",port))
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log("socket connected",socket.connected);
    socket.on("join_room",(room)=>{
        socket.join(room)
    })
    socket.on("send_msg",({room,user,message})=>{
        const d = {
            user:user,
            message:message,
        }
        console.log(d);
        socket.to(room).emit("recieve_msgs", d)
    })
})