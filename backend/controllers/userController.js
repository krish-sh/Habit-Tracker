import userModel from "../models/Usermodels";
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
    if (!existedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already existed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(token, {
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

export { register };
