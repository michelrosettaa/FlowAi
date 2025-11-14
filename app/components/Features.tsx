export default function Features() {
  return (
    <section id="features" className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">Why teams love FlowAI</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
        <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">AI Daily Planner</h3>
          <p className="text-gray-600">Automatically turns your tasks into a smart, time-blocked plan so you can focus on what matters most.</p>
        </div>
        <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Email Automation</h3>
          <p className="text-gray-600">Generate, personalise, and schedule follow-up emails with one click — powered by AI.</p>
        </div>
        <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Smart Focus Mode</h3>
          <p className="text-gray-600">Learn your most productive hours and let FlowAI optimize your daily schedule around them.</p>
        </div>
      </div>
    </section>
  );
}
