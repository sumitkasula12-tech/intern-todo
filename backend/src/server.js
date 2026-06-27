const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.\nRun: taskkill /F /IM node.exe   (kills all node processes)\nOr:  netstat -ano | findstr :${PORT}   (find the PID, then: taskkill /PID <PID> /F)\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
