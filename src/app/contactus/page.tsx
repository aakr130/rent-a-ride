"use client";

import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-20 text-gray-800 bg-gradient-to-b from-white via-slate-300 to-white sm:px-12 lg:px-24">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 drop-shadow-lg">
          Let’s Talk
        </h1>
        <p className="max-w-2xl mx-auto text-lg font-medium text-gray-600">
          Have a question? Need assistance? Or just want to say hi? We’re here
          to help make your ride smoother and smarter.
        </p>
      </section>

      <section className="grid items-start grid-cols-1 gap-12 md:grid-cols-2">
        <form className="relative p-10 space-y-6 transition bg-white border border-gray-100 shadow-xl rounded-2xl hover:shadow-2xl">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 hover:shadow-lg"
          >
            Send Message
          </button>
        </form>

        <div className="space-y-10">
          <div>
            <h3 className="mb-2 text-2xl font-semibold text-indigo-600">
              Our Head Office
            </h3>
            <p className="leading-relaxed text-gray-700">
              Tilotamma-01, Nepal
              <br />
              ✉️{" "}
              <a
                href="mailto:support@rentaride.com"
                className="text-blue-500 hover:underline"
              >
                support@rentaride.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-semibold text-indigo-600">
              Business Hours
            </h3>
            <p className="text-gray-700">
              Sunday to Friday
              <br />
              8:00 AM – 8:00 PM
            </p>
          </div>

          <div className="mt-6 overflow-hidden border border-gray-100 shadow-md rounded-xl">
            <iframe
              title="Rent-a-ride Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1767.2678001593986!2d83.46978863863119!3d27.638896144055487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399684510ca2a5c1%3A0x305e3cce0ed037cc!2sNayamil%2C%20Tilottama%2032903!5e0!3m2!1sen!2snp!4v1746731215725!5m2!1sen!2snp"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px]"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
