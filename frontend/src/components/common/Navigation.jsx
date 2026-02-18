import { useState } from 'react';
import charterLogo from '../../assets/charter-logo.svg';

export default function Navigation({ topics = [], activeTopicId, onTopicChange, timeframe, onTimeframeChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const timeframeOptions = [
    { value: 'today 1-m', label: '1 Month' },
    { value: 'today 3-m', label: '3 Months' },
    { value: 'today 12-m', label: '12 Months' },
    { value: 'today 5-y', label: '5 Years' },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 flex items-stretch gap-6 h-16">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                  setShowTooltip(false);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg width="40" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="30" height="2.5" rx="1" fill="#4B5563"/>
                  <rect x="2" y="13" width="30" height="2.5" rx="1" fill="#4B5563"/>
                  <rect x="2" y="21" width="30" height="2.5" rx="1" fill="#4B5563"/>
                </svg>
              </button>

              {/* Tooltip */}
              {showTooltip && !sidebarOpen && (
                <div className="absolute top-14 left-0 bg-gray-600 text-white text-lg px-4 py-2 rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Main Menu
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTopicChange?.(null)}>
              <img src={charterLogo} alt="Charter Communications" className="h-15" />
            </div>
          </div>

          {/* Middle: Topic Tabs */}
          <div className="flex items-center gap-2 flex-1 h-full">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onTopicChange?.(topic.id)}
                className={`px-5 py-4 text-xl font-medium transition-all relative h-full focus:outline-none
                  ${activeTopicId === topic.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {topic.label}
                {activeTopicId === topic.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Timeframe */}
          <select
            value={timeframe}
            onChange={(e) => onTimeframeChange?.(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-full text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - starts below navbar */}
      <div className={`fixed top-[64px] left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Topics</p>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                onTopicChange?.(topic.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-full text-lg font-medium mb-1 transition-all whitespace-nowrap
                ${activeTopicId === topic.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}