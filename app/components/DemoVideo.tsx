"use client";

export default function DemoVideo() {
  return (
    <section
      id="demo"
      className="max-w-4xl w-full bg-white shadow-md rounded-2xl p-6 mb-20 text-center"
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        See Refraim AI in Action
      </h2>
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
          title="Refraim AI Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
