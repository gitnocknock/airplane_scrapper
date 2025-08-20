export default function Home() {
  return (
  <main>
    <div className="bg-cyan-950 h-20 flex justify-between items-center">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent pl-10"> Flight Guard AI</h1>
    </div>

  <div className="bg-blue-950 border-2 border-black h-max flex flex-col gap-6 p-6 items-center justify-center">

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

<div className="grid grid-cols-3 gap-0 h-screen">
  <div className="bg-gray-800 w-full h-full border-r border-gray-700">
    <div className="flex justify-between pb-10 px-10">
    <h1 className="text-cyan-400 text-2xl font-bold pl-3 pt-2">AI Agents</h1>
   <div className="bg-cyan-400 w-32 h-16 rounded-lg font-bold text-white text-xl flex items-center justify-center">
  Deploy New
  </div> 
  
  </div>
  <div className="grid grid-rows-3 gap-3 place-items-center">
     <div className="bg-gray-700 w-40 h-32 rounded-lg border border-gray-600 text-white font-bold p-4 text-center">
      Ayusma
     </div>
      <div className="bg-gray-700 w-40 h-32 rounded-lg border border-gray-600 text-white font-bold p-4 text-center">
      Chakre
     </div>
      <div className="bg-gray-700 w-40 h-32 rounded-lg border border-gray-600 text-white font-bold p-4 text-center">
      I LOVE YOU
      </div>
    </div>
  </div>

<div className="bg-gray-900 w-full h-full">
  <div className="grid grid-rows-2 gap-5 place-items-center pt-5">
    <div className="bg-cyan-950/50 h-96 w-70 rounded-lg border border-gray-700">
    <h1 className="text-white text-2xl font-bold pl-3 pt-2 pb-5 text-center">Live Flight Map</h1>
  </div>
  <div className="bg-cyan-950/50 h-96 w-70 rounded-lg border border-gray-700">
    <h1 className="text-white text-2xl font-bold pl-3 pt-2 pb-5 text-center">Agent Activity Feed</h1>
  </div>
  </div>
</div>

<div className="bg-gray-800 w-full h-full border-l border-gray-700">
  <h1 className="text-cyan-400 text-2xl font-bold pl-3 pt-2 pb-5">Smart Insights</h1>
    <div className="grid grid-rows-3 gap-3 place-items-center">
      <div className="bg-gray-700 w-40 h-32 rounded-lg border border-blue-500/30 text-blue-400 font-bold p-4 text-center">
        Ayusma
      </div>
      <div className="bg-gray-700 w-40 h-32 rounded-lg border border-cyan-500/30 text-cyan-400 p-4 text-center">
      Chakre
      </div>
  <div className="bg-gray-700 w-40 h-32 rounded-lg border border-purple-500/30 text-purple-400 p-4 text-center">
    I LOVE YOU
    </div>
  </div>
</div>

</div>




  </main>
  )
}


// fix line 37 formatting later
// make deply new a button later as well so it'll deploy a new agent to track disruption 



/* colors:
cyan-400: #22D3EE (bright cyan)
blue-400: #60A5FA (lighter blue)
cyan-600: #0891B2 (darker cyan for buttons)
blue-900: #1E3A8A (very dark blue for backgrounds)
*/