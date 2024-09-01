import "dotenv/config";
import "express-async-errors";
import "src/db";
import express, { RequestHandler } from "express";
import authRouter from "routes/auth";
import formidable from "formidable";
import path from "path";
import productRouter from "./routes/product";
import { sendErrorRes } from "./utils/helper";
import http from "http";
import { Server } from "socket.io";
import { TokenExpiredError, verify } from "jsonwebtoken";
import morgan from "morgan";
import conversationRouter from "./routes/converstaion";
import ConversationModel from "./models/conversation";
import { timeStamp } from "console";
import { updateSeenStatus } from "./controllers/conversation";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket-message",
});

app.use(morgan("dev"));
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/conversation", conversationRouter)

//SOCKET IO
io.use((socket, next) => {
  const socketRequest = socket.handshake.auth as { token: string } | undefined;

  if (!socketRequest?.token) return next(new Error("Unauthorized Request"));

  try {
    socket.data.jwtDecode = verify(socketRequest.token, process.env.JWT_SECRET!);
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return next(new Error("jwt expired"));

    return next(new Error("Invalid token"));
  }
  next();
});


type IncomingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    }
  },
  to: string;
  conversationId: string;
}

type OutgoingMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    viewed: boolean;
    user: {
      id: string;
      name: string;
      avatar?: string;
    }
  },
  from: {
    id: string;
    name: string;
    avatar?: string;
  },
  conversationId: string;
}

type SeenData = {
  messageId: string;
  peerId: string;
  conversationId: string;
}
io.on("connection", (socket) => {
  const socketData = socket.data as {jwtDecode: {id: string} } 
  const userId = socketData.jwtDecode.id

  socket.join(userId)

  socket.on('chat:new', async (data: IncomingMessage) => {
    await ConversationModel.findByIdAndUpdate(data.conversationId, {
      $push: {
        chats: {
          sentBy: data.message.user.id,
          content: data.message.text,
          timeStamp: data.message.time
        }
      }
    })
    const messageResponse : OutgoingMessageResponse = {
      from: data.message.user,
      conversationId: data.conversationId,
      message: {...data.message, viewed: false},
    }
    socket.to(data.to).emit("chat:message", messageResponse)
  })

  socket.on('chat:seen', async (seenData: SeenData) => {
    await updateSeenStatus(seenData.peerId, seenData.conversationId)
    socket.to(seenData.peerId).emit("chat:seen", {conversationId: seenData.conversationId, messageId: seenData.messageId})

  })

});

app.post("/upload-file", async (req, res) => {
  // this is how you can upload files
  const form = formidable({
    uploadDir: path.join(__dirname, "public"),
    filename(name, ext, part, form) {
      return Date.now() + "_" + part.originalFilename;
    },
  });
  await form.parse(req);
  res.send("ok");
});

app.use(function (error, req, res, next) {
  res.status(500).json({ message: error.message });
} as express.ErrorRequestHandler);

app.use("*", (req, res) => {
  sendErrorRes(res, "Not Found!", 404);
});

server.listen(8000, () => {
  console.log("The app is running on 8000");
});

// app.get('/',(req,res)=>{
//     res.json({message:"This message is coming from server"})
// })
// app.post("/",(req,res)=>{
//   console.log("a")

//   console.log(req.body)
//   res.json({message:'This message is coming from post request'})
// })

// app.post("/create-new-product",(req,res)=>{

//     console.log(req.body)
//     res.json({message:'This message is coming from product create'})
//   })
