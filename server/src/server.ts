import express from "express";
import cors from "cors";
import { router } from "./router";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    socket.on("join poll", async (pollId) => {
        const roomName = `poll-${pollId}`
        await socket.join(roomName);
    });
});

const SERVER_PORT = process.env.SERVER_POST || 4040;

httpServer.listen(SERVER_PORT, () => console.log("running..."));