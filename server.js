// const express = require("express");
// const app = express();
// const path = require("path");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const multer = require("multer");  
// const cors = require("cors"); // Allow frontend requests

// // Middleware
// app.use(cors()); // Enable CORS for frontend
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json()); // Parse JSON requests
// app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// // MongoDB Connection
// mongoose.connect("mongodb+srv://Krishnapriya:Harini123@cluster-sympo.ksa7g.mongodb.net/registrationDb")
// // mongodb+srv://Krishnapriya:Harini123@cluster-sympo.ksa7g.mongodb.net/registrationDb
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => console.log("❌ MongoDB Connection Error:", err));

// // Define Storage Engine for File Uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadPath = path.join(__dirname, "public", "uploads/");
//         cb(null, uploadPath); // Save files in 'public/uploads'
//     },
//     filename: function (req, file, cb) {
//         cb(null, req.body.name + Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });  

// // Registration Schema
// const registrationSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     department: { type: String, required: true },
//     year: { type: String, required: true },
//     college: { type: String, required: true, trim: true },
//     phone: { type: String, required: true, match: /^[0-9]{10}$/ },
//     email: { type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
//     techEvents: { type: [String], default: [] },
//     nonTechEvents: { type: [String], default: [] },
//     onlineEvents: { type: [String], default: [] },
//     paymentScreenshot: { type: String, required: true },
//     registeredAt: { type: Date, default: Date.now }
// });

// const Registration = mongoose.model("StudentRegistration", registrationSchema);

// // Serve the HTML Form
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Registration POST Route with File Upload

// app.post("/", upload.single("paymentScreenshot"), async (req, res) => {
//     try {
//         const {
//             name,
//             department,
//             year,
//             college,
//             phone,
//             email,
//             techEvents,
//             nonTechEvents,
//             onlineEvents
//         } = req.body;

//         // Ensure events are arrays
//         const techEventsArray = Array.isArray(techEvents) ? techEvents : techEvents ? [techEvents] : [];
//         const nonTechEventsArray = Array.isArray(nonTechEvents) ? nonTechEvents : nonTechEvents ? [nonTechEvents] : [];
//         const onlineEventsArray = Array.isArray(onlineEvents) ? onlineEvents : onlineEvents ? [onlineEvents] : [];

    
//         const paymentScreenshotPath = req.file ? `uploads/${req.body.name}_${Date.now()}${path.extname(req.file.originalname)}` : null;

//         const newRegistration = new Registration({
//             name,
//             department,
//             year,
//             college,
//             phone,
//             email,
//             techEvents: techEventsArray,
//             nonTechEvents: nonTechEventsArray,
//             onlineEvents: onlineEventsArray,
//             paymentScreenshot: paymentScreenshotPath
//         });

//         await newRegistration.save();
//         res.send("✅ Registration successful!");
//     } catch (error) {
//         console.error("❌ Error:", error);
//         res.status(500).send("❌ An error occurred during registration.");
//     }
// });

// // Start Server
// const PORT = 5000;
// // const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

require("dotenv").config({path: "cloud.env"});
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");  
const cors = require("cors"); // Allow frontend requests
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "symposium_uploads", // Folder name in Cloudinary
        format: async (req, file) => "png", // Force PNG format (or use file.mimetype.split("/")[1])
        public_id: (req, file) => req.body.name + "_" + Date.now()
    }
});

const upload = multer({ storage });

// Registration Schema
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    college: { type: String, required: true, trim: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    email: { type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
    techEvents: { type: [String], default: [] },
    nonTechEvents: { type: [String], default: [] },
    onlineEvents: { type: [String], default: [] },
    paymentScreenshot: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("StudentRegistration", registrationSchema);

// Serve the HTML Form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registration POST Route with File Upload

app.post("/", upload.single("paymentScreenshot"), async (req, res) => {
    try {
        const {
            name,
            department,
            year,
            college,
            phone,
            email,
            techEvents,
            nonTechEvents,
            onlineEvents
        } = req.body;

        // Ensure events are arrays
        const techEventsArray = Array.isArray(techEvents) ? techEvents : techEvents ? [techEvents] : [];
        const nonTechEventsArray = Array.isArray(nonTechEvents) ? nonTechEvents : nonTechEvents ? [nonTechEvents] : [];
        const onlineEventsArray = Array.isArray(onlineEvents) ? onlineEvents : onlineEvents ? [onlineEvents] : [];

    
        const paymentScreenshotUrl = req.file.path; // Get Cloudinary URL

        const newRegistration = new Registration({
            name,
            department,
            year,
            college,
            phone,
            email,
            techEvents: techEventsArray,
            nonTechEvents: nonTechEventsArray,
            onlineEvents: onlineEventsArray,
            paymentScreenshot: paymentScreenshotUrl
        });

        await newRegistration.save();
        res.send("✅ Registration successful!");
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send("❌ An error occurred during registration.");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));