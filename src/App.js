
import './App.css';
import {useState,useEffect,useRef} from "react"
import io  from "socket.io-client"
import { v4 } from 'uuid';


function App() {

  const [isconnected, setisconnected] = useState(false)

  const [messages, setmessages] = useState([])

  const [chatvisble, setchatvisble] = useState(false)
  const roomref = useRef("");
  const userref = useRef("")
  const newmessageref = useRef("");
  const newmessage = newmessageref.current.value;
  const socket = io("http://localhost:9000");
  const room = roomref.current.value;
  const username = userref.current.value;
  useEffect(() => {
     console.log("connected",socket.connected)
     socket.on("connect",()=>{
  
           setisconnected(true)
     })
     socket.on("disconnect",()=>{
      console.log("bye");
      setisconnected(false)
     })
  
    return () => {
      socket.off("connect")
      socket.off("disconnect")
    
    }
  }, [isconnected])
  useEffect(()=>{
    let ignore = false
    socket.on("recieve_msgs",({user,message})=>{
      console.log("hello from socket");
      console.log("from recieve",user,message)
      const d = `${user} send : ${message}`;
      console.log("before",messages)
      if(!ignore)
      setmessages((prev)=>[...prev,d])
      console.log("after",messages)
      return ()=>{
        ignore=true;
        console.log("hello from return");
      }

    })
  },[newmessage])
  const handelchatroom = ()=>{
    console.log("the userref value",userref.current.value)
    console.log(username);
    
      console.log("hello");
       setchatvisble(true)
       socket.emit("join_room",{room})
    
  }
  const handelemessage = (e)=>{
    console.log("from handle",newmessageref.current.value)
    
    const d = {user:username,message:newmessageref.current.value,room:room}
    socket.emit("send_msg",d)
    
   
    newmessageref.current.value = "";
  }
  return (
    <div className="App">
       { !chatvisble ?
      <div className="form">
   

        <p>Enter the details</p>
        <label htmlFor="room">Enter Room</label>
        <input id="room" ref={roomref} type="text"  />
        <label htmlFor="user">User Name</label>
        <input ref={userref} id="user" type="text"  />
        <button className='btn' onClick={handelchatroom}>Submit</button>
     
         
      </div>
      : 
      <div className="textfield">
      <h5>Room:{room} | user:{username}</h5>
      <div className='chatbox'>
   
        {messages.map((el)=><div key={v4()}> {el}</div>)}
      </div>
      <input type="text" ref={newmessageref} placeholder='Enter message' value={newmessage} />
      <button onClick={handelemessage}>Send</button>
      </div>
    
      
      }
     
    </div>
  );
}

export default App;
