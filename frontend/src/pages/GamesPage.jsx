import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gamepad2, Brain, Target, Trophy, Star, Zap, RotateCcw, CheckCircle, XCircle, Clock, Gift, Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";

// Quiz Questions about Nepal Politics
const QUIZ_QUESTIONS = [
  { q: "When did Nepal become a Federal Democratic Republic?", options: ["2006", "2007", "2008", "2010"], correct: 2 },
  { q: "How many provinces does Nepal have?", options: ["5", "6", "7", "8"], correct: 2 },
  { q: "Who is the Mayor of Kathmandu (elected 2022)?", options: ["KP Sharma Oli", "Balen Shah", "Sher Bahadur Deuba", "Rabi Lamichhane"], correct: 1 },
  { q: "What is the symbol of Nepali Congress party?", options: ["Sun", "Tree", "Bell", "Hammer"], correct: 1 },
  { q: "Which year was Jana Andolan II?", options: ["2004", "2005", "2006", "2007"], correct: 2 },
  { q: "What is RSP's election symbol?", options: ["Sun", "Tree", "Bell", "Crown"], correct: 2 },
  { q: "How many seats in Nepal's Federal Parliament?", options: ["225", "250", "275", "300"], correct: 2 },
  { q: "Who led the Maoist insurgency?", options: ["KP Oli", "Deuba", "Prachanda", "Madhav Nepal"], correct: 2 },
  { q: "Capital of Koshi Province?", options: ["Pokhara", "Biratnagar", "Janakpur", "Hetauda"], correct: 1 },
  { q: "Year of Nepal's new constitution?", options: ["2013", "2014", "2015", "2016"], correct: 2 },
];

// Candidates for Memory Game
const CANDIDATES = [
  { id: "balen", name: "Balen Shah", color: "#48CAE4" },
  { id: "oli", name: "KP Oli", color: "#EF233C" },
  { id: "deuba", name: "Deuba", color: "#2A9D8F" },
  { id: "prachanda", name: "Prachanda", color: "#B91C1C" },
  { id: "rabi", name: "Rabi", color: "#48CAE4" },
];

// Spin Wheel Prizes
const WHEEL_PRIZES = [
  { label: "🏆 10 Points", points: 10, color: "#D90429" },
  { label: "⭐ 25 Points", points: 25, color: "#003049" },
  { label: "🎯 50 Points", points: 50, color: "#F77F00" },
  { label: "💎 100 Points", points: 100, color: "#48CAE4" },
  { label: "🔥 200 Points", points: 200, color: "#2A9D8F" },
  { label: "👑 500 Points", points: 500, color: "#FFB703" },
];

// Ad Banner
const AdBanner = ({ id }) => (
  <div className="bg-white/5 border border-white/10 flex items-center justify-center rounded-sm h-[250px] w-full max-w-[300px]">
    <div className="text-center"><p className="text-gray-500 text-xs">AD</p><p className="text-gray-400 font-bebas">300x250</p></div>
  </div>
);

