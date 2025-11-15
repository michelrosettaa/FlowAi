"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Finish the pitch deck for tomorrow",
  "Reply to Sarah about the contract",
  "Block 2 hours of deep work",
  "Prep talking points for the 2pm call",
];

export default function TypingAssistant() {
  const [index, setIndex] = useState(0); // which phrase
  const [subIndex, setSubIndex] = useState(0); // how many chars shown
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // typing / deleting effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const current = phrases[index];

    // Speed settings
    const typingSpeed = deleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) {
        // keep typing
        setSubIndex(subIndex + 1);
      } else if (!deleting && subIndex === current.length) {
        // pause, then start deleting
        setTimeout(() => setDeleting(true), 1000);
      } else if (deleting && subIndex > 0) {
        // deleting text
        setSubIndex(subIndex - 1);
      } else if (deleting && subIndex === 0) {
        // move to next phrase
        setDeleting(false);
        setIndex((index + 1) % phrases.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  return (
    <div className="mt-6 text-sm text-gray-600 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow px-4 py-3 inline-flex flex-col text-left max-w-full">
      <div className="text-[11px] text-gray-500 font-medium mb-1">
        You:{" "}
        <span className="text-gray-900 font-semibold">
          {phrases[index].substring(0, subIndex)}
          <span
            className="inline-block w-[1px] bg-gray-900 align-middle"
            style={{ opacity: blink ? 1 : 0 }}
          />
        </span>
      </div>

      <div className="text-[11px] text-blue-600 font-medium">
        Refraim AI: I’ll plan that into your day.
      </div>
    </div>
  );
}
