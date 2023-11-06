const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom_error");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createJwtToken, createJwtRefreshToken } = require("../utils/index");

const refreshTokens = [];


const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Please provide all fields"
      );
    }
    const user = await User.findOne({ email });
    if (user) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "User already exist!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(StatusCodes.CREATED).json({ message: "Signup successfull!" });
  } catch (error) {
    next(error);
  }
};



const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Please provide both fields"
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid Credential!");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid Credential!");
    }

    const accessToken = createJwtToken(user);
    const refreshToken = createJwtRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.status(StatusCodes.OK).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};



const refreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Refresh token is required"
      );
    }
    if (!refreshTokens.includes(refreshToken)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid refresh token");
    }
    const token = jwt.sign({}, process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
};
