import { useState, useEffect, useRef } from 'react';
import { Area, AreaChart, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import WordCloud from './WordCloud';

const TIMEFRAMES = [
  { value: 'today 1-m', label: '1M' },
  { value: 'today 3-m', label: '3M' },
  { value: 'today 12-m', label: '12M' },
  { value: 'today 5-y', label: '5Y' },
];

const chartConfig = {
  value: {
    label: 'Search Interest',
    color: '#2563eb',
  },
};

export default function Dashboard({ keyword }) {
  const [activeTimeframe, setActiveTimeframe] = useState('today 12-m');
  const [allData, setAllData] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const cache = useRef({});
  const fetching = useRef({});

  useEffect(() => {
    if (!keyword) return;
    const cacheKey = `${keyword}-${activeTimeframe}`;

    if (cache.current[cacheKey]) {
      setAllData(cache.current[cacheKey]);
      return;
    }

    if (fetching.current[cacheKey]) return;
    fetching.current[cacheKey] = true;

    setAllData(null);
    const fetchAll = async () => {
      setAllLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, timeframe: activeTimeframe, geo: 'US' })
        });
        const data = await res.json();
        cache.current[cacheKey] = data;
        setAllData(data);
      } catch (err) {
        console.error('Failed to fetch trends data:', err);
      } finally {
        setAllLoading(false);
        fetching.current[cacheKey] = false;
      }
    };
    fetchAll();
  }, [keyword, activeTimeframe]);

  const chartData = allData?.interest_over_time?.map(d => ({
    date: d.date.replace(' ', 'T'),
    value: d.value,
  })) || [];

  const regionData = allData?.interest_by_region || [];
  const relatedQueries = allData?.related_queries || [];
  const risingQueries = allData?.rising_queries || [];

  return (
    <main className="w-full px-6 py-8 space-y-6">

      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Search Interest
            </p>
            <CardTitle className="text-4xl font-bold tracking-tight">{keyword}</CardTitle>

            {/* Stat Badges */}
            {chartData.length > 0 && (() => {
              const values = chartData.map(d => d.value);
              const peak = Math.max(...values);
              const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
              const current = values[values.length - 1];
              return (
                <div className="flex gap-3 mt-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-center">
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-medium">Peak</p>
                    <p className="text-2xl font-bold text-blue-600">{peak}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Average</p>
                    <p className="text-2xl font-bold text-gray-700">{average}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-center">
                    <p className="text-xs text-green-400 uppercase tracking-widest font-medium">Current</p>
                    <p className="text-2xl font-bold text-green-600">{current}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.value}
                onClick={() => setActiveTimeframe(tf.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                  ${activeTimeframe === tf.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Search Interest Over Time</CardTitle>
          <CardDescription>
            {chartData.length > 0
              ? `${chartData[0].date.slice(0, 10)} — ${chartData[chartData.length - 1].date.slice(0, 10)}`
              : 'Loading...'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          {allLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                <p className="mt-4 text-muted-foreground">Loading trends data...</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  minTickGap={50}
                  tickFormatter={(date) => date.slice(0, 7)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  width={35}
                />
                <ChartTooltip
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => label.slice(0, 10)}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Interest by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Interest by Region</CardTitle>
          <CardDescription>Top states by search interest</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          {allLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                <p className="mt-4 text-muted-foreground">Loading region data...</p>
              </div>
            </div>
          ) : regionData?.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[500px] w-full">
              <BarChart data={regionData} margin={{ top: 0, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  type="category"
                  dataKey="region"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }}
                />
                <YAxis
                  type="number"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={35}
                />
                <ChartTooltip
                  cursor={{ fill: '#f0f0f0' }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => label}
                      indicator="dot"
                    />
                  }
                />
                <Bar dataKey="value" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No region data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Word Clouds */}
      {allLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
              <p className="mt-4 text-muted-foreground">Loading queries data...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedQueries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Queries</CardTitle>
                <CardDescription>Top searches associated with {keyword}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WordCloud words={relatedQueries} color="#2563eb" />
              </CardContent>
            </Card>
          )}
          {risingQueries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Rising Queries</CardTitle>
                <CardDescription>Breakout searches trending upward</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WordCloud words={risingQueries} color="#16a34a" />
              </CardContent>
            </Card>
          )}
        </div>
      )}

    </main>
  );
}