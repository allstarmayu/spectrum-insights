import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DROPDOWN_TOPICS, NAV_TOPICS } from '../../data/topics';

export default function Sidebar({ selectedKeyword, onKeywordSelect }) {
  const [openTopic, setOpenTopic] = useState(null);
  const [openSubTopic, setOpenSubTopic] = useState(null);

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 border-r border-gray-200 flex-shrink-0">
      <div className="py-2">

        {NAV_TOPICS.map((topic) => (
          <div key={topic.id}>

            {/* Main Topic */}
            <button
              onClick={() => {
                setOpenTopic(openTopic === topic.id ? null : topic.id);
                setOpenSubTopic(null);
              }}
              className={`w-full flex items-center justify-between px-5 py-4 text-2xl font-semibold transition-all duration-150 ease-in-out relative
                ${openTopic === topic.id ? 'text-blue-600 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {topic.label}
              <ChevronDown
                size={18}
                className={`ml-2 transition-transform duration-200 ease-in-out ${openTopic === topic.id ? 'rotate-180' : ''}`}
              />
              <span className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-150 ease-in-out
                ${openTopic === topic.id ? 'bg-blue-600' : 'bg-transparent'}`}
              />
            </button>

            {/* Subtopics */}
            {openTopic === topic.id && (
              <div className="animate-dropdown">
                {DROPDOWN_TOPICS[topic.id]?.map((sub) => (
                  <div key={sub.id}>

                    {/* Subtopic */}
                    <button
                      onClick={() => setOpenSubTopic(openSubTopic === sub.id ? null : sub.id)}
                      className={`w-full flex items-center justify-between px-6 py-3 text-xl font-medium transition-all duration-150 ease-in-out relative
                        ${openSubTopic === sub.id ? 'text-blue-600 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      {sub.label}
                      {openSubTopic === sub.id
                        ? <ChevronDown size={16} className="ml-2" />
                        : <ChevronRight size={16} className="ml-2" />
                      }
                      <span className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-150 ease-in-out
                        ${openSubTopic === sub.id ? 'bg-blue-600' : 'bg-transparent'}`}
                      />
                    </button>

                    {/* Keywords */}
                    {openSubTopic === sub.id && (
                      <div className="animate-dropdown">
                        {sub.keywords.map((keyword) => (
                          <button
                            key={keyword}
                            onClick={() => onKeywordSelect?.(keyword)}
                            className={`w-full text-left px-8 py-2.5 text-lg transition-all duration-150 ease-in-out
                              ${selectedKeyword === keyword
                                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}