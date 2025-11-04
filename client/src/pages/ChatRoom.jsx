import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import '../styles/ChatRoom.scss';

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('updateUserCount', (userCount) => {
      setOnlineUsers(userCount);
    });

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const handleNextChat = () => {
    setMessages([]);
    socket.emit('find new chat');
  };

  const handleReport = () => {
    // Implement report functionality
  };

  return (
    <main className="chat-room">
      <div className="chat-container">
        <div className="chat-header">
          <p className="connection-status">
            {isConnected ? 'Connected to stranger' : 'Connecting to new user...'}
          </p>
          <button className="report-button" onClick={handleReport}>
            Report User
          </button>
          <div className="online-count">{onlineUsers} online now</div>
        </div>

        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>

        <div className="chat-controls">
          <div className="next-chat-btn" onClick={handleNextChat}>
            Next
          </div>
          <div className="message-input">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="send-button" onClick={handleSendMessage}>
            <SendIcon />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatRoom;
