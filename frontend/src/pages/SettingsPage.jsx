// Tema sabitlerini ve tema durumunu yöneten store'u içe aktarıyoruz
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react"; // Gönder ikonunu temsil eder

// Ön izleme için sahte mesajlar
const SAHTE_MESAJLAR = [
  { id: 1, content: "Selam! Nasılsın?", isSent: false },
  { id: 2, content: "Harikayım! Yeni özellikler üzerinde çalışıyorum.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore(); // Tema durumu ve değiştirme fonksiyonu

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Sayfa başlığı */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Tema</h2>
          <p className="text-sm text-base-content/70">
            Sohbet arayüzü için bir tema seçin
          </p>
        </div>

        {/* Tema seçenekleri */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                theme === t ? "bg-base-200" : "hover:bg-base-200/50"
              }`}
            >
              {/* Tema önizleme kutusu */}
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>

                </div>
              </div>
              {/* Tema adı */}
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Önizleme başlığı */}
        <h3 className="text-lg font-semibold mb-3">Önizleme</h3>

        {/* Sohbet kutusu önizlemesi */}
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Başlık */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      AV
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Ali Veli</h3>
                      <p className="text-xs text-base-content/70">Çevrimiçi</p>
                    </div>
                  </div>
                </div>

                {/* Mesajlar */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {SAHTE_MESAJLAR.map((mesaj) => (
                    <div
                      key={mesaj.id}
                      className={`flex ${mesaj.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                          mesaj.isSent
                            ? "bg-primary text-primary-content"
                            : "bg-base-200"
                        }`}
                      >
                        <p className="text-sm">{mesaj.content}</p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            mesaj.isSent
                              ? "text-primary-content/70"
                              : "text-base-content/70"
                          }`}
                        >
                          12:00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mesaj giriş kutusu (salt okunur) */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Mesaj yaz..."
                      value="Bu bir önizlemedir"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Önizleme sonu */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
