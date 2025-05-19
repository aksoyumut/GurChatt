import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const sahteKisiler = Array.from({ length: 8 });

  return (
    <aside className="h-full w-[470px] border-r border-base-300 flex flex-col bg-base-100 pt-16 ml-2 transition-all duration-200">

      {/* Başlık kısmı */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Kişiler</span>
        </div>
      </div>

      {/* Kişi Skeleton'ları */}
      <div className="overflow-y-auto w-full py-3 px-2">
        {sahteKisiler.map((_, i) => (
          <div
            key={i}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-200 rounded-md transition"
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* Bilgiler */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
