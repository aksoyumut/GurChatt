// İkon bileşenini içe aktarıyoruz
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    // Sayfa ortasında hizalanmış ana container
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        
        {/* İkon gösterimi */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              {/* Sohbet balonu ikonu */}
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Hoş geldin başlığı */}
        <h2 className="text-2xl font-bold">Gur Chate Hoş Geldiniz!</h2>

        {/* Kullanıcıya rehberlik eden bilgilendirici açıklama */}
        <p className="text-base-content/60">
          Sohbete başlamak için sol menüden bir kişi seçin.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
