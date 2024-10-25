import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique order IDs
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/aqualogix'; // Use your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a Mongoose schema for the user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, you should hash passwords
  role: { type: String, enum: ['customer', 'company'], default: 'customer' }, // Default to 'customer'
});

const User = mongoose.model('User', userSchema);

const shippingRequestSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Unique Order ID
  source: String,
  destination: String,
  goodsType: String,
  weight: Number,
  shippingDetails: {
    vessel: String,
    container: String,
    shippingCompany: String,
    estimatedCost: Number,
    estimatedTime: String,
    trackingNumber: String,
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Delivered'], default: 'Pending' }, // Status field
  createdAt: { type: Date, default: Date.now },
});

const ShippingRequest = mongoose.model('ShippingRequest', shippingRequestSchema);

// Define the /signup route for customers and companies
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Account with this email already exists' });
  }

  try {
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password, // In a real app, hash the password before storing it
      role, // Set role dynamically (either 'customer' or 'company')
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

// Define the /shipping-request route for saving shipping details
app.post('/shipping-request', async (req, res) => {
  const { source, destination, goodsType, weight, shippingDetails } = req.body;

  // Basic validation
  if (!source || !destination || !goodsType || !weight || !shippingDetails) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  try {
    // Create a new shipping request instance with a unique order ID
    const newShippingRequest = new ShippingRequest({
      orderId: uuidv4(), // Generate a unique order ID
      source,
      destination,
      goodsType,
      weight,
      shippingDetails,
    });

    // Save the shipping request to the database
    await newShippingRequest.save();

    // Return success message
    return res.status(200).json({ message: 'Shipping request saved successfully!' });
  } catch (error) {
    console.error('Error saving shipping request:', error);
    return res.status(500).json({ message: 'Error saving shipping request' });
  }
});

// Define the /shipping-requests route for getting all shipping requests
app.get('/shipping-requests', async (req, res) => {
  try {
    const requests = await ShippingRequest.find({}, '-shippingDetails'); // Exclude shippingDetails
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching shipping requests:', error);
    res.status(500).json({ message: 'Error fetching shipping requests' });
  }
});

// Define the schema for ports
const portSchema = new mongoose.Schema({
  country: { type: String, required: true },
  port: { type: String, required: true },
  unlocode: { type: String, required: true },
  departuresLast24hrs: { type: Number, required: true },
  vesselsInPort: { type: Number, required: true },
  arrivalsLast24hrs: { type: Number, required: true },
  expectedArrivals: { type: Number, required: true },
  localTime: { type: String, required: true },
  relatedAnchorage: { type: String, required: true },
  areaGlobal: { type: String, required: true },
  areaLocal: { type: String, required: true },
  photos: [{ type: String }] // Add this line to store image URLs
});

// Define the Port model
const Port = mongoose.model('Port', portSchema);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint to upload photos
app.post('/upload-photo/:portId', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Construct the image URL

  try {
    // Update the port document to include the new image URL
    await Port.findByIdAndUpdate(req.params.portId, { $push: { photos: imageUrl } }, { new: true });

    return res.json({ message: 'Photo uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error saving photo to MongoDB:', error);
    return res.status(500).json({ message: 'Error saving photo to MongoDB' });
  }
});

// Define a route to fetch port data from the database
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await Port.find({}); // Fetch all ports data from MongoDB
    res.status(200).json(ports); // Send it back as JSON
  } catch (error) {
    console.error('Error fetching port data:', error);
    res.status(500).json({ message: 'Error fetching port data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
