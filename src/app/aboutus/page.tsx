"use client";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-gray-900 bg-gradient-to-b from-white via-slate-300 to-white sm:px-12 lg:px-24">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-transparent underline sm:text-5xl bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 drop-shadow-md">
          About Rent-a-ride
        </h1>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700 sm:text-xl">
          At <span className="font-semibold text-purple-700">Rent-a-ride</span>,
          we don’t just offer vehicles — we deliver freedom. Whether it’s a
          sleek scooter for your city sprints, a dependable car for weekend
          escapes, or a sporty bike to embrace the open road — your next ride is
          just a click away.
        </p>

        <blockquote className="relative max-w-2xl pl-4 mx-auto mt-6 text-2xl italic font-medium tracking-wide text-gray-800 drop-shadow-sm before:absolute before:left-0 before:top-2 before:w-1 before:h-full before:bg-gradient-to-b from-purple-500 to-pink-500">
          “Life isn’t just about the destination. Make every mile
          unforgettable.”
        </blockquote>
      </section>

      <section className="mb-20 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800 drop-shadow-sm">
          Experience the Ride
        </h2>
        <div className="w-full max-w-4xl mx-auto overflow-hidden border border-gray-200 shadow-2xl aspect-video rounded-xl">
          <video
            className="object-cover w-full h-full"
            controls
            autoPlay
            muted
            loop
            preload="auto"
          >
            <source src="/videos/intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 mb-20 md:grid-cols-3">
        {[
          {
            src: "/images/bike.jpg",
            title: "Ride the Freedom",
            desc: "Speed, freedom, and urban agility — bikes built to take you anywhere.",
            color: "purple",
          },
          {
            src: "/images/car.jpg",
            title: "Comfort Meets Style",
            desc: "Elegant cars for long drives and quick getaways — with unmatched reliability.",
            color: "indigo",
          },
          {
            src: "/images/scooty.jpg",
            title: "Smart Urban Mobility",
            desc: "Eco-friendly scooters for zipping through city streets — fast, fun, and efficient.",
            color: "pink",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="overflow-hidden transition-all duration-300 shadow-xl rounded-xl hover:shadow-2xl"
          >
            <Image
              src={item.src}
              alt={item.title}
              width={600}
              height={400}
              className="object-cover w-full h-64"
            />
            <div className="p-5 bg-white">
              <h3
                className={`text-xl font-bold mb-2 text-${item.color}-700 drop-shadow-sm`}
              >
                {item.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="py-16 text-center">
        <h2 className="mb-10 text-3xl font-bold text-gray-800 drop-shadow-sm">
          Why Riders Love Us
        </h2>

        <div className="grid max-w-6xl grid-cols-1 gap-6 px-6 mx-auto sm:grid-cols-3">
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <div className="mb-4 text-5xl">⏰</div>
            <h4 className="mb-2 text-lg font-bold">24/7 Access</h4>
            <p className="text-sm text-gray-600">
              We’re always open, day or night.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <div className="mb-4 text-5xl">🛡️</div>
            <h4 className="mb-2 text-lg font-bold">Secure & Reliable</h4>
            <p className="text-sm text-gray-600">
              Verified vehicles. Trusted by thousands.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <div className="mb-4 text-5xl">⚡</div>
            <h4 className="mb-2 text-lg font-bold">Fast Booking</h4>
            <p className="text-sm text-gray-600">
              Book in seconds. Your vehicle is ready when you are.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 text-center">
        <p className="text-xl font-medium text-gray-800">
          Join{" "}
          <span className="font-semibold text-indigo-600">
            thousands of riders
          </span>{" "}
          across the city who trust Rent-a-ride every day.
        </p>
        <p className="mt-3 text-gray-500 text-md">
          From two wheels to four — we don’t just rent rides. We fuel freedom.
        </p>

        <button className="px-6 py-3 mt-6 font-semibold text-white transition-all duration-300 rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 active:scale-95">
          Explore Our Vehicles
        </button>
      </section>
    </main>
  );
}
