import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Tv, Star, Timer, Calendar, TrendingUp, Globe, Zap } from "lucide-react";
import FootballWidget from "../components/FootballWidget";

const LiveTicker = () => (
  <div className="bg-gradient-to-r from-gorkhali-red via-peace-blue to-gorkhali-red py-3 overflow-hidden">
    <motion.div className="flex whitespace-nowrap" animate={{ x: [0, -2000] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
      {[...Array(4)].map((_, i) => (
        <span key={i} className="mx-8 text-white font-bebas tracking-wider text-sm">
          ⚽ LIVE SPORTS • PREMIER LEAGUE • LA LIGA • BUNDESLIGA • SERIE A • LIGUE 1 • CHAMPIONS LEAGUE • <span className="text-marigold">★</span>
        </span>
      ))}
    </motion.div>
  </div>
);

const QuickStats = () => {
  const stats = [
    { icon: Trophy, label: "Leagues", value: "6", color: "#FFB703" },
    { icon: Tv, label: "Live Updates", value: "24/7", color: "#48CAE4" },
    { icon: Star, label: "Top Matches", value: "50+", color: "#EF233C" },
    { icon: Globe, label: "Countries", value: "5", color: "#2A9D8F" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 text-center"
        >
          <stat.icon className="mx-auto mb-2" size={28} style={{ color: stat.color }} />
          <p className="font-bebas text-2xl text-white">{stat.value}</p>
          <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const LeagueHighlights = () => {
  const highlights = [
    { league: "Premier League", news: "Liverpool leads the table with 50 points", color: "#3D195B" },
    { league: "La Liga", news: "El Clasico ended in a 2-2 draw", color: "#EE8707" },
    { league: "Champions League", news: "Round of 16 fixtures announced", color: "#0E1E5B" },
    { league: "Bundesliga", news: "Bayern Munich secures top spot", color: "#D20515" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 mb-8">
      <h3 className="font-bebas text-xl text-white tracking-wider mb-4 flex items-center gap-2">
        <Zap className="text-marigold" size={20} /> LATEST HIGHLIGHTS
      </h3>
      <div className="space-y-3">
        {highlights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <div>
              <p className="text-xs font-bebas tracking-wider" style={{ color: item.color }}>{item.league}</p>
              <p className="text-sm text-gray-300 font-inter">{item.news}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-black py-12">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="text-gray-500 text-sm">© 2026 Nepali Ballot • Sports Section 🇳🇵</p>
    </div>
  </footer>
);

const SportsPage = () => {
  return (
    <div className="min-h-screen bg-night-count">
      <LiveTicker />

      {/* Hero Section */}
      <div className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gorkhali-red/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-rsp-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <Trophy className="mx-auto mb-6 text-marigold" size={72} />
            </motion.div>
            <h1 className="font-bebas text-6xl sm:text-7xl text-white tracking-wider mb-4" style={{ textShadow: "0 0 60px rgba(247,127,0,0.5)" }}>
              SPORTS CENTER
            </h1>
            <p className="font-playfair text-xl text-gray-300 italic mb-2">"Live scores from top football leagues"</p>
            <p className="text-sm text-gray-500">Premier League • La Liga • Bundesliga • Serie A • Ligue 1 • Champions League</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Quick Stats */}
        <QuickStats />

        {/* Main Football Widget */}
        <FootballWidget />

        {/* League Highlights */}
        <div className="mt-8">
          <LeagueHighlights />
        </div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="mt-8 bg-gradient-to-r from-gorkhali-red/10 to-rsp-blue/10 border border-white/10 rounded-lg p-6"
        >
          <h3 className="font-bebas text-xl text-white tracking-wider mb-3 flex items-center gap-2">
            <Timer className="text-rsp-blue" size={20} /> AUTO-UPDATE
          </h3>
          <p className="text-gray-400 text-sm font-inter">
            Scores are automatically refreshed every 60 seconds. Click the refresh button for instant updates.
            Data includes matches, standings, and fixtures from the top 5 European leagues plus UEFA Champions League.
          </p>
        </motion.div>

        {/* Ad Space */}
        <div className="mt-8 bg-white/5 border border-dashed border-white/20 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm font-bebas tracking-wider">ADVERTISEMENT SPACE</p>
          <p className="text-gray-600 text-xs mt-1">Sports Sponsors Welcome</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SportsPage;
