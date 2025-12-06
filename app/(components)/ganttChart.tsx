import { ganntChart_processState } from "../(recoil)/store";
import { ganntChart_startTimeState } from "../(recoil)/store";
import { useRecoilValue } from "recoil";
import {motion} from 'framer-motion';

type Process = {
  pid: number;
  time: number;
};

export default function GanttChart() {
  const ganntChartProcesses = useRecoilValue(ganntChart_processState);
  const ganntChartStartTime = useRecoilValue(ganntChart_startTimeState);

  // Beautiful color palette for processes
  const getProcessColor = (pid: number) => {
    const colors = [
      'from-blue-400 to-blue-600',      // P0
      'from-purple-400 to-purple-600',  // P1
      'from-pink-400 to-pink-600',      // P2
      'from-rose-400 to-rose-600',      // P3
      'from-orange-400 to-orange-600',  // P4
      'from-amber-400 to-amber-600',    // P5
      'from-lime-400 to-lime-600',      // P6
      'from-emerald-400 to-emerald-600',// P7
      'from-teal-400 to-teal-600',      // P8
      'from-cyan-400 to-cyan-600',      // P9
      'from-indigo-400 to-indigo-600',  // P10
    ];
    return colors[pid % colors.length];
  };

  if (ganntChartProcesses.length === 0) {
    return (
      <div className="p-5 gantt-chart-container">
        <div className="mb-3">
          <h1 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📊</span> Gantt Chart
          </h1>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <p className="text-gray-500 text-lg">Run an algorithm to see the Gantt Chart visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 gantt-chart-container">
      <div className="mb-4">
        <h1 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📊</span> Gantt Chart
        </h1>
        <p className="text-sm text-gray-600 mt-1">Process execution timeline visualization</p>
      </div>

      <div className="ganntChart overflow-x-auto pb-4">
        <div className="flex min-w-max">
          {/* Start marker */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-20 flex-shrink-0"
          >
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 py-3 px-2 text-center text-sm font-bold text-white border-2 border-gray-800 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-10"></div>
              <p className="relative z-10">START</p>
            </div>
            <p className="text-end font-bold text-lg text-gray-700 mt-1">{ganntChartStartTime}</p>
          </motion.div>

          {/* Process blocks */}
          {ganntChartProcesses.map((item: Process, index) => {
            const isIdle = item.pid === -1;
            return (
              <motion.div
                initial={{
                  opacity: 0,
                  x: 50,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="w-20 flex-shrink-0 ml-1"
                key={index}
              >
                <div className={`
                  ${isIdle 
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 border-gray-400' 
                    : `bg-gradient-to-br ${getProcessColor(item.pid)} text-white border-transparent`
                  }
                  py-4 px-2 text-center text-base font-bold border-2 rounded-lg shadow-lg 
                  relative overflow-hidden transform transition-all duration-300
                  hover:shadow-2xl cursor-pointer
                `}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {isIdle ? (
                      <span className="text-sm uppercase tracking-wider">IDLE</span>
                    ) : (
                      <p className="text-lg">
                        P<sub className="text-xs">{item.pid}</sub>
                      </p>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                    isIdle ? 'bg-gray-400' : 'bg-white opacity-30'
                  }`}></div>
                </div>
                <p className="text-end font-bold text-lg text-gray-700 mt-1">{item.time}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Legend</p>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(ganntChartProcesses.map(p => p.pid))).filter(pid => pid !== -1).map((pid) => (
              <div key={pid} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded bg-gradient-to-br ${getProcessColor(pid)} shadow-md flex items-center justify-center text-white text-xs font-bold`}>
                  P{pid}
                </div>
                <span className="text-sm text-gray-600">Process {pid}</span>
              </div>
            ))}
            {ganntChartProcesses.some(p => p.pid === -1) && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-200 to-gray-300 shadow-md flex items-center justify-center text-gray-600 text-xs font-bold">
                  —
                </div>
                <span className="text-sm text-gray-600">Idle Time</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
