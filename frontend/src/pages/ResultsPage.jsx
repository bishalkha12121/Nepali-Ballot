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
} from "recharts";
import { RefreshCw, Trophy, Users, TrendingUp, Clock, Zap, Activity, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animated Counter
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
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setDisplayValue(Math.floor(startValue + diff * easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue.toLocaleString()}</span>;
};

// Live Ticker
const LiveTicker = ({ totalVotes }) => (
  <div className="ticker-wrapper">
    <div className="ticker-content">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="ticker-item">
          🗳️ LIVE RESULTS • Total Votes: {totalVotes.toLocaleString()} • 
          Election Simulation Active • Watch results update in real-time • 
          🔴 LIVE
        </span>
      ))}
    </div>
  </div>
);

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updateFlash, setUpdateFlash] = useState(false);

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 10 seconds for more live feel
    const interval = setInterval(() => fetchResults(false, true), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async (showToast = false, isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) setRefreshing(true);
      const response = await axios.get(`${API}/results`);
      
      // Check if data changed
      if (results && response.data.total_votes !== results.total_votes) {
        setUpdateFlash(true);
        setTimeout(() => setUpdateFlash(false), 1000);
      }
      
      setResults(response.data);
      setLastUpdated(new Date());
      if (showToast) {
        toast.success("Results refreshed!");
      }
    } catch (error) {
      toast.error("Failed to load results");
      console.error(error);
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
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gorkhali-red border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-inter text-gray-400">Loading live results...</p>
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
      
      {/* Header */}
      <div className="bg-peace-blue py-10 px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 rounded-full bg-white/5"
              style={{
                left: `${20 * i}%`,
                top: "50%",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="live-indicator"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="live-dot" />
                  <span className="text-white font-bebas tracking-wider">LIVE</span>
                </motion.div>
              </div>
              <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider glow-text" data-testid="results-heading">
                ELECTION RESULTS
              </h1>
              <p className="font-inter text-gray-300 text-sm mt-1">
                Prime Minister Election Simulation
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right text-white">
                <p className="font-inter text-xs text-gray-400">Last updated</p>
                <motion.p 
                  className="font-bebas tracking-wider flex items-center gap-2"
                  animate={updateFlash ? { scale: [1, 1.1, 1] } : {}}
                >
                  <Clock size={14} />
                  {formatTime(lastUpdated)}
                </motion.p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => fetchResults(true)}
                  disabled={refreshing}
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-peace-blue shimmer"
                  data-testid="refresh-btn"
                >
                  <RefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} size={16} />
                  REFRESH
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Votes", value: results?.total_votes || 0, color: "gorkhali-red" },
            { icon: Trophy, label: "Leading Candidate", value: winner?.candidate_name || "No votes yet", isText: true, color: "marigold" },
            { icon: TrendingUp, label: "Lead Percentage", value: `${winner?.percentage || 0}%`, isText: true, color: "rsp-blue" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white/5 backdrop-blur border border-white/10 p-6 rounded-sm relative overflow-hidden ${
                updateFlash && stat.label === "Total Votes" ? "ring-2 ring-marigold" : ""
              }`}
              data-testid={`${stat.label.toLowerCase().replace(' ', '-')}-card`}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              
              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  className={`w-14 h-14 bg-${stat.color}/20 rounded-full flex items-center justify-center`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <stat.icon className={`text-${stat.color}`} size={28} />
                </motion.div>
                <div>
                  <p className="font-inter text-gray-400 text-sm">{stat.label}</p>
                  <p className="font-bebas text-3xl text-white tracking-wider">
                    {stat.isText ? stat.value : <AnimatedNumber value={stat.value} />}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Winner Highlight (if votes exist) */}
        <AnimatePresence>
          {results?.total_votes > 0 && winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-gradient-to-r from-marigold/20 to-transparent border border-marigold/30 p-6 rounded-sm"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="text-marigold" size={40} />
                </motion.div>
                <div>
                  <p className="font-inter text-sm text-gray-400">CURRENTLY LEADING</p>
                  <p className="font-bebas text-3xl text-white tracking-wider">{winner.candidate_name}</p>
                  <p className="font-inter text-marigold">{winner.party} • {winner.percentage}% of votes</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vote Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-sm p-6 shadow-xl"
            data-testid="vote-distribution-section"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-gorkhali-red" size={24} />
              <h2 className="font-bebas text-2xl text-peace-blue tracking-wider">
                VOTE DISTRIBUTION
              </h2>
            </div>
            
            <div className="space-y-5">
              {results?.results?.map((result, index) => (
                <motion.div
                  key={result.candidate_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  data-testid={`result-${result.candidate_id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {index === 0 && results.total_votes > 0 && (
                        <motion.span 
                          className="winner-badge"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          LEADING
                        </motion.span>
                      )}
                      <span className="font-bebas text-lg text-peace-blue">
                        {result.candidate_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <motion.span 
                        className="font-bebas text-xl text-peace-blue"
                        key={result.vote_count}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {result.percentage}%
                      </motion.span>
                      <span className="font-inter text-sm text-gray-500 ml-2">
                        ({result.vote_count} votes)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full progress-bar-animated"
                      style={{ backgroundColor: result.party_color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="font-inter text-xs text-gray-500 mt-1">
                    {result.party}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-sm p-6 shadow-xl"
            data-testid="bar-chart-section"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart className="text-rsp-blue" size={24} />
              <h2 className="font-bebas text-2xl text-peace-blue tracking-wider">
                VOTES BY CANDIDATE
              </h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontFamily: "Inter", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontFamily: "Bebas Neue", fontSize: 14, letterSpacing: "1px" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Inter",
                    borderRadius: "4px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value, name, props) => [
                    `${value} votes (${props.payload.percentage}%)`,
                    props.payload.fullName
                  ]}
                />
                <Bar dataKey="votes" radius={[0, 8, 8, 0]} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-sm p-6 shadow-xl lg:col-span-2"
            data-testid="pie-chart-section"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-marigold" size={24} />
              <h2 className="font-bebas text-2xl text-peace-blue tracking-wider">
                VOTE SHARE DISTRIBUTION
              </h2>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={80}
                  dataKey="votes"
                  nameKey="fullName"
                  label={({ fullName, percentage }) => `${fullName?.split(" ")[0]} ${percentage}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontFamily: "Inter",
                    borderRadius: "4px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontFamily: "Inter", color: "#003049", fontSize: "14px" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* No Votes Message */}
        <AnimatePresence>
          {results?.total_votes === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Vote className="mx-auto text-gray-600 mb-4" size={64} />
              </motion.div>
              <p className="font-playfair text-2xl text-gray-400 italic">
                No votes have been cast yet. Be the first to vote!
              </p>
              <Button 
                className="btn-primary mt-6"
                onClick={() => window.location.href = "/vote"}
              >
                CAST YOUR VOTE →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsPage;
