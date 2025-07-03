require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');  
const fs = require('fs');
const upload = require('./multer'); // Import multer instance
const path = require('path');
const User = require('./models/usermodel');
const { authenticateToken } = require('./utilities');
const TravelStory = require('./models/TravelStory');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Only allow your frontend
  credentials: true               // ✅ Allow cookies/auth headers
}));


// Routes inside a function that will run after successful MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(config.connectionString);
    console.log('✅ Connected to MongoDB');

    // Create Account
    app.post('/create-account', async (req, res) => {
      try {
        console.log('Request body:', req.body);

        let { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        email = email.trim().toLowerCase(); // Normalize email

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
          return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          fullname,
          email,
          password: hashedPassword
        });

        await newUser.save();
        console.log('User saved:', newUser);

        const accessToken = jwt.sign(
          { userId: newUser._id },
          process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
          { expiresIn: '72h' }
        );

        res.status(201).json({
          success: true,
          user: { id: newUser._id, email: newUser.email },
          accessToken
        });

      } catch (error) {
        console.error('500 Error Details:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          systemMessage: error.message
        });
      }
    });



 // Login 
 app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  email = email.trim().toLowerCase(); // Normalize email

  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    console.log("❌ No user found with that email");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log("✅ Found user:", currentUser.email);

  const isPasswordValid = await bcrypt.compare(password, currentUser.password);
  console.log("Password match:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("❌ Invalid password");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: currentUser._id }, 
    process.env.ACCESS_TOKEN_SECRET || 'your_secret_key',
    { expiresIn: '72h' }
  );

  console.log("✅ Login successful");

  return res.status(200).json({ 
    error: false,
    user: { fullname: currentUser.fullname, email: currentUser.email },
    accessToken,
    message: "Login successful"
  });
});


// Get users
app.get('/get-user', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const isuser = await User.findOne({ _id: userId });

    if (!isuser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const userResponse = {
      _id: isuser._id,
      email: isuser.email,
      fullName: isuser.fullName || `${isuser.firstName || ''} ${isuser.lastName || ''}`.trim(),
    };

    return res.json({
      user: userResponse,
      message: "User found"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});




// Add travel story
app.post('/add-travel-story', authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, isFavorite, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validation
  if (
    !title ||
    !story ||
    !Array.isArray(visitedLocation) ||
    visitedLocation.length === 0 ||
    typeof isFavorite !== 'boolean' ||
    !visitedDate
  ) {
    return res.status(400).json({ message: "Required fields are missing or invalid" });
  }

  // Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const newStory = new TravelStory({
      title,
      story,
      visitedLocation,
      isFavorite,
      userId,
      imageUrl: imageUrl || 'http://localhost:8000/assets/placeholder.jpg',
      visitedDate: parsedVisitedDate
    });

    await newStory.save();
    return res.status(201).json({ error: false, message: "Travel story added successfully" });
  } catch (err) {
    console.error("Error adding travel story:", err); // 👈 Helpful logging
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});


// Get all travel Stories
app.get('/get-all-stories', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelstories = await TravelStory.find({ userId }).sort({ isFavorite: -1 });
    res.status(200).json({ error: false, travelstories });
  }
  catch (err) {
    console.error("Error fetching travel stories:", err); // 👈 Helpful logging
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});



// Image upload
app.post('/image-upload', upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
      .status(400)
      .json({ error: true, message: "Image is required" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    
    return res.status(200).json({ error: false, imageUrl });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



// Delete image
app.delete('/uploads/:filename', (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({
      error: true,
      message: 'Filename is required'
    });
  }

  const filePath = path.join(__dirname, 'uploads', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        error: false,
        message: 'Image deleted successfully'
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'Image not found'
      });
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    return res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});



// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));



// Get all travel stories
app.get('/get-all-stories', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const stories = await TravelStory.find({ userId });
    return res.status(200).json({ error: false, stories });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



// Edit travel story
app.put('/edit-travel-story/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, isFavorite, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || isFavorite === undefined || !visitedDate) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const parsedVisitedDate = new Date(visitedDate);

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.isFavorite = isFavorite;
    travelStory.imageUrl = imageUrl || 'http://localhost:8000/assets/placeholder.jpg';
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});




// Delete travel story
app.delete('/delete-story/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }


    // Delete the travel story from the data base
    await TravelStory.deleteOne({ _id: id, userId });

    // Extract the filename from the image URL  
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    // Define the path to the image file
    const filePath = path.join(__dirname, 'uploads', filename);

    // Delete the filepath
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    } );
    return res.status(200).json({ error: false, message: "Travel story deleted successfully" });


  } catch (err) {
    console.error("Error deleting travel story:", err);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});


// Update favorite status
app.put('/update-is-favorite/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavorite = isFavorite;
    await travelStory.save();

    return res.status(200).json({ error: false, message: "Favorite status updated successfully" });
  } catch (err) {
    console.error("Error updating favorite status:", err);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



// Search travel stories
app.get('/search', authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if(!query) {
    return res
    .status(400)
    .json({ error: true, message: "Query is required" });
  } 

  try {
    const searchresults = await TravelStory.find({
      userId : userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { story: { $regex: query, $options: 'i' } },
        { visitedLocation: { $regex: query, $options: 'i' } }
      ],
    }).sort({ isFavorite: -1 });

    res.status(200).json({ error: false, searchresults });
  }
  catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }

});



// Filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavorite: -1 });

    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});









// Start the server
// app.listen(8000, () => {
//   console.log("🚀 Server is running on port 8000");
// });

// } catch (err) {
// console.error('❌ Failed to connect to MongoDB:', err);
// }
// };

// startServer();






    app.listen(8000, () => {
        console.log("🚀 Server is running on port 8000");
      });
  
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB:', err);
    }
  };
  
  startServer();
  
//   module.exports = app;






// // Get user details
// app.get('/user', authenticateToken, async (req, res) => {
//   const { userId } = req.user;

//   try {
//     const user = await User.findOne({ _id: userId });
//     if (!user) {
//       return res.status(404).json({ error: true, message: "User not found" });
//     }
    
//     return res.status(200).json({ 
//       error: false,
//       user: { fullname: user.fullname, email: user.email }
//     });
//   } catch (err) {
//     return res.status(500).json({ error: true, message: "Internal server error" });
//   }
// });

// app.listen(8000, () => console.log("Server is running on port 8000"));

module.exports = app;