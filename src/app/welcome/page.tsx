import Image from "next/image";
import Link from "next/link";
import Topbar from "../../../components/Topbar";

export default function WelcomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden text-white bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/welcome.jpg"
          alt="Background"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col justify-end flex-1 p-6 pb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-tight mb-10 drop-shadow-[0_5px_20px_rgba(0,0,0,0.6)]">
            <span className="block text-transparent bg-clip-text bg-[linear-gradient(to_right,_#7C3AED,_#A855F7,_#EC4899,_#F43F5E)]">
              Rent-a-ride
            </span>
          </h1>

          <Link
            href="/onboarding"
            className="w-[229px] text-center inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
