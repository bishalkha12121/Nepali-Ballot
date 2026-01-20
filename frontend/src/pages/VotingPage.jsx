import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, Vote, Sun, TreeDeciduous, Bell, Gavel, Shield, Loader2, Sparkles, Lock, CheckCircle2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map party symbols to icons
const partyIcons = {
  Sun: Sun,
  TreeDeciduous: TreeDeciduous,
  Bell: Bell,
  Gavel: Gavel,
};

// Generate or get voter token from localStorage
const getVoterToken = () => {
  let token = localStorage.getItem("voter_token");
  if (!token) {
    token = `voter_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("voter_token", token);
  }
  return token;
};

// Animated particles for celebration
const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: ['#D90429', '#003049', '#F77F00', '#48CAE4'][i % 4],
          left: `${Math.random() * 100}%`,
        }}
        initial={{ y: -20, opacity: 1 }}
        animate={{
          y: window.innerHeight + 20,
          x: (Math.random() - 0.5) * 200,
          rotate: Math.random() * 360,
          opacity: 0,
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 0.5,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

const VotingPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchCandidates();
    checkVoteStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API}/candidates`);
      setCandidates(response.data);
    } catch (error) {
      toast.error("Failed to load candidates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const voterToken = getVoterToken();
      const response = await axios.get(`${API}/check-vote/${voterToken}`);
      if (response.data.has_voted) {
        setHasVoted(true);
        setVotedFor(response.data.candidate_id);
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmVote = async () => {
    setSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      const voterToken = getVoterToken();
      await axios.post(`${API}/vote`, {
        candidate_id: selectedCandidate.id,
        voter_token: voterToken,
      });
      
      setShowConfetti(true);
      toast.success("Your vote has been cast successfully!", {
        icon: <Sparkles className="text-marigold" />,
      });
      setHasVoted(true);
      setVotedFor(selectedCandidate.id);
      
      // Navigate to results after celebration
      setTimeout(() => {
        setShowConfetti(false);
        navigate("/results");
      }, 3000);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("You have already voted in this election");
        setHasVoted(true);
      } else {
        toast.error("Failed to cast vote. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getVotedCandidate = () => {
    return candidates.find((c) => c.id === votedFor);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rice-paper">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="spinner mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-inter text-peace-blue">Loading candidates...</p>
        </motion.div>
      </div>
    );
  }

  // Already voted view
  if (hasVoted) {
    const votedCandidate = getVotedCandidate();
    return (
      <div className="min-h-screen bg-rice-paper py-12 px-4">
        {showConfetti && <Confetti />}
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-28 h-28 bg-gradient-to-br from-congress-green to-rsp-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle2 className="text-white" size={56} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-bebas text-4xl sm:text-5xl text-peace-blue tracking-wider mb-4 glow-text-blue" 
            data-testid="voted-heading"
          >
            THANK YOU FOR VOTING!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-inter text-gray-600 mb-8 text-lg"
          >
            Your voice has been heard. You voted for:
          </motion.p>
          
          {votedCandidate && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="bg-white border-2 border-congress-green p-8 rounded-sm inline-block shadow-xl"
              data-testid="voted-candidate-card"
            >
              <motion.img
                src={votedCandidate.image_url}
                alt={votedCandidate.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-congress-green"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h2 className="font-bebas text-3xl text-peace-blue">{votedCandidate.name}</h2>
              <p className="font-inter text-gray-500" style={{ color: votedCandidate.party_color }}>
                {votedCandidate.party}
              </p>
              <p className="font-playfair text-sm text-gray-400 italic mt-2">
                "{votedCandidate.slogan}"
              </p>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10"
          >
            <Button
              onClick={() => navigate("/results")}
              className="btn-primary text-lg px-10 py-6"
              data-testid="view-results-btn"
            >
              VIEW LIVE RESULTS →
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rice-paper">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="bg-peace-blue py-16 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Vote className="mx-auto mb-4 text-marigold" size={48} />
            </motion.div>
            <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider mb-4 glow-text" data-testid="voting-heading">
              CAST YOUR VOTE
            </h1>
            <p className="font-inter text-gray-300 text-lg">
              Select your preferred candidate for Prime Minister
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 p-5 flex items-center gap-4 shadow-lg rounded-sm"
          data-testid="privacy-notice"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="text-congress-green flex-shrink-0" size={28} />
          </motion.div>
          <div>
            <p className="font-bebas text-lg text-peace-blue tracking-wider">ANONYMOUS VOTING</p>
            <p className="font-inter text-sm text-gray-600">
              Your vote is private and cannot be traced back to you. Each browser can only vote once.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
          data-testid="candidates-grid"
        >
          <AnimatePresence>
            {candidates.map((candidate, index) => {
              const IconComponent = partyIcons[candidate.party_symbol] || Bell;
              const isSelected = selectedCandidate?.id === candidate.id;
              
              return (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`candidate-card bg-white border-2 p-6 cursor-pointer relative ${
                    isSelected
                      ? "border-gorkhali-red selected"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  data-testid={`candidate-card-${candidate.id}`}
                >
                  {/* Selection indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="absolute top-4 right-4 w-10 h-10 bg-gorkhali-red rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="text-white" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Party Symbol */}
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${candidate.party_color}20` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent
                      size={32}
                      style={{ color: candidate.party_color }}
                    />
                  </motion.div>
                  
                  {/* Candidate Image */}
                  <motion.div
                    className="relative mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={candidate.image_url}
                      alt={candidate.name}
                      className="w-28 h-28 rounded-full mx-auto object-cover border-4"
                      style={{ borderColor: isSelected ? candidate.party_color : '#f1f5f9' }}
                    />
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `3px solid ${candidate.party_color}` }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Candidate Info */}
                  <h3 className="font-bebas text-xl text-peace-blue tracking-wider text-center">
                    {candidate.name}
                  </h3>
                  <p
                    className="font-inter text-sm text-center mb-2 font-medium"
                    style={{ color: candidate.party_color }}
                  >
                    {candidate.party}
                  </p>
                  <p className="font-playfair text-sm text-gray-500 text-center italic">
                    "{candidate.slogan}"
                  </p>
                  
                  {/* Bio (truncated) */}
                  <p className="font-inter text-xs text-gray-400 text-center mt-3 line-clamp-2">
                    {candidate.bio}
                  </p>
                  
                  {/* Click hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSelected ? 0 : 1 }}
                    className="text-center mt-4 text-xs text-gray-400 font-inter"
                  >
                    Click to select
                  </motion.p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Vote Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <motion.div
            whileHover={{ scale: selectedCandidate ? 1.05 : 1 }}
            whileTap={{ scale: selectedCandidate ? 0.95 : 1 }}
          >
            <Button
              onClick={handleVote}
              disabled={!selectedCandidate || submitting}
              className="btn-primary text-xl px-14 py-8 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-vote-btn"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={24} />
                  SUBMITTING...
                </>
              ) : (
                <>
                  <Vote className="mr-2" size={24} />
                  SUBMIT VOTE
                  {selectedCandidate && <Sparkles className="ml-2" size={20} />}
                </>
              )}
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {!selectedCandidate && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-inter text-sm text-gray-500 mt-4"
              >
                ↑ Click on a candidate card to select
              </motion.p>
            )}
            {selectedCandidate && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-bebas text-lg tracking-wider mt-4"
                style={{ color: selectedCandidate.party_color }}
              >
                SELECTED: {selectedCandidate.name.toUpperCase()}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-2 border-peace-blue" data-testid="confirm-vote-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bebas text-3xl tracking-wider text-center">
              CONFIRM YOUR VOTE
            </AlertDialogTitle>
            <AlertDialogDescription className="font-inter text-center">
              <div className="py-4">
                {selectedCandidate && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-block"
                  >
                    <img
                      src={selectedCandidate.image_url}
                      alt={selectedCandidate.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-4"
                      style={{ borderColor: selectedCandidate.party_color }}
                    />
                    <p className="font-bebas text-xl text-peace-blue">{selectedCandidate.name}</p>
                    <p className="text-sm" style={{ color: selectedCandidate.party_color }}>
                      {selectedCandidate.party}
                    </p>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-600">
                This action cannot be undone. Are you sure you want to proceed?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="font-bebas tracking-wider text-lg" data-testid="cancel-vote-btn">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVote}
              className="btn-primary text-lg"
              data-testid="confirm-vote-btn"
            >
              <Check className="mr-2" size={20} />
              CONFIRM VOTE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VotingPage;
