"use client";

// importing the required modules
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Receiver {
  username: string | undefined;
  profileImage: string | undefined;
  isOnline: boolean | undefined;
}

interface MessageProps {
  senderId: string;
  receiverId: string;
  receiver: Receiver;
  socket: any;
}

interface Messages {
  message: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
}

const Message = ({ senderId, receiverId, receiver, socket }: MessageProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (message: Messages) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
    };
  }, [socket]);

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
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    if (senderId && receiverId) {
      fetchData();
    }
  }, [receiverId, senderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message && senderId && receiverId) {
      const newMessage: Messages = {
        message,
        senderId,
        receiverId,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { senderId, receiverId });
  };

  return (
    <div className="flex justify-end w-full">
      <div className="chat-container w-full max-w-7xl">
        {" "}
        {/* Increased the width here */}
        <div className="chat-header flex items-center p-4 bg-gray-200 rounded-lg">
          <div className="relative">
            <Image
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
              src={receiver.profileImage || ""}
              alt="Receiver Profile Image"
            />
            <span
              className={`bottom-0 left-7 absolute w-3.5 h-3.5 ${
                receiver.isOnline ? "bg-green-400" : "bg-red-500"
              } border-2 border-white dark:border-gray-800 rounded-full`}
            ></span>
          </div>
          <div className="ml-4">
            <h3>{receiver.username}</h3>
            <span
              className={`text-sm ${
                receiver.isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {receiver.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="chat-messages h-96 overflow-y-auto p-4 bg-gray-100 rounded-lg">
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`flex ${
                  msg.senderId === senderId ? "justify-end" : "justify-start"
                }`}
              >
                <div className="message bg-blue-500 text-white p-2 rounded-lg max-w-xs break-words">
                  <p>{msg.message}</p>
                  <span className="text-xs text-gray-300">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))}
            {typing && (
              <li className="flex justify-start">
                <div className="message bg-gray-500 text-white p-2 rounded-lg max-w-xs break-words">
                  <p>Typing...</p>
                </div>
              </li>
            )}
          </ul>
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="chat-input flex items-center p-4 bg-white rounded-lg mt-2"
        >
          <input
            type="text"
            value={message}
            placeholder="Your message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleTyping}
            className="flex-grow p-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
