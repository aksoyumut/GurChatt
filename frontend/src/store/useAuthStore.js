import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem("user")) || null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  if (localUser) {
    set({ authUser: localUser });
    get().connectSocket();
    set({ isCheckingAuth: false });
    return;
  }

  try {
    const res = await axiosInstance.get("/auth/check");
    set({ authUser: res.data });
    localStorage.setItem("user", JSON.stringify(res.data));
    get().connectSocket();
  } catch (err) {
    console.error("Auth kontrol hatası:", err);
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
},


  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Hesap başarıyla oluşturuldu");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
      get().connectSocket();
      toast.success("Başarıyla giriş yapıldı");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
      set({ authUser: null });
      toast.success("Başarıyla çıkış yapıldı");
      get().disconnectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set((state) => {
        const updatedUser = {
          ...state.authUser,
          ...res.data,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { authUser: updatedUser };
      });
      toast.success("Profil başarıyla güncellendi");
    } catch (err) {
      console.error("Profil güncelleme hatası:", err);
      toast.error(err.response?.data?.error || "Profil güncellenemedi");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const yeniSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    yeniSocket.connect();
    set({ socket: yeniSocket });

    // Sunucudan aktif kullanıcılar geldiğinde güncelle
    yeniSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },
}));
