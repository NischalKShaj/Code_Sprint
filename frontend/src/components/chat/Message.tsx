// component for loading the chats

// importing the required modules
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Receiver {
  username: string | undefined;
  profileImage: string | undefined;
  isOnline: boolean | undefined;
}

interface MessageProps {
  senderId: string | undefined;
  receiverId: string | undefined;
  receiver: Receiver;
  socket: any;
}

interface Messages {
  message: string;
}

const Message = ({ senderId, receiverId, receiver, socket }: MessageProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);

  // for connecting to the socket
  useEffect(() => {
    socket.on("message", (message: Messages) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  // for fetching the previous chats by the sender and the receiver
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/message/get-conversation/${senderId}/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          console.log("chat response", response.data);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [receiverId, senderId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message, senderId, receiverId });
      setMessage("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {receiver.username}
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
          <li key={index}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Message;
