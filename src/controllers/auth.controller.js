const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });          

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
       user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
    const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Request Body:", req.body);
    console.log("Email Received:", email);

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

  
  const profile = (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile",
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  profile,
};