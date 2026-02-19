import { useState, useEffect } from 'react';
import charterLogo from './assets/charter-logo.svg';
import Navigation from './components/common/Navigation';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import { NAV_TOPICS } from './data/topics';

function App() {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedKeyword) return;

    const fetchTrends = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/trends', {
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
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
          <div className="relative text-center px-6">

            <div className="animate-slideDown delay-100 opacity-0 flex justify-center mb-6">
              <img src={charterLogo} alt="Charter Communications" className="h-24 object-contain opacity-80" />
            </div>

            <div className="animate-slideDown delay-200 opacity-0 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-medium mb-6 tracking-wide uppercase">
              Competitive Intelligence
            </div>

            <h1 className="animate-slideUp delay-300 opacity-0 text-6xl font-bold mb-4">
              <span className="text-gray-700">Spectrum </span>
              <span className="text-blue-400">Insights</span>
            </h1>

            <p className="animate-slideUp delay-400 opacity-0 text-gray-600 text-2xl mb-2">
              Competitive Intelligence Dashboard
            </p>

            <p className="animate-slideUp delay-500 opacity-0 text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Visualizing Google Trends data to understand Spectrum's competitive
              position in broadband, streaming, and mobile markets.
            </p>

            <div className="animate-slideUp delay-600 opacity-0 flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleKeywordSelect('Spectrum Internet')}
                className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                <span className="text-xl font-semibold">🌐 Broadband Competition</span>
              </button>
              <button
                onClick={() => handleKeywordSelect('cancel cable')}
                className="group bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                <span className="text-xl font-semibold">📺 Cord Cutting</span>
              </button>
              <button
                onClick={() => handleKeywordSelect('Spectrum Mobile')}
                className="group bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105">
                <span className="text-xl font-semibold">📱 Mobile & Bundling</span>
              </button>
            </div>

            <div className="animate-fadeIn delay-600 opacity-0 mt-10 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-600 text-base">Live Google Trends Data</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;