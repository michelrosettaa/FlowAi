import DemoVideo from "./DemoVideo";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between pt-28 px-8 md:px-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-5xl font-bold text-blue-700 leading-tight">
          Plan your day in seconds with <span className="text-blue-600">Refraim AI</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Your AI productivity assistant that turns messy to-do lists into a clear, time-blocked daily plan.
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Start Free Trial
          </button>
          <button className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Watch Demo
          </button>
        </div>
      </div>

      <div className="md:w-1/2 mt-10 md:mt-0">
        <DemoVideo />
      </div>
    </section>
  );
}
