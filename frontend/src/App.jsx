import { useState, useEffect, useRef } from 'react';
import charterLogo from './assets/charter-logo.svg';
import Navigation from './components/common/Navigation';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import NetworkBackground from './components/common/NetworkBackground';
import { NAV_TOPICS } from './data/topics';
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

function App() {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  const logoRef = useRef(null);
  const typingRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);

  // Heading entrance animation
  useEffect(() => {
    const chars = "!@#$%^&*<>[]{}?/~";
    const word1 = "Spectrum ";
    const word2 = "Insights";

    const scramble = (targetId, finalText, delay) => {
      const el = document.getElementById(targetId);
      if (!el) return;

      let iterations = 0;
      const totalIterations = finalText.length * 6;

      setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent = finalText
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < iterations / 2) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          iterations++;
          if (iterations >= totalIterations) {
            el.textContent = finalText;
            clearInterval(interval);
          }
        }, 20);
      }, delay);
    };

    scramble("scramble-text", word1, 400);
    scramble("scramble-insights", word2, 700);
  }, []);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.3, ease: "power1.out" }
    );
  }, []);

  // Logo entrance animation
  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  // Typing animation loop
  useEffect(() => {
    const keywords = ["Broadband Competition", "Cord Cutting", "Mobile & Bundling"];
    const tl = gsap.timeline({ repeat: -1 });

    keywords.forEach((word) => {
      tl.to(typingRef.current, {
        duration: word.length * 0.08,
        text: { value: word, delimiter: "" },
        ease: "none",
      })
      .to(typingRef.current, { duration: 0.8, ease: "none" })
      .to(typingRef.current, {
        duration: word.length * 0.05,
        text: { value: "", delimiter: "" },
        ease: "none",
      })
      .to(typingRef.current, { duration: 0.3, ease: "none" });
    });

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (!selectedKeyword) return;

    const fetchTrends = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://djso3858997b1.cloudfront.net/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: selectedKeyword, timeframe: 'today 12-m', geo: 'US' })
        });
        const data = await response.json();
        setTrendData(data);
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [selectedKeyword]);

  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    setTrendData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navigation
        topics={NAV_TOPICS}
        onKeywordSelect={handleKeywordSelect}
        selectedKeyword={selectedKeyword}
      />

      {selectedKeyword ? (
        <div className="flex">
          <Sidebar
            selectedKeyword={selectedKeyword}
            onKeywordSelect={handleKeywordSelect}
          />
          <div className="flex-1 overflow-auto">
            <Dashboard
              keyword={selectedKeyword}
              trendData={trendData}
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
          <div className="absolute inset-0 bg-gray-100">
            <NetworkBackground />
          </div>
          <div className="relative text-center px-6 w-full max-w-7xl">

            {/* Logo */}
            <div ref={logoRef} className="flex justify-center mb-6" style={{ opacity: 0 }}>
              <img src={charterLogo} alt="Charter Communications" className="h-20 object-contain opacity-80" />
            </div>

            <div ref={badgeRef} className="inline-block bg-blue-600 text-white text-base px-6 py-3 rounded-full font-medium mb-6 tracking-wide uppercase" style={{ opacity: 0 }}>
              Competitive Intelligence Dashboard
            </div>

            <h1 className="text-6xl font-bold mb-4 animate-fadeIn delay-300 opacity-0">
              <span id="scramble-text" className="text-gray-700"></span>
              <span id="scramble-insights" className="text-blue-400"></span>
            </h1>

            <p className="animate-slideUp delay-500 opacity-0 text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Visualizing Google Trends data to understand Spectrum's competitive
              position in broadband, streaming, and mobile markets.
            </p>

            {/* Typing animation - Google Trends style search bar */}
            <div className="animate-fadeIn delay-600 opacity-0 flex items-center gap-4 bg-white rounded-full px-12 py-6 shadow-md w-full max-w-6xl mx-auto mb-10">
              <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0" />
              <div className="flex-1 flex items-center gap-1 text-2xl font-medium text-gray-700 min-h-[2rem]">
                <span ref={typingRef}></span>
                <span className="animate-pulse text-gray-400">|</span>
              </div>
              <button className="bg-blue-600 text-white text-base font-semibold px-8 py-3 rounded-full cursor-default"
                onClick={() => alert('Use the navigation menu above to explore topics!')}
                >
                Explore
              </button>
            </div>

            <div className="animate-fadeIn delay-600 opacity-0 mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-600 text-base">Live Google Trends Data</span>
            </div>

          </div>
        </div>
      )}
      <p className="fixed bottom-4 right-6 text-[20px] text-gray-400">
        All trademarks belong to their respective owners.
      </p>
    </div>
  );
}

export default App;