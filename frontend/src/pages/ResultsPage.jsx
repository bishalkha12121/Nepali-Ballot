import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { RefreshCw, Trophy, Users, TrendingUp, Clock, Zap, Activity, Crown, Vote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Ad Banner Component
const AdBanner = ({ type = "rectangle", id }) => {
  const sizes = {
    horizontal: { w: "728px", h: "90px", label: "728x90" },
    rectangle: { w: "300px", h: "250px", label: "300x250" },
    leaderboard: { w: "970px", h: "90px", label: "970x90" },
  };
  const size = sizes[type];
  
  return (
    <div 
      className="bg-white/5 border border-white/10 flex items-center justify-center rounded-sm"
      style={{ width: "100%", maxWidth: size.w, height: size.h }}
      data-testid={`ad-${id}`}
    >
      <div className="text-center">
        <p className="text-gray-600 text-xs">ADVERTISEMENT</p>
        <p className="text-gray-500 text-sm font-bebas tracking-wider">{size.label}</p>
      </div>
    </div>
  );
};

// Animated Number
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  
  useEffect(() => {
    const startValue = previousValue.current;
    const diff = value - startValue;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + diff * easeProgress));
      if (progress < 1) requestAnimationFrame(animate);
      else previousValue.current = value;
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue.toLocaleString()}</span>;
};