// Live Ticker
const LiveTicker = () => (
  <div className="bg-gradient-to-r from-gorkhali-red via-peace-blue to-gorkhali-red py-3 overflow-hidden">
    <motion.div className="flex whitespace-nowrap" animate={{ x: [0, -1500] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
      {[...Array(4)].map((_, i) => (
        <span key={i} className="mx-8 text-white font-bebas tracking-wider text-sm">
          🎮 PLAY GAMES • WIN POINTS • NEPAL POLITICS QUIZ • MEMORY MATCH • SPIN THE WHEEL • <span className="text-marigold">★</span>
        </span>
      ))}
    </motion.div>
  </div>
);

// Footer
const Footer = () => (
  <footer className="bg-black py-12 relative">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <motion.div className="inline-flex items-center gap-2 bg-gradient-to-r from-gorkhali-red/20 to-rsp-blue/20 px-4 py-2 rounded-full border border-white/10 mb-4" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Sparkles className="text-marigold" size={16} /><span className="text-white font-bebas tracking-wider text-sm">BUILT BY TWO GEN Zs 🔥</span><Zap className="text-rsp-blue" size={16} />
      </motion.div>
      <p className="text-gray-500 text-sm">© 2024 Nepali Ballot • Entertainment Only</p>
    </div>
  </footer>
);

// Quiz Game Component
const QuizGame = ({ onBack, onScore }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (gameOver || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleAnswer(-1); return 15; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, gameOver, showResult]);

  const handleAnswer = (idx) => {
    setSelected(idx);
    setShowResult(true);
    if (idx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(s => s + 10);
      toast.success("+10 Points!");
    }
    setTimeout(() => {
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        setGameOver(true);
        onScore(score + (idx === QUIZ_QUESTIONS[currentQ].correct ? 10 : 0));
      }
    }, 1500);
  };

  if (gameOver) {
    const finalScore = score;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Trophy className="mx-auto text-marigold mb-4" size={80} />
        </motion.div>
        <h2 className="font-bebas text-4xl text-white tracking-wider mb-2">QUIZ COMPLETE!</h2>
        <p className="font-bebas text-6xl text-marigold mb-4">{finalScore} POINTS</p>
        <p className="text-gray-400 mb-8">{finalScore >= 80 ? "🏆 Expert!" : finalScore >= 50 ? "⭐ Good job!" : "📚 Keep learning!"}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => { setCurrentQ(0); setScore(0); setGameOver(false); setTimeLeft(15); }} className="bg-gorkhali-red text-white font-bebas"><RotateCcw className="mr-2" size={18} />PLAY AGAIN</Button>
          <Button onClick={onBack} variant="outline" className="border-white/20 text-white font-bebas">BACK TO GAMES</Button>
        </div>
      </motion.div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="font-bebas text-white text-xl">Q{currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
        <span className="font-bebas text-marigold text-xl">{score} PTS</span>
        <div className="flex items-center gap-2">
          <Clock className={`${timeLeft <= 5 ? "text-gorkhali-red animate-pulse" : "text-white"}`} size={20} />
          <span className={`font-bebas text-xl ${timeLeft <= 5 ? "text-gorkhali-red" : "text-white"}`}>{timeLeft}s</span>
        </div>
      </div>
      <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/10 p-6 rounded-sm mb-6">
        <h3 className="font-playfair text-xl text-white mb-6">{q.q}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !showResult && handleAnswer(idx)}
              disabled={showResult}
              className={`p-4 rounded-sm font-bebas tracking-wider text-left transition-all ${
                showResult
                  ? idx === q.correct
                    ? "bg-congress-green text-white"
                    : idx === selected
                    ? "bg-gorkhali-red text-white"
                    : "bg-white/5 text-gray-400"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span className="mr-3">{["A", "B", "C", "D"][idx]}.</span>{opt}
              {showResult && idx === q.correct && <CheckCircle className="inline ml-2" size={18} />}
              {showResult && idx === selected && idx !== q.correct && <XCircle className="inline ml-2" size={18} />}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-gorkhali-red to-marigold" initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>
    </div>
  );
};

// Memory Game Component
const MemoryGame = ({ onBack, onScore }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffled = [...CANDIDATES, ...CANDIDATES]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, uid: i }));
    setCards(shuffled);
  }, []);

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].id)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatched(m => [...m, cards[first].id]);
        setFlipped([]);
        toast.success("+20 Points!");
        if (matched.length + 1 === CANDIDATES.length) {
          setTimeout(() => {
            setGameOver(true);
            onScore(Math.max(100 - moves * 2, 20));
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (gameOver) {
    const finalScore = Math.max(100 - moves * 2, 20);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Trophy className="mx-auto text-marigold mb-4" size={80} />
        <h2 className="font-bebas text-4xl text-white mb-2">MATCHED ALL!</h2>
        <p className="font-bebas text-6xl text-marigold mb-2">{finalScore} PTS</p>
        <p className="text-gray-400 mb-8">Completed in {moves} moves</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => { setMatched([]); setMoves(0); setGameOver(false); setFlipped([]); setCards([...CANDIDATES, ...CANDIDATES].sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, uid: i }))); }} className="bg-gorkhali-red text-white font-bebas"><RotateCcw className="mr-2" size={18} />PLAY AGAIN</Button>
          <Button onClick={onBack} variant="outline" className="border-white/20 text-white font-bebas">BACK</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between mb-6">
        <span className="font-bebas text-white text-xl">MOVES: {moves}</span>
        <span className="font-bebas text-marigold text-xl">MATCHED: {matched.length}/{CANDIDATES.length}</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.id);
          return (
            <motion.div
              key={card.uid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(idx)}
              className={`aspect-square rounded-sm cursor-pointer flex items-center justify-center font-bebas text-sm transition-all ${
                isFlipped ? "text-white" : "bg-white/10 text-transparent hover:bg-white/20"
              }`}
              style={{ backgroundColor: isFlipped ? card.color : undefined }}
            >
              {isFlipped ? card.name.split(" ")[0] : "?"}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Spin Wheel Component
const SpinWheel = ({ onBack, onScore }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    setPrize(null);
    const spins = 5 + Math.random() * 5;
    const prizeIdx = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const newRotation = rotation + spins * 360 + prizeIdx * (360 / WHEEL_PRIZES.length);
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      setPrize(WHEEL_PRIZES[prizeIdx]);
      setSpinsLeft(s => s - 1);
      onScore(WHEEL_PRIZES[prizeIdx].points);
      toast.success(`Won ${WHEEL_PRIZES[prizeIdx].points} Points!`);
    }, 4000);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-6 max-w-md mx-auto">
        <span className="font-bebas text-white text-xl">SPINS LEFT: {spinsLeft}</span>
        {prize && <span className="font-bebas text-marigold text-xl">WON: {prize.points} PTS</span>}
      </div>
      
      <div className="relative w-72 h-72 mx-auto mb-8">
        <motion.div
          className="w-full h-full rounded-full border-4 border-marigold relative overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          {WHEEL_PRIZES.map((p, i) => (
            <div
              key={i}
              className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
              style={{
                transform: `rotate(${i * 60}deg) skewY(-30deg)`,
                backgroundColor: p.color,
              }}
            >
              <span className="font-bebas text-white text-xs transform skewY-30 rotate-30" style={{ transform: "skewY(30deg) rotate(-30deg)" }}>{p.label}</span>
            </div>
          ))}
        </motion.div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-marigold" />
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={spin}
          disabled={spinning || spinsLeft <= 0}
          className="bg-gradient-to-r from-gorkhali-red to-marigold text-white font-bebas text-xl px-12 py-6 disabled:opacity-50"
        >
          {spinning ? "SPINNING..." : spinsLeft > 0 ? "SPIN THE WHEEL!" : "NO SPINS LEFT"}
        </Button>
      </motion.div>
      
      {spinsLeft <= 0 && (
        <Button onClick={onBack} variant="outline" className="border-white/20 text-white font-bebas mt-4">BACK TO GAMES</Button>
      )}
    </div>
  );
};

// Main Games Page
const GamesPage = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem("game_score");
    return saved ? parseInt(saved) : 0;
  });

  const addScore = (points) => {
    const newScore = totalScore + points;
    setTotalScore(newScore);
    localStorage.setItem("game_score", newScore.toString());
  };

  const games = [
    { id: "quiz", name: "NEPAL POLITICS QUIZ", desc: "Test your knowledge!", icon: Brain, color: "gorkhali-red" },
    { id: "memory", name: "CANDIDATE MATCH", desc: "Match the leaders!", icon: Target, color: "rsp-blue" },
    { id: "spin", name: "SPIN THE WHEEL", desc: "Win bonus points!", icon: Gift, color: "marigold" },
  ];

  return (
    <div className="min-h-screen bg-night-count">
      <LiveTicker />
      
      {/* Hero */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gorkhali-red/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-rsp-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Gamepad2 className="mx-auto mb-6 text-marigold" size={64} />
            </motion.div>
            <h1 className="font-bebas text-6xl sm:text-7xl text-white tracking-wider mb-4" style={{ textShadow: "0 0 60px rgba(247,127,0,0.5)" }}>
              MINI GAMES
            </h1>
            <p className="font-playfair text-xl text-gray-300 italic">"Learn while you play!"</p>
            
            {/* Score Display */}
            <motion.div className="inline-flex items-center gap-3 bg-gradient-to-r from-marigold/20 to-rpp-gold/20 px-6 py-3 rounded-full border border-marigold/30 mt-6" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Crown className="text-marigold" size={24} />
              <span className="font-bebas text-2xl text-white tracking-wider">TOTAL SCORE: {totalScore}</span>
              <Star className="text-marigold" size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {activeGame === "quiz" && <QuizGame onBack={() => setActiveGame(null)} onScore={addScore} />}
              {activeGame === "memory" && <MemoryGame onBack={() => setActiveGame(null)} onScore={addScore} />}
              {activeGame === "spin" && <SpinWheel onBack={() => setActiveGame(null)} onScore={addScore} />}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game, i) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => setActiveGame(game.id)}
                        className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-sm cursor-pointer hover:border-marigold/50 transition-all group"
                      >
                        <motion.div className={`w-16 h-16 bg-${game.color}/20 rounded-full flex items-center justify-center mx-auto mb-6`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                          <game.icon className={`text-${game.color}`} size={32} />
                        </motion.div>
                        <h3 className="font-bebas text-2xl text-white tracking-wider text-center mb-2">{game.name}</h3>
                        <p className="font-inter text-gray-400 text-center text-sm">{game.desc}</p>
                        <div className="mt-6 text-center">
                          <span className="font-bebas text-marigold tracking-wider text-sm group-hover:underline">PLAY NOW →</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Leaderboard */}
                  <div className="mt-8 bg-white/5 border border-white/10 p-6 rounded-sm">
                    <h3 className="font-bebas text-2xl text-white tracking-wider mb-4 flex items-center gap-2">
                      <Trophy className="text-marigold" size={24} />YOUR STATS
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center"><p className="font-bebas text-3xl text-marigold">{totalScore}</p><p className="text-gray-500 text-sm">Total Points</p></div>
                      <div className="text-center"><p className="font-bebas text-3xl text-rsp-blue">{Math.floor(totalScore / 100)}</p><p className="text-gray-500 text-sm">Level</p></div>
                      <div className="text-center"><p className="font-bebas text-3xl text-congress-green">{totalScore >= 500 ? "🏆" : totalScore >= 200 ? "⭐" : "🎯"}</p><p className="text-gray-500 text-sm">Rank</p></div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  <AdBanner id="games-1" />
                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                    <h3 className="font-bebas text-lg text-white mb-3">HOW TO EARN</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>🧠 Quiz: 10pts/correct</li>
                      <li>🎯 Memory: Up to 100pts</li>
                      <li>🎡 Spin: 10-500pts</li>
                    </ul>
                  </div>
                  <AdBanner id="games-2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
};

export default GamesPage;
