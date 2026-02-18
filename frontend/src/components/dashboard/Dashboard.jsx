import { useState, useEffect } from 'react';
import { getTopics, compareTrends } from '../../api/trendsApi';

export default function Dashboard({ topicId, timeframe }) {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicKeywords, setTopicKeywords] = useState([]);

  // Fetch topic keywords when topic changes
  useEffect(() => {
    const fetchTopicKeywords = async () => {
      if (!topicId) return;
      
      try {
        const data = await getTopics();
        const topic = data.topics.find(t => t.id === topicId);
        if (topic) {
          setTopicKeywords(topic.keywords);
        }
      } catch (err) {
        console.error('Failed to load topic keywords:', err);
      }
    };

    fetchTopicKeywords();
  }, [topicId]);

  // Fetch trends data when topic or timeframe changes
  useEffect(() => {
    const fetchTrends = async () => {
      if (!topicId || topicKeywords.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const data = await compareTrends(topicKeywords, timeframe, 'US');
        setTrendsData(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [topicId, timeframe, topicKeywords]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading trends data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading data</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && trendsData && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {topicId?.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')} Trends
            </h2>
            <p className="text-gray-600">
              Analyzing {trendsData.comparisons?.length || 0} keywords over {timeframe}
            </p>
          </div>

          {/* Keywords Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendsData.comparisons?.map((comparison, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{comparison.keyword}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Points:</span>
                    <span className="font-medium">{comparison.interest_over_time?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regions:</span>
                    <span className="font-medium">{comparison.interest_by_region?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Related Queries:</span>
                    <span className="font-medium">{comparison.related_queries?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Raw Data Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
            <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(trendsData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !trendsData && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading data...</p>
        </div>
      )}
    </main>
  );
}