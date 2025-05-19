import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// Sidebar'da kullanıcıları getir
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in User side bar!", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Kullanıcılar arası mesajları getir
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages!", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mesaj gönder
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isRead: false, // Yeni mesaj gönderildiğinde default olarak okunmadı
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const setupSocketEvents = (io, userSocketMap) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Kullanıcı bağlandı", socket.id);

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log("Kullanıcı ayrıldı", socket.id);
    });

    // ✅ Mesajları okundu olarak işaretleme olayını dinle
    socket.on("markMessagesAsRead", async ({ senderId }) => {
      // 1. Sunucu tarafında veritabanındaki mesajları kalıcı olarak isRead = true yap
      try {
        await Message.updateMany(
          { senderId, receiverId: userId, isRead: false },
          { $set: { isRead: true } }
        );
      } catch (error) {
        console.error("❌ Mesajlar güncellenirken hata:", error.message);
      }

      // 2. Karşı tarafa bildir
      io.to(userSocketMap[senderId]).emit("messagesMarkedAsRead", {
        byUserId: userId, 
      });
    });
  });
};

