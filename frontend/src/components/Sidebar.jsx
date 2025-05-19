import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-[470px] border-r border-base-300 flex flex-col bg-base-100 pt-16 ml-2">
      {/* Başlık ve filtre alanı */}
      <div className="border-b border-base-300 w-full px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="size-5" />
          <span className="font-medium text-base">Kişiler</span>
        </div>

        {/* Checkbox her zaman görünür */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm !opacity-100"
            />
            <span className="text-sm">Sadece çevrim içi</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} çevrim içi)</span>
        </div>
      </div>

      {/* Kullanıcı listesi */}
      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="text-left min-w-0">
              <div className="font-medium truncate text-sm">{user.fullName}</div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(user._id) ? "Çevrim içi" : "Çevrim dışı"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">Gösterilecek kullanıcı yok</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
