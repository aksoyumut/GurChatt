import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [goster, setGoster] = useState(false);
  const [veri, setVeri] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const formGecerliMi = () => {
    if (!veri.fullName.trim()) return toast.error("Ad Soyad boş bırakılamaz");
    if (!veri.email.trim()) return toast.error("Email boş bırakılamaz");
    if (!/\S+@\S+\.\S+/.test(veri.email)) return toast.error("Geçersiz email formatı");
    if (!veri.password) return toast.error("Şifre boş bırakılamaz");
    if (veri.password.length < 8) return toast.error("Şifre en az 8 karakter olmalı");
    return true;
  };

  const formGonder = async (e) => {
    e.preventDefault();
    if (formGecerliMi() === true) {
      const sonuc = await signup(veri);
      if (sonuc?.success) setVeri({ fullName: "", email: "", password: "" });
    }
  };

  return (
      <div className="h-screen flex items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md bg-base-200 rounded-xl p-8 shadow-md space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Hesap Oluştur</h1>
              <p className="text-base-content/60">Ücretsiz hesabınızı oluşturun</p>
            </div>
          </div>

          <form onSubmit={formGonder} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Ad Soyad</span>
              </label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-base-content/40" />
              </span>
                <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Ali Veli"
                    value={veri.fullName}
                    onChange={(e) => setVeri({ ...veri, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-base-content/40" />
              </span>
                <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="ornek@mail.com"
                    value={veri.email}
                    onChange={(e) => setVeri({ ...veri, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Şifre</span>
              </label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-base-content/40" />
              </span>
                <input
                    type={goster ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10"
                    placeholder="••••••••"
                    value={veri.password}
                    onChange={(e) => setVeri({ ...veri, password: e.target.value })}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setGoster(!goster)}
                >
                  {goster ? (
                      <EyeOff className="w-5 h-5 text-base-content/40" />
                  ) : (
                      <Eye className="w-5 h-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}
            >
              {isSigningUp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </>
              ) : (
                  "Hesap Oluştur"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Zaten hesabınız var mı?{" "}
              <Link to="/login" className="link link-primary">
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default SignUpPage;
