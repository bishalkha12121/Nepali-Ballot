import { motion } from "framer-motion";

// Beautiful Nepal Map SVG with 7 provinces
const NepalMap = ({ className = "", showProvinces = true, highlightProvince = null }) => {
  const provinces = [
    { id: "koshi", name: "Koshi", color: "#EF233C", path: "M280,30 L320,25 L350,40 L380,35 L400,50 L390,80 L370,100 L340,95 L310,110 L280,90 L260,60 Z" },
    { id: "madhesh", name: "Madhesh", color: "#2A9D8F", path: "M180,100 L220,95 L260,105 L310,110 L340,95 L370,100 L360,130 L320,140 L280,135 L230,145 L190,135 L170,115 Z" },
    { id: "bagmati", name: "Bagmati", color: "#48CAE4", path: "M180,100 L220,95 L260,105 L280,90 L260,60 L230,50 L200,55 L175,70 L160,85 Z" },
    { id: "gandaki", name: "Gandaki", color: "#FFB703", path: "M120,55 L160,50 L200,55 L230,50 L260,60 L240,80 L220,95 L180,100 L160,85 L130,90 L110,75 Z" },
    { id: "lumbini", name: "Lumbini", color: "#F77F00", path: "M60,80 L110,75 L130,90 L160,85 L180,100 L170,115 L190,135 L160,150 L120,145 L80,130 L50,110 Z" },
    { id: "karnali", name: "Karnali", color: "#B91C1C", path: "M10,50 L50,40 L90,45 L120,55 L110,75 L60,80 L50,110 L30,100 L15,75 Z" },
    { id: "sudurpashchim", name: "Sudurpashchim", color: "#6366F1", path: "M0,30 L30,20 L60,25 L50,40 L10,50 L15,75 L30,100 L15,115 L0,100 Z" },
  ];

  return (
    <div className={`relative ${className}`}>
      <svg 
        viewBox="0 0 400 160" 
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
      >
        {/* Background glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
        </defs>

        {/* Nepal outline base */}
        <path 
          d="M0,30 L30,20 L60,25 L90,45 L120,55 L160,50 L200,55 L230,50 L260,60 L280,30 L320,25 L350,40 L380,35 L400,50 L390,80 L370,100 L360,130 L320,140 L280,135 L230,145 L190,135 L160,150 L120,145 L80,130 L50,110 L30,100 L15,115 L0,100 Z"
          fill="url(#mapGradient)"
          stroke="#EF233C"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Province regions */}
        {showProvinces && provinces.map((province) => (
          <motion.path
            key={province.id}
            d={province.path}
            fill={highlightProvince === province.id ? province.color : `${province.color}40`}
            stroke={province.color}
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ 
              fill: province.color,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Province labels */}
        {showProvinces && (
          <>
            <text x="330" y="70" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">KOSHI</text>
            <text x="270" y="125" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">MADHESH</text>
            <text x="200" y="80" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">BAGMATI</text>
            <text x="150" y="70" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">GANDAKI</text>
            <text x="100" y="115" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">LUMBINI</text>
            <text x="50" y="70" fill="white" fontSize="8" fontFamily="Bebas Neue" opacity="0.8">KARNALI</text>
            <text x="10" y="70" fill="white" fontSize="6" fontFamily="Bebas Neue" opacity="0.8">SUDUR</text>
          </>
        )}

        {/* Mount Everest marker */}
        <g transform="translate(350, 35)">
          <polygon points="0,15 8,0 16,15" fill="#FFFFFF" opacity="0.9" />
          <text x="8" y="25" fill="white" fontSize="5" textAnchor="middle" fontFamily="Arial">🏔️</text>
        </g>

        {/* Kathmandu marker */}
        <g transform="translate(215, 75)">
          <circle r="4" fill="#EF233C" />
          <circle r="6" fill="none" stroke="#EF233C" strokeWidth="1" opacity="0.5">
            <animate attributeName="r" from="4" to="10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="15" fill="white" fontSize="6" textAnchor="middle" fontFamily="Bebas Neue">KATHMANDU</text>
        </g>
      </svg>

      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gorkhali-red opacity-50" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gorkhali-red opacity-50" />
    </div>
  );
};

// Nepal Flag SVG - the unique double pennant design
export const NepalFlag = ({ size = 100, className = "" }) => (
  <motion.svg 
    viewBox="0 0 100 122" 
    width={size} 
    height={size * 1.22}
    className={className}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Blue border */}
    <polygon points="0,0 100,41 0,82 0,0" fill="#003893" />
    <polygon points="0,41 100,82 0,122 0,41" fill="#003893" />
    
    {/* Red inner */}
    <polygon points="5,5 90,41 5,77 5,5" fill="#DC143C" />
    <polygon points="5,46 90,82 5,117 5,46" fill="#DC143C" />
    
    {/* Moon symbol in upper part */}
    <g transform="translate(25, 25)">
      <circle cx="15" cy="15" r="12" fill="white" />
      <path d="M15,3 L17,10 L24,10 L18,15 L21,22 L15,18 L9,22 L12,15 L6,10 L13,10 Z" fill="white" />
    </g>
    
    {/* Sun symbol in lower part */}
    <g transform="translate(25, 70)">
      <circle cx="15" cy="15" r="8" fill="white" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 15 + Math.cos(angle) * 10;
        const y1 = 15 + Math.sin(angle) * 10;
        const x2 = 15 + Math.cos(angle) * 16;
        const y2 = 15 + Math.sin(angle) * 16;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" />;
      })}
    </g>
  </motion.svg>
);

