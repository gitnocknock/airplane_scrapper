export default function Home() {
  return (
  <main>
    <div className="bg-cyan-950 h-20 flex justify-between items-center">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent border-2 border-black"> Flight Guard AI</h1>
    </div>

  <div className="bg-blue-950 border-2 border-black h-96 flex flex-col gap-6 p-6 items-center justify-center">

  <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-5 border border-cyan-500/30 flex items-center justify-center">
    <div className="text-white">
      <p className="text-3xl font-bold text-cyan-400">07</p>
      <p className="text-gray-300">Active Agents</p>
    </div>
  </div>

  <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-6 border border-blue-500/30 flex items-center justify-center">
    <div className="text-white">
      <p className="text-3xl font-bold text-blue-400">03</p>
      <p className="text-gray-300">Flights Monitored</p>
    </div>
  </div>

  <div className="bg-cyan-950/80 rounded-lg h-32 w-96 p-5 border border-red-500/30 flex items-center justify-center">
    <div className="text-white">
      <p className="text-3xl font-bold text-red-400">2005</p>
      <p className="text-gray-300">Active Disruptions</p>
    </div> 
  </div>

</div>

  </main>
  )
}




/* colors:
cyan-400: #22D3EE (bright cyan)
blue-400: #60A5FA (lighter blue)
cyan-600: #0891B2 (darker cyan for buttons)
blue-900: #1E3A8A (very dark blue for backgrounds)
*/