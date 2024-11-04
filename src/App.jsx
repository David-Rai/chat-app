import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [client] = useState(() => io("https://chat-app-server-p0cr.onrender.com/")); // Only initialize once
  const nameRef = useRef(null);
  const [created, setCreated] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);

  //web sockets
  useEffect(() => {
    //reading the message
    client.on("join-message", (message) => {
      alert(message);
    });

    //reading the sented message
    client.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [client]);

  //joining the room
  const handleJoin = () => {
    //sending to the server
    if(nameRef.current.value){
      client.emit("name", nameRef.current.value);
      setCreated(true);
    }
    else
    {
      alert("k ko timro nam ?")
    }
  };

  //Sending the message to the server
  const handleSend = () => {
    if(messageRef.current.value){
      client.emit("send-message", messageRef.current.value);
      messageRef.current.value = "";  
    }else{
      alert("Message at lekha yrr")
    }
   };

  return (
    <main className="h-screen w-full flex items-center justify-center bg-slate-200">
      {/* Messages */}
      {created ? (
        <div className="h-screen w-full relative p-2">
          <div className="h-[90vh] w-full">
            {messages && messages.map((m, index) =>
               <div key={index} 
               className={`flex w-full 
               ${m.sender_id == client.id ? "justify-end" : "justify-start"}`}>
                <p className="bg-gray-400 px-2 m-2 rounded-l">{m.message}</p>
                </div>)}
          </div>

          {/* sending */}
          <div className="w-full absolute bottom-0 left-0 h-[10vh] bg-slate-200 flex items-center justify-around">
            <input
              type="text"
              placeholder="send message"
              ref={messageRef}
              className="w-[60%] pl-2 rounded-md h-[60%]"
            />
            <button
              onClick={handleSend}
              className="h-[60%] w-[120px] bg-blue-600 text-white rounded-md"
            >
              send
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 shadow-md w-[60%] h-[20vh] flex flex-col p-4 items-center justify-evenly rounded-md">
          <input
            type="text"
            placeholder="Enter your name"
            ref={nameRef}
            className="px-2 h-[40%] w-full"
          />
          <button
            onClick={handleJoin}
            className="m-2 rounded-md bg-blue-600  text-white text-sm h-[40px] w-[120px]"
          >
            JOIN ROOM
          </button>
        </div>
      )}
    </main>
  );
};

export default App;
