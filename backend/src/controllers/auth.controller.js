import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// ÜYELİK OLUŞTURMA
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "Tüm alanlar gereklidir." });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Şifre en az 8 karakter olmalıdır." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Bu e-posta zaten kullanılıyor." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(200).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            createdAt: newUser.createdAt,
        });

    } catch (error) {
        console.error("Signup hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// GİRİŞ YAPMA
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Geçersiz kullanıcı bilgileri" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Geçersiz kullanıcı bilgileri" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        });

    } catch (error) {
        console.error("Login hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// ÇIKIŞ YAPMA
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: "Çıkış yapıldı" });
    } catch (error) {
        console.error("Logout hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// PROFİL GÜNCELLEME
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ error: "Profil fotoğrafı zorunludur." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            createdAt: updatedUser.createdAt,
        });

    } catch (error) {
        console.error("Profil güncelleme hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// YETKİ KONTROLÜ
export const checkAuth = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        });

    } catch (error) {
        console.error("Auth kontrol hatası:", error.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};
