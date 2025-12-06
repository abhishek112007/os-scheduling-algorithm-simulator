"use client";
import React from "react";
import { algorithmState } from "../(recoil)/store";
import { processesState } from "../(recoil)/store";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

function InputProcessTable() {
  const algorithm = useRecoilValue(algorithmState);
  const [processes, setProcesses] = useRecoilState(processesState);

  const handleRemoveProcess = (index: number) => {
    setProcesses((prevProcesses) => [
      ...prevProcesses.slice(0, index),
      ...prevProcesses.slice(index + 1),
    ]);
  };

  if (processes.length === 0) {
    return (
      <div className="pt-5 px-5">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 border-2 border-dashed border-green-200 rounded-xl text-center shadow-sm">
          <div className="text-6xl mb-4">➕</div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Input Process Table</p>
          <p className="text-gray-600 text-sm">Add processes using the form above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 px-5">
      <div className="mb-4">
        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📝</span> Input Processes
        </h3>
        <p className="text-sm text-gray-600 mt-1">{processes.length} process{processes.length !== 1 ? 'es' : ''} added</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gradient-to-r from-green-500 to-emerald-600">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white font-bold">Process ID</TableHead>
              <TableHead className="text-white font-bold">Arrival Time</TableHead>
              <TableHead className="text-white font-bold">Burst Time</TableHead>
              {algorithm === "priority_preemptive" ||
              algorithm === "priority_non_preemptive" ? (
                <TableHead className="text-white font-bold">Priority</TableHead>
              ) : null}
              <TableHead className="text-white font-bold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process, index) => (
              <TableRow 
                key={index}
                className="hover:bg-green-50 transition-colors duration-200"
              >
                <TableCell className="font-bold text-green-600">P{index}</TableCell>
                <TableCell className="font-medium">{process.arrival_time}</TableCell>
                <TableCell className="font-medium">{process.burst_time}</TableCell>
                {algorithm === "priority_preemptive" ||
                algorithm === "priority_non_preemptive" ? (
                  //@ts-ignore
                  <TableCell className="font-semibold text-purple-600">{process.priority}</TableCell>
                ) : null}
                <TableCell className="text-center">
                  <button
                    onClick={() => handleRemoveProcess(index)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default InputProcessTable;
