;

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const rotation = (percentage / 100) * 360;

  return (
    <div className="relative w-12 h-12">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full border-8 border-gray-300"></div>
      
      {/* Left half of progress */}
      <div
        className="absolute inset-0 rounded-full border-8 border-blue-500"
        style={{
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)',
          transform: `rotate(${Math.min(rotation, 180)}deg)`,
        }}
      ></div>

      {/* Right half of progress */}
      {percentage > 50 && (
        <div
          className="absolute inset-0 rounded-full border-8 border-blue-500"
          style={{
            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
            transform: `rotate(${rotation - 180}deg)`,
          }}
        ></div>
      )}

      {/* Inner text */}
      <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-xs font-semibold">
        {percentage}%
      </div>
    </div>
  );
};

export default CircularProgress;
