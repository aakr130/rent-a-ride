import Link from "next/link";
import { Home, Search, MessageSquare, Bell, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab?: string;
}

export default function BottomNavigation({
  activeTab = "home",
}: BottomNavigationProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home", href: "/home" },
    { id: "search", icon: Search, label: "Search", href: "/search" },
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      href: "/messages",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
    },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-between p-3">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`flex flex-col items-center ${
            activeTab === tab.id ? "text-black" : "text-gray-400"
          }`}
        >
          <tab.icon size={24} />
        </Link>
      ))}
    </div>
  );
}
