import Image from "next/image";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden text-white bg-gradient-to-b from-white via-slate-300 to-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/onboarding.jpg"
          alt="Background"
          fill
          className="object-contain rounded-full"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col justify-end flex-1 p-6 pb-20 bg-black/40">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Let&apos;s Start
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              A New Experience
            </span>
            <br />
            With Bike Rental.
          </h1>

          <p className="max-w-md mb-8 font-medium text-white">
            Discover your next adventure with Qent. We&apos;re here to provide
            you with a seamless car rental experience. Let’s get started on your
            journey.
          </p>

          <Link
            href="/login"
            className="w-[229px] text-center inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
