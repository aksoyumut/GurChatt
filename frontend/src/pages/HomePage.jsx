import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex h-full">
        {/* Sol Menü */}
        <div className="w-1/4 bg-base-100 border-r border-base-300 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Sağ içerik alanı */}
        <div className="flex-1 flex flex-col bg-base-100 overflow-hidden">
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <div className="flex items-center justify-center h-full">
              <NoChatSelected />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

