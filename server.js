const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const connectDB = require('./config/db'); // Correct import
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

dotenv.config();
connectDB(); // Correctly calls the function

const corsOptions = {
    origin: 'http://localhost:5173', // Change this to your frontend URL
    credentials: true, // Include credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/nominees', require('./routes/nominee'));
app.use('/api/vote', require('./routes/vote'));

server.listen(3000, () => console.log('Server running on port 3000'));
