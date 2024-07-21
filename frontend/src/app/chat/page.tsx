"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create socket instance
const socket = io(`http://localhost:4000`, {
  transports: ["websocket", "polling"],
});

interface Message {
  name: string;
  message: string;
}

const Chat = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (name && message) {
      socket.emit("sendMessage", { name, message });
      setName("");
      setMessage("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={message}
          placeholder="Your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.name}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
