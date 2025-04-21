import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({ name, email, password });
  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  res
    .status(201)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        201,
        {
          user: user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "User registration completed successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "Provided email is not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );
  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "User Logged In successfully"
      )
    );
});

const LogOutUser = asyncHandler(async (req, res) => {
  const LoggedOutUser = await User.findOneAndUpdate(req.user._id, {
    $set: {
      refreshToken: "1",
    },
  });

  return res.status(200).clearCookie("AccessToken").clearCookie("RefreshToken");
});

const regenerateRefreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.RefreshToken || req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const DecodedToken = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(DecodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(400, "Invalid Token");

  const { RefreshToken, AccessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken)
    .cookie("AccessToken", AccessToken)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Refresh token regenerated successfully"
      )
    );
});

export { registerUser, loginUser, LogOutUser, regenerateRefreshToken };
