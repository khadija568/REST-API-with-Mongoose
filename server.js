// Load environment variables from .env file
require('dotenv').config({ path: './config/.env' });


const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');   // Import User model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

/**
 * GET /users
 * Returns all users from the database
 */
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /users
 * Adds a new user to the database
 */
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body); // Create a new user instance from request body
    const savedUser = await newUser.save(); // Save user to database
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /users/:id
 * Updates a user by ID
 */
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,         // User ID from URL
      req.body,              // Data to update
      { new: true, runValidators: true } // Return updated doc & validate
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /users/:id
 * Deletes a user by ID
 */
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
