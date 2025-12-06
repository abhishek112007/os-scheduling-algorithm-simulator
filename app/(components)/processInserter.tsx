"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { algorithmState } from "../(recoil)/store";
import { timeQuantumState } from "../(recoil)/store";
import { processesState } from "../(recoil)/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { motion } from "framer-motion";

function ProcessInserter() {
  const algorithm = useRecoilValue(algorithmState);
  const setProccesses = useSetRecoilState(processesState);
  const [timeQuantum, setTimeQuantum] = useRecoilState(timeQuantumState);

  const [arrivalTime, setArrivalTime] = useState(-1);
  const [burstTime, setBurstTime] = useState(-1);
  const [priority, setPriority] = useState(-1);

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
