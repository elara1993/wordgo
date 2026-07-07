import { HomeIcon, BookOpenIcon, ChatBubbleLeftRightIcon, ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid";
import { BookOpenIcon as BookSolid } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon as ChatSolid } from "@heroicons/react/24/solid";
import { ClockIcon as ClockSolid } from "@heroicons/react/24/solid";
import { UserCircleIcon as UserSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "首页",
    href: "/",
    icon: HomeIcon,
    solidIcon: HomeSolid,
  },
  {
    label: "词库",
    href: "/dictionary",
    icon: BookOpenIcon,
    solidIcon: BookSolid,
  },
  {
    label: "我会说",
    href: "/speak",
    icon: ChatBubbleLeftRightIcon,
    solidIcon: ChatSolid,
  },
  {
    label: "复习",
    href: "/review",
    icon: ClockIcon,
    solidIcon: ClockSolid,
  },
  {
    label: "我的",
    href: "/profile",
    icon: UserCircleIcon,
    solidIcon: UserSolid,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.solidIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
