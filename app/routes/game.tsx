export const meta = () => {
  return [{ title: "Game - Catalyst" }];
};

const GamePage = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-between p-8" style={{ backgroundColor: '#232029' }}>
      <div className="flex justify-center gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="w-24 h-36 bg-blue-600 rounded-lg border-2 border-blue-800 shadow-lg"
          />
        ))}
      </div>

      <div className="flex justify-center">
        <div className="w-24 h-36 bg-gray-200 rounded-lg border-2 border-gray-400 shadow-lg flex items-center justify-center">
          <span className="text-gray-600 font-bold">Défausse</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="w-24 h-36 bg-red-600 rounded-lg border-2 border-red-800 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
