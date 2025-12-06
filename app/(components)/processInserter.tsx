"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { algorithmState } from "../(recoil)/store";
import { timeQuantumState } from "../(recoil)/store";
import { processesState } from "../(recoil)/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Sample test cases for each algorithm
const sampleTestCases: Record<string, any[]> = {
  fcfs: [
    { arrival_time: 0, burst_time: 5 },
    { arrival_time: 1, burst_time: 3 },
    { arrival_time: 2, burst_time: 8 },
    { arrival_time: 3, burst_time: 6 },
    { arrival_time: 4, burst_time: 4 }
  ],
  sjf_non_preemptive: [
    { arrival_time: 0, burst_time: 7 },
    { arrival_time: 2, burst_time: 4 },
    { arrival_time: 4, burst_time: 1 },
    { arrival_time: 5, burst_time: 4 },
    { arrival_time: 7, burst_time: 3 }
  ],
  sjf_preemptive: [
    { arrival_time: 0, burst_time: 8 },
    { arrival_time: 1, burst_time: 4 },
    { arrival_time: 2, burst_time: 9 },
    { arrival_time: 3, burst_time: 5 },
    { arrival_time: 4, burst_time: 2 }
  ],
  priority_non_preemptive: [
    { arrival_time: 0, burst_time: 4, priority: 2 },
    { arrival_time: 1, burst_time: 3, priority: 1 },
    { arrival_time: 2, burst_time: 5, priority: 4 },
    { arrival_time: 3, burst_time: 2, priority: 3 },
    { arrival_time: 4, burst_time: 6, priority: 5 }
  ],
  priority_preemptive: [
    { arrival_time: 0, burst_time: 6, priority: 3 },
    { arrival_time: 1, burst_time: 4, priority: 1 },
    { arrival_time: 2, burst_time: 2, priority: 2 },
    { arrival_time: 3, burst_time: 5, priority: 4 },
    { arrival_time: 4, burst_time: 3, priority: 5 }
  ],
  round_robin: [
    { arrival_time: 0, burst_time: 10 },
    { arrival_time: 1, burst_time: 5 },
    { arrival_time: 2, burst_time: 8 },
    { arrival_time: 3, burst_time: 6 },
    { arrival_time: 4, burst_time: 3 }
  ]
};

function ProcessInserter() {
  const algorithm = useRecoilValue(algorithmState);
  const setProccesses = useSetRecoilState(processesState);
  const [timeQuantum, setTimeQuantum] = useRecoilState(timeQuantumState);

  const [arrivalTime, setArrivalTime] = useState(-1);
  const [burstTime, setBurstTime] = useState(-1);
  const [priority, setPriority] = useState(-1);

  const handleLoadSample = () => {
    if (!algorithm) {
      alert("Please select an algorithm first");
      return;
    }
    
    const sampleData = sampleTestCases[algorithm];
    if (sampleData) {
      setProccesses(sampleData);
      
      // Set default time quantum for Round Robin
      if (algorithm === "round_robin" && timeQuantum === 0) {
        setTimeQuantum(2);
      }
    }
  };

  const handleAddProcess = () => {
    if (!algorithm) {
      alert("Select an algorithm");
    } else if (
      algorithm === "priority_preemptive" ||
      algorithm === "priority_non_preemptive"
    ) {
      if (arrivalTime >= 0 && burstTime > 0 && priority >= 0) {
        setProccesses((prev) => {
          return [
            ...prev,
            {
              arrival_time: arrivalTime,
              burst_time: burstTime,
              priority: priority,
            },
          ];
        });
        setArrivalTime(-1);
        setBurstTime(-1);
        setPriority(-1);
      } else {
        alert("Please fill all fields with valid values (non-negative)");
      }
    } else {
      if (arrivalTime >= 0 && burstTime > 0) {
        setProccesses((prev) => {
          return [
            ...prev,
            { arrival_time: arrivalTime, burst_time: burstTime },
          ];
        });
        setArrivalTime(-1);
        setBurstTime(-1);
      } else {
        alert("Please fill all fields with valid values (non-negative)");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProcess();
    }
  };

  return (
    <div>
      {/* Load Sample Button */}
      <div className="pl-5 pt-5">
        <Button 
          onClick={handleLoadSample}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          disabled={!algorithm}
        >
          <Sparkles size={18} />
          Load Sample Test Case (5 Processes)
        </Button>
        {!algorithm && (
          <p className="text-xs text-gray-500 mt-1 text-center">Select an algorithm first</p>
        )}
      </div>

      <div className="process_inserter_container pl-5 pt-5">
        <div className="arrival_burst_time_container">
          <div>
            <label htmlFor="arrival time" className="font-semibold">
              Arrival Time
            </label>
            <Input
              type="number"
              placeholder="AT"
              className="max-w-24"
              min={0}
              value={arrivalTime == -1 ? "" : arrivalTime}
              onChange={(e) => setArrivalTime(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label htmlFor="burst time" className="font-semibold">
              Burst Time
            </label>
            <Input
              type="number"
              placeholder="BT"
              className="max-w-24"
              min={0}
              value={burstTime == -1 ? "" : burstTime}
              onChange={(e) => setBurstTime(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="flex justify-center items-end gap-5">
          {algorithm === "priority_preemptive" ||
          algorithm === "priority_non_preemptive" ? (
            <div className="priority_container">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <label htmlFor="priority" className="font-semibold">
                  Priority
                </label>
                <Input
                  type="number"
                  placeholder="Priority"
                  className="max-w-24 "
                  min={0}
                  value={priority == -1 ? "" : priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
              </motion.div>
            </div>
          ) : (
            ""
          )}

          <div className="add_process_container">
            <Button className="add_process_btn" onClick={handleAddProcess}>
              Add
            </Button>
          </div>
        </div>
      </div>
      
      {algorithm === "round_robin" ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="pl-5 pt-5"
        >
          <label htmlFor="time_quantum" className="font-semibold">
            Time Quantum
          </label>
          <Input
            type="number"
            placeholder="TQ"
            className="max-w-28"
            value={timeQuantum}
            min={0}
            onChange={(e) => setTimeQuantum(Number(e.target.value))}
          />
        </motion.div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProcessInserter;
