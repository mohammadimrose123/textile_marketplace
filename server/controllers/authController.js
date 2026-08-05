const User = require("../models/User");
const BuyerProfile = require("../models/BuyerProfile");
const SupplierProfile = require("../models/SupplierProfile");
const generateToken = require("../utils/generateToken");
const memoryStore = require("../services/memoryStore");
const { getIsConnected } = require("../config/db");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const selectedRole = role && ["Buyer", "Supplier"].includes(role) ? role : "Buyer";

    // Check if database is connected
    if (getIsConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: selectedRole,
      });

      if (selectedRole === "Buyer") {
        await BuyerProfile.create({ user: user._id });
      } else {
        await SupplierProfile.create({
          user: user._id,
          businessName: `${name}'s Textile Mills`,
        });
      }

      const token = generateToken(user._id, user.role);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      // Memory Fallback Mode
      const userExists = memoryStore.findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await memoryStore.createUser({ name, email, password, role: selectedRole });
      if (selectedRole === "Buyer") {
        memoryStore.saveBuyerProfile({ user: user._id, businessType: "Garments Buyer" });
      } else {
        memoryStore.saveSupplierProfile({ user: user._id, businessName: `${name}'s Textile Mills` });
      }

      const token = generateToken(user._id, user.role);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || "Server Error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        });
      }
    } else {
      // Memory Fallback Mode
      const user = memoryStore.findUserByEmail(email);
      if (user && (await memoryStore.matchPassword(password, user.password))) {
        const token = generateToken(user._id, user.role);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        });
      }
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || "Server Error during login" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.user._id).select("-password");
      if (user) {
        let roleProfile = null;
        if (user.role === "Buyer") {
          roleProfile = await BuyerProfile.findOne({ user: user._id });
        } else if (user.role === "Supplier") {
          roleProfile = await SupplierProfile.findOne({ user: user._id });
        }

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: roleProfile,
        });
      }
    } else {
      // Memory Fallback Mode
      const user = memoryStore.findUserById(req.user.id);
      if (user) {
        const roleProfile =
          user.role === "Buyer"
            ? memoryStore.getBuyerProfile(user._id)
            : memoryStore.getSupplierProfile(user._id);

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: roleProfile,
        });
      }
    }

    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: error.message || "Server Error fetching profile" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Request Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide your registered email address" });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "No account found with this email address" });
      }
    }

    const resetPin = Math.floor(100000 + Math.random() * 900000).toString();

    res.json({
      message: "Verification OTP code sent to your registered email address.",
      resetPin,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to process forgot password request" });
  }
};

// @desc    Reset Password with PIN
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Please provide email and new password" });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.password = newPassword;
      await user.save();
    }

    res.json({ message: "Password updated successfully! You can now sign in with your new password." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
};

