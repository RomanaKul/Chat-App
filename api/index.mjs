import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./mongoose/schemas/user.mjs";
import { Message } from "./mongoose/schemas/message.mjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import { comparePassword, hashPassword } from "./utils/helpers.mjs";
import WebSocket, { WebSocketServer } from "ws";

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

async function getUserToken(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/test", (req, res) => {
  res.send("test ok");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserToken(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
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

const server = app.listen(3000);

const wss = new WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const cookieTokenString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (cookieTokenString) {
      const token = cookieTokenString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;

    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