// Live Ticker
const LiveTicker = ({ totalVotes }) => (
  <div className="bg-gradient-to-r from-gorkhali-red via-peace-blue to-gorkhali-red py-3 overflow-hidden">
    <motion.div 
      className="flex whitespace-nowrap"
      animate={{ x: [0, -1500] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {[...Array(4)].map((_, i) => (
        <span key={i} className="mx-8 text-white font-bebas tracking-wider text-sm flex items-center gap-2">
          🔴 LIVE RESULTS • Total Votes: {totalVotes.toLocaleString()} • 
          Election Simulation Active • Auto-refreshing every 10 seconds •
          <span className="text-marigold">★</span>
        </span>
      ))}
    </motion.div>
  </div>
);

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => fetchResults(false, true), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async (showToast = false, isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) setRefreshing(true);
      const response = await axios.get(`${API}/results`);
      setResults(response.data);
      setLastUpdated(new Date());
      if (showToast) toast.success("Results refreshed!");
    } catch (error) {
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-count">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-gorkhali-red border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-bebas text-2xl text-white tracking-wider">LOADING RESULTS</p>
          <p className="font-inter text-gray-500 text-sm">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  const winner = results?.results?.[0];
  const chartData = results?.results?.map((r) => ({
    name: r.candidate_name.split(" ")[0],
    fullName: r.candidate_name,
    votes: r.vote_count,
    percentage: r.percentage,
    fill: r.party_color,
  })) || [];

  return (
    <div className="min-h-screen bg-night-count">
      {/* Live Ticker */}
      <LiveTicker totalVotes={results?.total_votes || 0} />
      
      {/* Hero Header */}
      <div className="relative py-16 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gorkhali-red/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rsp-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="flex items-center gap-2 bg-gorkhali-red/20 px-4 py-2 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-3 h-3 bg-gorkhali-red rounded-full animate-pulse" />
                  <span className="text-gorkhali-red font-bebas tracking-wider text-sm">LIVE</span>
                </motion.div>
                <span className="text-gray-500 font-inter text-sm">Auto-refreshing</span>
              </div>
              <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider" data-testid="results-heading">
                ELECTION RESULTS
              </h1>
              <p className="font-inter text-gray-400 mt-2">
                Prime Minister Election Simulation • Real-time vote counting
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="text-right">
                <p className="font-inter text-xs text-gray-500">Last updated</p>
                <p className="font-bebas text-xl text-white tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-marigold" />
                  {formatTime(lastUpdated)}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => fetchResults(true)}
                  disabled={refreshing}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bebas tracking-wider"
                  data-testid="refresh-btn"
                >
                  <RefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} size={18} />
                  REFRESH
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "TOTAL VOTES", value: results?.total_votes || 0, color: "gorkhali-red", isNumber: true },
            { icon: Trophy, label: "LEADING", value: winner?.candidate_name?.split(" ")[0] || "—", color: "marigold" },
            { icon: TrendingUp, label: "LEAD %", value: `${winner?.percentage || 0}%`, color: "rsp-blue" },
            { icon: Activity, label: "STATUS", value: "ACTIVE", color: "congress-green" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-sm hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className={`w-12 h-12 bg-${stat.color}/20 rounded-full flex items-center justify-center`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <stat.icon className={`text-${stat.color}`} size={24} />
                </motion.div>
                <div>
                  <p className="font-inter text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="font-bebas text-2xl text-white tracking-wider">
                    {stat.isNumber ? <AnimatedNumber value={stat.value} /> : stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Winner Banner */}
        <AnimatePresence>
          {results?.total_votes > 0 && winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-gradient-to-r from-marigold/20 via-marigold/10 to-transparent border border-marigold/30 p-6 rounded-sm relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="flex items-center gap-6 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="text-marigold" size={48} />
                </motion.div>
                <div>
                  <p className="font-inter text-sm text-gray-400 uppercase tracking-wider">Currently Leading</p>
                  <p className="font-bebas text-4xl text-white tracking-wider">{winner.candidate_name}</p>
                  <p className="font-inter text-marigold">{winner.party} • {winner.vote_count} votes ({winner.percentage}%)</p>
                </div>
                <motion.div
                  className="ml-auto"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-marigold" size={32} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid with Ad */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Results Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Vote Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="text-gorkhali-red" size={24} />
                  <h2 className="font-bebas text-2xl text-peace-blue tracking-wider">VOTE DISTRIBUTION</h2>
                </div>
                <span className="text-xs text-gray-400 font-inter">Click to explore</span>
              </div>
              
              <div className="space-y-5">
                {results?.results?.map((result, index) => (
                  <motion.div
                    key={result.candidate_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {index === 0 && results.total_votes > 0 && (
                          <motion.span 
                            className="bg-gradient-to-r from-marigold to-rpp-gold text-white text-xs font-bebas tracking-wider px-3 py-1 rounded-sm"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            LEADING
                          </motion.span>
                        )}
                        <span className="font-bebas text-lg text-peace-blue">{result.candidate_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bebas text-2xl text-peace-blue">{result.percentage}%</span>
                        <span className="font-inter text-sm text-gray-500 ml-2">({result.vote_count})</span>
                      </div>
                    </div>
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ backgroundColor: result.party_color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      />
                    </div>
                    <p className="font-inter text-xs text-gray-500 mt-1">{result.party}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-sm p-6 shadow-xl"
              >
                <h3 className="font-bebas text-xl text-peace-blue tracking-wider mb-4 flex items-center gap-2">
                  <BarChart className="text-rsp-blue" size={20} />
                  VOTES COMPARISON
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontFamily: "Inter", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontFamily: "Bebas Neue", fontSize: 13 }} width={70} />
                    <Tooltip
                      contentStyle={{ fontFamily: "Inter", borderRadius: "4px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                      formatter={(value, name, props) => [`${value} votes`, props.payload.fullName]}
                    />
                    <Bar dataKey="votes" radius={[0, 8, 8, 0]} animationDuration={1500}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-sm p-6 shadow-xl"
              >
                <h3 className="font-bebas text-xl text-peace-blue tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="text-marigold" size={20} />
                  VOTE SHARE
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      dataKey="votes"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationDuration={1500}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: "Inter" }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>

          {/* Ad Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AdBanner type="rectangle" id="results-sidebar-1" />
            <AdBanner type="rectangle" id="results-sidebar-2" />
            
            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
              <h3 className="font-bebas text-lg text-white tracking-wider mb-4">QUICK ACTIONS</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gorkhali-red hover:bg-communist-red text-white font-bebas tracking-wider" onClick={() => window.location.href = "/vote"}>
                  <Vote className="mr-2" size={18} />
                  CAST YOUR VOTE
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 font-bebas tracking-wider" onClick={() => window.location.href = "/history"}>
                  ELECTION HISTORY
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* No Votes Message */}
        <AnimatePresence>
          {results?.total_votes === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Vote className="mx-auto text-gray-600 mb-4" size={64} />
              </motion.div>
              <p className="font-bebas text-3xl text-white tracking-wider mb-2">NO VOTES YET</p>
              <p className="font-playfair text-xl text-gray-400 italic mb-6">Be the first to vote!</p>
              <Button className="bg-gorkhali-red hover:bg-communist-red text-white font-bebas tracking-wider text-lg px-8 py-6" onClick={() => window.location.href = "/vote"}>
                CAST YOUR VOTE →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Ad */}
        <div className="mt-12 flex justify-center">
          <AdBanner type="leaderboard" id="results-bottom" />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
