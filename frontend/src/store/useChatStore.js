import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/users/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  /** ✅ Yeni: Mesajları okundu olarak işaretleme */
  markMessagesAsRead: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !socket) return;

    socket.emit("markMessagesAsRead", {
      senderId: selectedUser._id,
    });
  },

  subscribeToMessages: () => {
    const { selectedUser, markMessagesAsRead } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    // Yeni mesaj geldiğinde:
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      // ✅ Yeni: mesaj alınca okundu işaretle
      markMessagesAsRead();
    });

    // Karşı taraf senin mesajlarını gördü
    socket.on("messagesMarkedAsRead", ({ byUserId }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.receiverId === byUserId ? { ...msg, isRead: true } : msg
        ),
      }));
    });

    // İlk bağlandığında da okundu olarak işaretle
    markMessagesAsRead();
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messagesMarkedAsRead");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
