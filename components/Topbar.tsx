"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Menu, UserRoundCog, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./topbar.css";
import { User, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/app/hooks/useUser";
import Spinner from "@/app/icons/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Topbar() {
  const { data, isLoading } = useUser();
  const user = data?.user;
  const isLoggedIn = data?.authenticated;
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isProtectedRoute =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b shadow bg-white/80 backdrop-blur-md border-white/30">
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-3 mx-auto md:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 whitespace-nowrap"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white/90">
            <Image
              src="/images/logo.png"
              alt="Rent-a-ride Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-wide text-gray-800">
            Rent-a-ride
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-800 md:hidden"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div
          className={`${
            mobileOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full px-4 pb-4 bg-white shadow-md md:shadow-none md:static md:bg-transparent md:flex md:items-center md:justify-end md:space-x-6 md:pb-0 md:px-0`}
        >
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard/"
                className="relative inline-block py-2 text-black transition duration-300 hover:text-red-400 group animated-underline md:py-0"
              >
                Home
              </Link>
            </>
          )}

          {["aboutus", "contactus"].map((path, i) => (
            <Link
              key={i}
              href={`/${path}`}
              className="relative inline-block py-2 text-black transition duration-300 hover:text-red-400 group animated-underline md:py-0"
            >
              {path.charAt(0).toUpperCase() +
                path.slice(1).replace("us", " Us")}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              href="/wishlist"
              className="relative inline-flex items-center py-2 text-black transition duration-300 hover:text-red-400 group md:py-0"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 mr-1 text-red-500" />
            </Link>
          )}

          {/* Conditional: show when NOT logged in */}
          {isLoading ? (
            <div className="flex items-center justify-center w-10 h-10">
              <Spinner className="w-6 h-6 text-gray-600 transition-opacity animate-fade-in" />
            </div>
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="relative inline-block py-2 text-black transition duration-300 hover:text-red-400 group animated-underline md:py-0"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 mt-2 font-semibold text-center text-white transition rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:to-yellow-700 md:mt-0 md:inline-block"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow ring-2 ring-gray-300">
                      <Spinner className="w-6 h-6 text-gray-600" />
                    </div>
                  ) : user?.role === "user" ? (
                    <Image
                      src={
                        user?.profile_image_url || "/images/default-avatar.png"
                      }
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="object-cover w-10 h-10 rounded-full ring-2 ring-gray-300 hover:ring-yellow-400"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-yellow-500 rounded-full">
                      A
                    </div>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="w-48 mt-2 bg-white border shadow-xl rounded-xl animate-in fade-in slide-in-from-top-1"
                >
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/my-profile")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-yellow-100"
                  >
                    <User size={16} />
                    {user?.name}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/edit-profile")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-yellow-100"
                  >
                    <UserRoundCog size={16} />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 cursor-pointer hover:bg-red-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      {showLogoutDialog && (
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Confirm Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </nav>
  );
}
