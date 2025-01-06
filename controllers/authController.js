const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

exports.login = async (req, res) => {
    const { nic, password } = req.body;
    console.log("NIC:", nic); // Debugging line
    console.log("password:", password); // Debugging line
    
    const user = await User.findOne({ nic: nic.trim() });
    console.log("Password entered:", password.trim());
    if (!user) {
      console.log("User not found"); // Debugging line
      return res.status(400).json({ message: 'User not found' });
    }
  
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Hashed password from DB:", user.password);
    console.log("Password match:", isMatch); // Debugging line

    async function testPassword() {
        const enteredPassword = "securepassword";
        const storedHash = "$2a$10$UzT5.77bnqnHK0nGBXmMH.uB2qG6Sx2BMa9cO6olkfAuMY9XwNp2u";
        
        const isMatch = await bcrypt.compare(enteredPassword, storedHash);
        console.log("Password match result:", isMatch); // This should print 'true' if it works
      }
      
      testPassword();
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.json({ token });
  };
  

// Register controller (new code)
exports.register = async (req, res) => {
    const { nic, password, name } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ nic });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create and save the new user
      const user = new User({
        nic,
        password: hashedPassword,
        name,
      });
      await user.save();
  
      // Generate a token for the new user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
  
      res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
