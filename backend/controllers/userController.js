import userModel from "../models/Usermodels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }

    const existedUser = await userModel.findOne({ email });

    if (existedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already existed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 34 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(200).json({
      success: true,
      message: "User Register successfuuly",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.log("Error in user controller");
    return res
      .status(500)
      .json({ success: false, message: "Internal user controller errror" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(404).json({
        success: false,
        message: "Password is not valid",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: user._id,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "User Logined Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log("Error in Login the user", error);
    res.status(500).json({
      success: false,
      message: "Error in Login the user",
    });
  }
};

export { register, login };
