import React from 'react';

const MoodCalendar = () => {
  // Generate sample data for demonstration
  const generateSampleData = () => {
    const colors = ['bg-amber-100', 'bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-rose-100'];
    return Array(52).fill(null).map(() => 
      Array(7).fill(null).map(() => 
        Math.random() > 0.3 ? colors[Math.floor(Math.random() * colors.length)] : 'bg-gray-100'
      )
    );
  };

  const data = generateSampleData();

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
      <div className="flex gap-1">
        {data.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3 rounded-sm ${day} transition-colors duration-200 hover:opacity-75`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-green-800/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-100" />
          <span>Joy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-100" />
          <span>Peace</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-100" />
          <span>Focus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-purple-100" />
          <span>Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-100" />
          <span>Love</span>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar; 