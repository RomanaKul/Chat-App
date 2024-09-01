import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import { comparePassword, hashPassword } from "./utils/helpers.mjs";

dotenv.config();
mongoose
  .connect(
    "mongodb+srv://romana:E79SUawduweOJcYh@cluster0.ji0mg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`Error: ${err}`));

const jwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.send("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = hashPassword(password);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({ id: createdUser._id });
      }
    );
  } catch (error) {
    if (error) throw error;
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (!foundUser) return res.status(401).send("User not found");
  if (!comparePassword(password, foundUser.password))
    return res.status(400).send("Bad credentials");

  jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie("token", token).status(201).json({ id: foundUser._id });
  });
});

app.listen(3000);
