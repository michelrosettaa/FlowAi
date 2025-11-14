"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Target, TrendingUp, Flame } from "lucide-react";

export default function InteractiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [focusHours, setFocusHours] = useState(0);

  // Load real data from API
  useEffect(() => {
    // Simulating API call - replace with real endpoint when available
    const loadData = async () => {
      try {
        // TODO: Replace with real API calls:
        // const tasks = await fetch('/api/tasks/stats').then(r => r.json());
        // For now, show demo data after short delay
        setTimeout(() => {
          setTasksCompleted(12);
          setStreak(7);
          setFocusHours(5.5);
          setLoading(false);
        }, 400);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tasks Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:scale-[1.02] hover:border-blue-500/40 transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-200">
            <CheckCircle2 className="w-6 h-6 text-blue-400" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, duration: 0.2, type: "spring", stiffness: 300 }}
            className="text-xs font-semibold px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full"
          >
            +3 today
          </motion.div>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {tasksCompleted}
        </motion.h3>
        <p className="text-slate-400 text-sm">Tasks completed this week</p>
        <div className="mt-4 w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          />
        </div>
      </motion.div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:scale-[1.02] hover:border-orange-500/40 transition-all duration-200 cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-200">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl">🔥</div>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-3xl font-bold text-white mb-1 relative z-10"
        >
          {streak} days
        </motion.h3>
        <p className="text-slate-400 text-sm relative z-10">Current streak</p>
      </motion.div>

      {/* Focus Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:scale-[1.02] hover:border-purple-500/40 transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-200">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {focusHours.toFixed(1)}h
        </motion.h3>
        <p className="text-slate-400 text-sm">Deep focus time today</p>
        <div className="mt-4 flex items-center gap-1 text-xs">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-green-400 font-semibold">+22%</span>
          <span className="text-slate-500">vs last week</span>
        </div>
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:scale-[1.02] hover:border-green-500/40 transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-200">
            <Target className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="text-3xl font-bold text-white mb-1"
        >
          8/10
        </motion.h3>
        <p className="text-slate-400 text-sm">Weekly goals achieved</p>
        <div className="mt-4 w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
          />
        </div>
      </motion.div>
    </div>
  );
}
