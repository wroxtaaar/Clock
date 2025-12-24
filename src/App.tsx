import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Play, Pause } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hours = now.getHours();

      if (hours >= 7 && hours < 24) {
        setIsTimerActive(true);
        const startOfDay = new Date(now);
        startOfDay.setHours(7, 0, 0, 0);
        const elapsedMs = now.getTime() - startOfDay.getTime();
        setTimerSeconds(Math.floor(elapsedMs / 1000));
      } else {
        setIsTimerActive(false);
        setTimerSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours() % 12 || 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextStartTime = () => {
    const now = new Date();
    const next = new Date(now);

    if (now.getHours() >= 7) {
      next.setDate(next.getDate() + 1);
    }
    next.setHours(7, 0, 0, 0);

    const diff = next.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${mins}m`;
  };

  const timerProgress = (timerSeconds / (17 * 3600)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-center mb-8">
            <ClockIcon className="w-8 h-8 text-slate-700 mr-3" />
            <h1 className="text-3xl font-light text-slate-800">Daily Timer Clock</h1>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-8">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="white"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x1 = 100 + 85 * Math.cos(angle);
                  const y1 = 100 + 85 * Math.sin(angle);
                  const x2 = 100 + 75 * Math.cos(angle);
                  const y2 = 100 + 75 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  );
                })}

                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x = 100 + 62 * Math.cos(angle);
                  const y = 100 + 62 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xl font-light fill-slate-700"
                    >
                      {i === 0 ? 12 : i}
                    </text>
                  );
                })}

                <line
                  x1="100"
                  y1="100"
                  x2={100 + 45 * Math.cos(hourAngle * Math.PI / 180)}
                  y2={100 + 45 * Math.sin(hourAngle * Math.PI / 180)}
                  stroke="#1e293b"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                <line
                  x1="100"
                  y1="100"
                  x2={100 + 65 * Math.cos(minuteAngle * Math.PI / 180)}
                  y2={100 + 65 * Math.sin(minuteAngle * Math.PI / 180)}
                  stroke="#334155"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <line
                  x1="100"
                  y1="100"
                  x2={100 + 70 * Math.cos(secondAngle * Math.PI / 180)}
                  y2={100 + 70 * Math.sin(secondAngle * Math.PI / 180)}
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle cx="100" cy="100" r="5" fill="#1e293b" />
              </svg>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200">
                <div className="text-2xl font-light text-slate-800 text-center tabular-nums">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {isTimerActive ? (
                    <Play className="w-5 h-5 text-green-600 mr-2" fill="currentColor" />
                  ) : (
                    <Pause className="w-5 h-5 text-slate-400 mr-2" />
                  )}
                  <span className="text-sm font-medium text-slate-600">
                    {isTimerActive ? 'Timer Active (7 AM - 12 AM)' : 'Timer Inactive'}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {isTimerActive ? '17-Hour Window' : `Starts in ${getNextStartTime()}`}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-medium">ELAPSED TIME</span>
                  <span className="text-xs text-slate-500">{Math.floor(timerProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-linear"
                    style={{ width: `${Math.min(timerProgress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-slate-800 tabular-nums tracking-wider">
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  {isTimerActive ? `${Math.floor((17 * 3600 - timerSeconds) / 3600)}h ${Math.floor(((17 * 3600 - timerSeconds) % 3600) / 60)}m remaining` : 'Waiting for 7:00 AM'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-light text-slate-700">7:00 AM</div>
              <div className="text-xs text-slate-500 mt-1">Start Time</div>
            </div>
            <div>
              <div className="text-2xl font-light text-slate-700">17 Hours</div>
              <div className="text-xs text-slate-500 mt-1">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-light text-slate-700">12:00 AM</div>
              <div className="text-xs text-slate-500 mt-1">End Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