// Pride of Nepal section
export const NepalPrideSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative bg-gradient-to-br from-gorkhali-red/20 via-transparent to-peace-blue/20 border border-white/10 rounded-xl p-8 overflow-hidden"
  >
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gorkhali-red rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-peace-blue rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
      {/* Map */}
      <div className="order-2 md:order-1">
        <NepalMap className="max-w-md mx-auto" showProvinces={true} />
      </div>

      {/* Content */}
      <div className="order-1 md:order-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <NepalFlag size={60} />
          <div>
            <h2 className="font-bebas text-4xl text-white tracking-wider" style={{ textShadow: "0 0 30px rgba(220,20,60,0.5)" }}>
              FEDERAL DEMOCRATIC
            </h2>
            <h3 className="font-bebas text-3xl text-marigold tracking-wider">
              REPUBLIC OF NEPAL
            </h3>
          </div>
        </div>
        
        <p className="font-playfair text-gray-300 italic mb-6">
          "जननी जन्मभूमिश्च स्वर्गादपि गरीयसी"
          <br />
          <span className="text-sm text-gray-500">Mother and Motherland are greater than heaven</span>
        </p>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="font-bebas text-3xl text-gorkhali-red">7</p>
            <p className="text-xs text-gray-400 uppercase">Provinces</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="font-bebas text-3xl text-rsp-blue">77</p>
            <p className="text-xs text-gray-400 uppercase">Districts</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="font-bebas text-3xl text-congress-green">275</p>
            <p className="text-xs text-gray-400 uppercase">HoR Seats</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="font-bebas text-3xl text-marigold">753</p>
            <p className="text-xs text-gray-400 uppercase">Local Units</p>
          </div>
        </div>
      </div>
    </div>

    {/* National symbols */}
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-6 text-center">
      <div>
        <span className="text-3xl">🐄</span>
        <p className="text-xs text-gray-400 mt-1">National Animal</p>
      </div>
      <div>
        <span className="text-3xl">🌺</span>
        <p className="text-xs text-gray-400 mt-1">Rhododendron</p>
      </div>
      <div>
        <span className="text-3xl">🏔️</span>
        <p className="text-xs text-gray-400 mt-1">Mt. Everest</p>
      </div>
      <div>
        <span className="text-3xl">🦅</span>
        <p className="text-xs text-gray-400 mt-1">Danphe</p>
      </div>
    </div>
  </motion.div>
);

export default NepalMap;
