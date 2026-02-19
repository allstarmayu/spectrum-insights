import { useState, useEffect, useRef } from 'react';
import spectrumLogo from '../../assets/spectrum-logo.svg';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DROPDOWN_TOPICS } from '../../data/topics';

export default function Navigation({ topics = [], activeTopicId, onTopicChange, onKeywordSelect, selectedKeyword }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [pinnedDropdown, setPinnedDropdown] = useState(null);
  const [pinnedSubDropdown, setPinnedSubDropdown] = useState(null);
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const subCloseTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setPinnedDropdown(null);
        setOpenDropdown(null);
        setOpenSubDropdown(null);
        setPinnedSubDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={navRef}>
      {/* Navigation Bar */}
      <nav className="bg-gray-100 border-b border-gray-200 sticky top-0 z-50 animate-slideDown">
        <div className="px-4 flex items-stretch gap-6 h-16">

          {/* Left: Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <img src={spectrumLogo} alt="Spectrum Insights svg" className="h-9 object-contain opacity-80" />
            </div>
          </div>

          {/* Right: Topic Tabs - hidden on dashboard */}
          {!selectedKeyword && (
            <div className="flex items-center gap-2 ml-auto h-full">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onMouseEnter={() => {
                    clearTimeout(closeTimer.current);
                    setOpenDropdown(topic.id);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setOpenDropdown(pinnedDropdown), 100);
                  }}
                  onClick={() => {
                    const newPinned = pinnedDropdown === topic.id ? null : topic.id;
                    setPinnedDropdown(newPinned);
                    setOpenDropdown(newPinned);
                  }}
                  className={`group flex items-center px-5 py-4 text-2xl font-semibold text-gray-600 transition-all duration-150 ease-in-out relative h-full focus:outline-none
                    ${activeTopicId === topic.id || openDropdown === topic.id
                      ? 'text-blue-600'
                      : 'hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {topic.label}
                  <ChevronDown
                    size={18}
                    className={`ml-2 transition-transform duration-200 ease-in-out ${openDropdown === topic.id ? 'rotate-180' : ''}`}
                  />
                  <span className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-150 ease-in-out
                    ${activeTopicId === topic.id || openDropdown === topic.id ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      </nav>

      {/* Dropdown Panel */}
      {openDropdown && !selectedKeyword && (
        <div
          onMouseEnter={() => {
            clearTimeout(closeTimer.current);
            setOpenDropdown(openDropdown);
          }}
          onMouseLeave={() => {
            closeTimer.current = setTimeout(() => setOpenDropdown(pinnedDropdown), 100);
          }}
          className="fixed top-[64px] left-0 right-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 border-b border-gray-200 shadow-lg z-40 transition-all duration-200 ease-in-out animate-dropdown"
        >
          <div className="px-4 flex items-stretch h-12">
            {DROPDOWN_TOPICS[openDropdown]?.map((topic) => (
              <button
                key={topic.id}
                onMouseEnter={() => {
                  clearTimeout(subCloseTimer.current);
                  setOpenSubDropdown(topic.id);
                }}
                onMouseLeave={() => {
                  subCloseTimer.current = setTimeout(() => setOpenSubDropdown(pinnedSubDropdown), 100);
                }}
                onClick={() => {
                  const newPinned = pinnedSubDropdown === topic.id ? null : topic.id;
                  setPinnedSubDropdown(newPinned);
                  setOpenSubDropdown(newPinned);
                }}
                className="group relative flex-1 flex items-center justify-center text-2xl text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 ease-in-out h-full"
              >
                {topic.label}
                {openSubDropdown === topic.id
                  ? <ChevronDown size={18} className="ml-2 transition-transform duration-200 ease-in-out" />
                  : <ChevronRight size={18} className="ml-2 transition-transform duration-200 ease-in-out" />
                }
                <span className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-150 ease-in-out
                  ${openSubDropdown === topic.id ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-300'}`}
                />

                {/* Keywords inline */}
                {openSubDropdown === topic.id && (
                  <div
                    onMouseEnter={() => clearTimeout(subCloseTimer.current)}
                    onMouseLeave={() => {
                      subCloseTimer.current = setTimeout(() => setOpenSubDropdown(pinnedSubDropdown), 100);
                    }}
                    className="absolute top-full left-0 w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 border-b border-gray-200 shadow-lg z-50 animate-dropdown"
                  >
                    {topic.keywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={(e) => {
                          e.stopPropagation();
                          onKeywordSelect?.(keyword);
                          setPinnedDropdown(null);
                          setOpenDropdown(null);
                          setOpenSubDropdown(null);
                          setPinnedSubDropdown(null);
                        }}
                        className="w-full flex items-center px-4 py-2 text-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 ease-in-out text-left"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}