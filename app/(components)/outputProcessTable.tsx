"use client";
import React from "react";
import { currAlgorithmState } from "../(recoil)/store";
import { outputProcessesState } from "../(recoil)/store";
import { average_waiting_time } from "../(recoil)/store";
import { average_turnaround_time } from "../(recoil)/store";
import { average_response_time } from "../(recoil)/store";
import { useRecoilValue } from "recoil";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function OutputProcessTable() {
  const currAlgorithm = useRecoilValue(currAlgorithmState);
  const processes = useRecoilValue(outputProcessesState);
  const averageTurnaroundTime = useRecoilValue(average_turnaround_time);
  const averageWaitingTime = useRecoilValue(average_waiting_time);
  const averageResponseTime = useRecoilValue(average_response_time);

  if (processes.length === 0) {
    return (
      <div className="pt-5 px-5">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 border-2 border-dashed border-purple-200 rounded-xl text-center shadow-sm">
          <div className="text-6xl mb-4">⏱️</div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Output Process Table</p>
          <p className="text-gray-600 text-sm">Execute an algorithm to see detailed process metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 px-5">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
          <span className="text-3xl">�</span> Output Process Table
        </h2>
        <p className="text-sm text-gray-600 mt-1">Detailed scheduling results and metrics</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white font-bold">Process ID</TableHead>
              <TableHead className="text-white font-bold">Arrival Time</TableHead>
              <TableHead className="text-white font-bold">Burst Time</TableHead>
              {currAlgorithm === "priority_preemptive" ||
              currAlgorithm === "priority_non_preemptive" ? (
                <TableHead className="text-white font-bold">Priority</TableHead>
              ) : null}
              <TableHead className="text-white font-bold">Completion Time</TableHead>
              <TableHead className="text-white font-bold">Turnaround Time</TableHead>
              <TableHead className="text-white font-bold">Waiting Time</TableHead>
              <TableHead className="text-white font-bold">Response Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process, index) => (
              <TableRow 
                key={index}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <TableCell className="font-bold text-indigo-600">P{process.process_id}</TableCell>
                <TableCell>{process.arrival_time}</TableCell>
                <TableCell>{process.burst_time}</TableCell>
                {currAlgorithm === "priority_preemptive" ||
                currAlgorithm === "priority_non_preemptive" ? (
                  //@ts-ignore
                  <TableCell className="font-semibold text-purple-600">{process.priority}</TableCell>
                ) : null}
                <TableCell className="font-semibold">{process.completion_time}</TableCell>
                <TableCell className="font-semibold text-blue-600">{process.turnaround_time}</TableCell>
                <TableCell className="font-semibold text-green-600">{process.waiting_time}</TableCell>
                <TableCell className="font-semibold text-orange-600">{process.response_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 uppercase tracking-wide mb-1">Average Turnaround Time</p>
              <p className="text-4xl font-bold">{Number(averageTurnaroundTime).toFixed(2)}</p>
              <p className="text-xs opacity-80 mt-1">time units</p>
            </div>
            <div className="text-6xl opacity-20">⏱️</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 uppercase tracking-wide mb-1">Average Waiting Time</p>
              <p className="text-4xl font-bold">{Number(averageWaitingTime).toFixed(2)}</p>
              <p className="text-xs opacity-80 mt-1">time units</p>
            </div>
            <div className="text-6xl opacity-20">⏳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 uppercase tracking-wide mb-1">Average Response Time</p>
              <p className="text-4xl font-bold">{Number(averageResponseTime).toFixed(2)}</p>
              <p className="text-xs opacity-80 mt-1">time units</p>
            </div>
            <div className="text-6xl opacity-20">⚡</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputProcessTable;
