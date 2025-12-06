"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { ganntChart_processState, processesState, currAlgorithmState } from "../(recoil)/store";
import { useState, useEffect } from "react";
import { Cpu, Clock, CheckCircle2, Circle } from "lucide-react";

interface ProcessState {
  pid: number;
  state: "waiting" | "ready" | "running" | "completed";
  remainingTime?: number;
}

interface GanttProcess {
  pid: number;
  time: number;
}

export default function ProcessQueueVisualizer() {
  const ganttChartProcesses = useRecoilValue(ganntChart_processState) as GanttProcess[];
  const inputProcesses = useRecoilValue(processesState);
  const currentAlgorithm = useRecoilValue(currAlgorithmState);
  const [currentTime, setCurrentTime] = useState(0);
  const [processStates, setProcessStates] = useState<ProcessState[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds per step

  // Get process color
  const getProcessColor = (pid: number) => {
    const colors = [
      { bg: "bg-blue-500", border: "border-blue-600", text: "text-blue-900" },
      { bg: "bg-purple-500", border: "border-purple-600", text: "text-purple-900" },
      { bg: "bg-pink-500", border: "border-pink-600", text: "text-pink-900" },
      { bg: "bg-rose-500", border: "border-rose-600", text: "text-rose-900" },
      { bg: "bg-orange-500", border: "border-orange-600", text: "text-orange-900" },
      { bg: "bg-amber-500", border: "border-amber-600", text: "text-amber-900" },
      { bg: "bg-lime-500", border: "border-lime-600", text: "text-lime-900" },
      { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-emerald-900" },
      { bg: "bg-teal-500", border: "border-teal-600", text: "text-teal-900" },
      { bg: "bg-cyan-500", border: "border-cyan-600", text: "text-cyan-900" },
      { bg: "bg-indigo-500", border: "border-indigo-600", text: "text-indigo-900" },
    ];
    return colors[pid % colors.length];
  };

  // Initialize process states when Gantt chart data is available
  useEffect(() => {
    if (ganttChartProcesses.length > 0 && inputProcesses.length > 0) {
      const initialStates: ProcessState[] = inputProcesses.map((_, index) => ({
        pid: index,
        state: "waiting",
        remainingTime: inputProcesses[index].burst_time,
      }));
      setProcessStates(initialStates);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [ganttChartProcesses, inputProcesses]);

  // Animation logic
  useEffect(() => {
    if (!isPlaying || ganttChartProcesses.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTime((prevTime) => {
        const nextTime = prevTime + 1;
        
        // Find which process is running at current time
        let runningPid = -1;
        for (let i = 0; i < ganttChartProcesses.length - 1; i++) {
          const startTime = ganttChartProcesses[i].time;
          const endTime = ganttChartProcesses[i + 1].time;
          if (nextTime > startTime && nextTime <= endTime) {
            runningPid = ganttChartProcesses[i].pid;
            break;
          }
        }

        // Update process states
        const newStates = inputProcesses.map((proc, index) => {
          const arrivalTime = proc.arrival_time || 0;
          
          // Find last time this process ran
          let lastRunTime = -1;
          for (let i = ganttChartProcesses.length - 1; i >= 0; i--) {
            if (ganttChartProcesses[i].pid === index) {
              lastRunTime = ganttChartProcesses[i + 1]?.time || ganttChartProcesses[ganttChartProcesses.length - 1].time;
              break;
            }
          }

          // Determine state
          if (lastRunTime !== -1 && nextTime >= lastRunTime) {
            return { pid: index, state: "completed" as const };
          } else if (index === runningPid) {
            return { pid: index, state: "running" as const };
          } else if (nextTime >= arrivalTime) {
            return { pid: index, state: "ready" as const };
          } else {
            return { pid: index, state: "waiting" as const };
          }
        });

        setProcessStates(newStates);

        // Stop when animation is complete
        const maxTime = ganttChartProcesses[ganttChartProcesses.length - 1]?.time || 0;
        if (nextTime >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }

        return nextTime;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, ganttChartProcesses, inputProcesses]);

  if (ganttChartProcesses.length === 0) {
    return null;
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    const initialStates: ProcessState[] = inputProcesses.map((_, index) => ({
      pid: index,
      state: "waiting",
      remainingTime: inputProcesses[index].burst_time,
    }));
    setProcessStates(initialStates);
  };

  const waitingProcesses = processStates.filter((ps) => ps.state === "waiting");
  const readyProcesses = processStates.filter((ps) => ps.state === "ready");
  const runningProcess = processStates.find((ps) => ps.state === "running");
  const completedProcesses = processStates.filter((ps) => ps.state === "completed");

  return (
    <div className="p-5">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🎬</span> Process State Visualization
        </h2>
        <p className="text-sm text-gray-600 mt-1">Watch processes move through different states</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
            >
              🔄 Reset
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              <span className="text-lg font-bold text-blue-600">Time: {currentTime}</span>
            </div>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value={2000}>0.5x Speed</option>
              <option value={1000}>1x Speed</option>
              <option value={500}>2x Speed</option>
              <option value={250}>4x Speed</option>
            </select>
          </div>
        </div>

        {/* Process Queues */}
        <div className="space-y-6">
          {/* Waiting Queue */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Circle className="text-gray-500" size={20} />
              <h3 className="font-bold text-gray-700">Waiting Queue ({waitingProcesses.length})</h3>
            </div>
            <div className="flex gap-2 flex-wrap min-h-[60px]">
              <AnimatePresence>
                {waitingProcesses.map((ps) => {
                  const color = getProcessColor(ps.pid);
                  return (
                    <motion.div
                      key={`waiting-${ps.pid}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`${color.bg} ${color.border} border-2 rounded-lg p-3 shadow-md flex flex-col items-center justify-center min-w-[70px]`}
                    >
                      <p className="text-white font-bold text-lg">P{ps.pid}</p>
                      <p className="text-white text-xs opacity-90">Waiting</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Ready Queue */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Circle className="text-blue-500" size={20} />
              <h3 className="font-bold text-blue-700">Ready Queue ({readyProcesses.length})</h3>
            </div>
            <div className="flex gap-2 flex-wrap min-h-[60px]">
              <AnimatePresence>
                {readyProcesses.map((ps) => {
                  const color = getProcessColor(ps.pid);
                  return (
                    <motion.div
                      key={`ready-${ps.pid}`}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className={`${color.bg} ${color.border} border-2 rounded-lg p-3 shadow-md flex flex-col items-center justify-center min-w-[70px]`}
                    >
                      <p className="text-white font-bold text-lg">P{ps.pid}</p>
                      <p className="text-white text-xs opacity-90">Ready</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* CPU (Running) */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="text-green-600" size={20} />
              <h3 className="font-bold text-green-700">CPU - Running Process</h3>
            </div>
            <div className="flex gap-2 justify-center min-h-[80px] items-center">
              <AnimatePresence mode="wait">
                {runningProcess ? (
                  <motion.div
                    key={`running-${runningProcess.pid}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1.2, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`${getProcessColor(runningProcess.pid).bg} ${getProcessColor(runningProcess.pid).border} border-4 rounded-xl p-4 shadow-2xl flex flex-col items-center justify-center min-w-[100px] relative`}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2"
                    >
                      <Cpu className="text-green-600" size={24} />
                    </motion.div>
                    <p className="text-white font-bold text-2xl">P{runningProcess.pid}</p>
                    <p className="text-white text-sm opacity-90">Executing...</p>
                  </motion.div>
                ) : (
                  <div className="text-gray-400 text-lg font-semibold">CPU Idle</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed Queue */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <h3 className="font-bold text-green-700">Completed ({completedProcesses.length})</h3>
            </div>
            <div className="flex gap-2 flex-wrap min-h-[60px]">
              <AnimatePresence>
                {completedProcesses.map((ps) => {
                  const color = getProcessColor(ps.pid);
                  return (
                    <motion.div
                      key={`completed-${ps.pid}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`${color.bg} ${color.border} border-2 rounded-lg p-3 shadow-md flex flex-col items-center justify-center min-w-[70px] opacity-60 relative`}
                    >
                      <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
                        <CheckCircle2 className="text-white" size={14} />
                      </div>
                      <p className="text-white font-bold text-lg">P{ps.pid}</p>
                      <p className="text-white text-xs opacity-90">Done</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">States</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-400"></div>
              <span>Waiting (Not Arrived)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-400"></div>
              <span>Ready (In Queue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Running (On CPU)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400 opacity-60"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
