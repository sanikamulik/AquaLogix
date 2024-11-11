import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name from the current file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/aqualogix"; // Use your MongoDB connection string
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, you should hash passwords
  role: { type: String, enum: ["customer", "company"], default: "customer" }, // Default to 'customer'
});

const User = mongoose.model("User", userSchema);

// Define the /signup route for customers and companies
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Account with this email already exists" });
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
    return res
      .status(200)
      .json({ message: "User registered successfully!", role: newUser.role });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
});

// Define the updated ShippingRequest schema
const shippingRequestSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderAddress: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  item: { type: String, required: true },
  category: { type: String, required: true },
  approxWeight: { type: Number, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  shippingDate: { type: Date, required: true },
  status: { type: String, required: true }, // New status field
  orderDetails: {
    // Nested field
    imageUrl: { type: String },
    estimatedCost: { type: Number },
    estimatedTime: { type: String },
  },
});

const ShippingRequest = mongoose.model(
  "ShippingRequest",
  shippingRequestSchema
);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Define the /shipping-request route for saving shipping details
app.post("/shipping-request", upload.single("image"), async (req, res) => {
  const {
    senderName,
    senderEmail,
    senderPhone,
    senderAddress,
    receiverName,
    receiverEmail,
    receiverPhone,
    receiverAddress,
    item,
    category,
    approxWeight,
    source,
    destination,
    shippingDate,
  
  } = req.body;

  const estimatedCost = parseFloat((Math.random() * 500).toFixed(2));
  const estimatedTime = `${Math.floor(Math.random() * 10) + 1} days`;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const statuses = ["Pending", "In Transit", "Delivered", "Cancelled"];
  const status = statuses[Math.floor(Math.random() * statuses.length)]; // Randomly select a status

  try {
    const newShippingRequest = new ShippingRequest({
      orderId: uuidv4(),
      senderName,
      senderEmail,
      senderPhone,
      senderAddress,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverAddress,
      item,
      category,
      approxWeight,
      source,
      destination,
      shippingDate,
      status, // Set the random status
      orderDetails: {
        // Set nested order details
        imageUrl,
        estimatedCost,
        estimatedTime,
      },
    });

    // Save the shipping request to the database
    await newShippingRequest.save();
    return res
      .status(200)
      .json({ message: "Shipping request saved successfully!", status });
  } catch (error) {
    console.error("Error saving shipping request:", error);
    return res.status(500).json({ message: "Error saving shipping request" });
  }
});

// Define the /shipping-requests route for getting all shipping requests
app.get("/shipping-requests", async (req, res) => {
  try {
    const requests = await ShippingRequest.find({}, "-shippingDetails"); // Exclude shippingDetails if needed
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching shipping requests:", error);
    res.status(500).json({ message: "Error fetching shipping requests" });
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
  photos: [{ type: String }], // Stores image URLs
});

const Port = mongoose.model("Port", portSchema);

// Endpoint to upload photos for ports
app.post("/upload-photo/:portId", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    await Port.findByIdAndUpdate(
      req.params.portId,
      { $push: { photos: imageUrl } },
      { new: true }
    );
    return res.json({ message: "Photo uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error saving photo to MongoDB:", error);
    return res.status(500).json({ message: "Error saving photo to MongoDB" });
  }
});

// Define a route to fetch port data from the database
app.get("/api/ports", async (req, res) => {
  console.log("Received request for ports data");
  try {
    const ports = await Port.find({});
    res.status(200).json(ports);
  } catch (error) {
    console.error("Error fetching port data:", error);
    res.status(500).json({ message: "Error fetching port data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
