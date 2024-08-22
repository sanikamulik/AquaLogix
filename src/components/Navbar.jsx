
function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between  z-10  backdrop:blur-md bg-opacity-40 text-black  text-base"  style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="text-2xl">
      <span className="text-emerald-600">Aqua</span>
      <span className="text-blue-900">Logix</span> 
      </div>
      <div className="flex space-x-8 mt-1">
        <div className="font-bold">Home</div>
        <div>Vessel Tracking</div>
        <div>Routes</div>
        <div>Weather</div>
        <div>Analytics</div>
      </div>
    </div>
  );
}

export default Navbar;
