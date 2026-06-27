const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
