import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON data

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/aqualogix';  // Use your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a Mongoose schema for the user
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'customer' },  // Default role as 'customer'
});

const User = mongoose.model('User', userSchema);

// Define the /signup route (for both customers and companies)
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  // Check if email already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Account with this email already exists' });
  }

  try {
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,  // In a real app, hash the password before storing it
      role,  // Save the provided role (customer or company)
    });

    // Save the user to the database
    await newUser.save();

    // Return success message along with the role
    return res.status(200).json({ message: 'User registered successfully!', role: newUser.role });
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
