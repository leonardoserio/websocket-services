const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
var services = [];
app.get("/api", (req, res) => {
  res.json({
    message: "Fretaqui Driver",
  });
});

app.post("/new-service", (req, res) => {
  services.push(req.body);
  console.log({ services });
  socketIO.emit("servicesList", services);
  res.json({ data: "success" });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const socketIO = require("socket.io")(http, {
  cors: {
    origin: true,
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socketIO.emit("servicesList", services);
  socket.on("newService", (data) => {
    console.log("data", data);
    services.push(data);
    console.log({ services });
    socketIO.emit("servicesList", services);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
