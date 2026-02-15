import charterLogo from './assets/charter-logo.svg'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />

      <div className="relative text-center px-6">

        {/* Charter Logo */}
        <div className="animate-slideDown delay-100 opacity-0 flex justify-center mb-6">
          <img 
            src={charterLogo} 
            alt="Charter Communications" 
            className="h-24 object-contain"
          />
        </div>

        {/* Animated badge */}
        <div className="animate-slideDown delay-200 opacity-0 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-medium mb-6 tracking-wide uppercase">
          Competitive Intelligence
        </div>

        {/* Main heading with gradient text */}
        <h1 className="animate-slideUp delay-300 opacity-0 text-6xl font-bold mb-4">
          <span className="text-gray-700">Spectrum </span>
          <span className="text-blue-400">Insights</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-slideUp delay-400 opacity-0 text-gray-600 text-2xl mb-2">
          Competitive Intelligence Dashboard
        </p>

        {/* Description */}
        <p className="animate-slideUp delay-500 opacity-0 text-gray-600 text-lg mb-10 max-w-xl mx-auto">
          Visualizing Google Trends data to understand Spectrum's competitive 
          position in broadband, streaming, and mobile markets.
        </p>

        {/* Topic buttons */}
        <div className="animate-slideUp delay-600 opacity-0 flex gap-4 justify-center flex-wrap">

          <div className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
            <span className="text-xl font-semibold">🌐 Broadband Competition</span>
          </div>

          <div className="group bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
            <span className="text-xl font-semibold">📺 Cord Cutting</span>
          </div>

          <div className="group bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105">
            <span className="text-xl font-semibold">📱 Mobile & Bundling</span>
          </div>

        </div>

        {/* Animated pulse dot — live indicator */}
        <div className="animate-fadeIn delay-600 opacity-0 mt-10 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-600 text-base">Live Google Trends Data</span>
        </div>

      </div>
    </div>
  )
}

export default App