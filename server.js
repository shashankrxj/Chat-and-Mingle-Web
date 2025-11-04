const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require('express-session'); // used for user._id from indexafterlogin to create
const cookieParser = require('cookie-parser');



const app = express();

// used for user._id from indexafterlogin to create
app.use(session({
  secret: 'ccfd76eb0731ee1e0b0a34bdc77840ec3667e83c79ea6278ab7844c00c06e946',
  resave: false,
  saveUninitialized: false
}));

const dotenv = require("dotenv");
const connectDB = require("./Server/database/connection");

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;

connectDB();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.use(cookieParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve assets
app.use("/img", express.static(path.resolve(__dirname, "Assets/img")));
app.use("/fonts", express.static(path.resolve(__dirname, "Assets/fonts")));

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Serve sitemap.xml statically
app.use("/sitemap.xml", express.static(path.resolve(__dirname, "sitemap.xml")));

var server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  allowEIO3: true, //False by default
});

const users = new Map();
const waitingUsers = new Set();
const chatPairs = new Map();
var randomUserCount = Math.floor(Math.random() * 40) + 73;

io.on('connection', (socket) => {
  // Add user to waiting list when they connect
  socket.on('find chat', () => {
    if (waitingUsers.size > 0) {
      // Find a random user to chat with
      const waitingArray = Array.from(waitingUsers);
      const randomIndex = Math.floor(Math.random() * waitingArray.length);
      const partnerId = waitingArray[randomIndex];
      
      // Remove the matched user from waiting list
      waitingUsers.delete(partnerId);
      
      // Create chat pair
      chatPairs.set(socket.id, partnerId);
      chatPairs.set(partnerId, socket.id);
      
      // Notify both users
      socket.emit('chat started');
      io.to(partnerId).emit('chat started');
    } else {
      // Add user to waiting list
      waitingUsers.add(socket.id);
    }
    
    // Update online count
    const totalUsers = users.size + randomUserCount;
    io.emit('updateUserCount', totalUsers);
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    const partnerId = chatPairs.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('chat message', message);
    }
  });

  // Handle finding new chat
  socket.on('find new chat', () => {
    const oldPartnerId = chatPairs.get(socket.id);
    if (oldPartnerId) {
      // Notify old partner
      io.to(oldPartnerId).emit('chat ended');
      // Remove old chat pair
      chatPairs.delete(socket.id);
      chatPairs.delete(oldPartnerId);
    }
    
    // Start looking for new chat
    socket.emit('finding chat');
    if (waitingUsers.size > 0) {
      const waitingArray = Array.from(waitingUsers);
      const randomIndex = Math.floor(Math.random() * waitingArray.length);
      const newPartnerId = waitingArray[randomIndex];
      
      waitingUsers.delete(newPartnerId);
      
      chatPairs.set(socket.id, newPartnerId);
      chatPairs.set(newPartnerId, socket.id);
      
      socket.emit('chat started');
      io.to(newPartnerId).emit('chat started');
    } else {
      waitingUsers.add(socket.id);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove from waiting list if present
    waitingUsers.delete(socket.id);
    
    // End chat if in one
    const partnerId = chatPairs.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('chat ended');
      chatPairs.delete(socket.id);
      chatPairs.delete(partnerId);
    }
    
    // Update user count
    users.delete(socket.id);
    const totalUsers = users.size + randomUserCount;
    io.emit('updateUserCount', totalUsers);
  });
});

// Function to update random user count every 120 seconds
setInterval(() => {
  randomUserCount = Math.floor(Math.random() * 40) + 73; // Random count between 73 and 112
  let adjustedUserCount = userConnection.length + randomUserCount;
  io.emit("updateUserCount", adjustedUserCount);
}, 120000);
