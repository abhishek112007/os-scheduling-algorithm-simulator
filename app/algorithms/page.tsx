"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GanttChart from "../(components)/ganttChart";
import SelectAlgorithm from "../(components)/selectAlgorithm";
import ProcessInserter from "../(components)/processInserter";
import InputProcessTable from "../(components)/inputProcessTable";
import OutputProcessTable from "../(components)/outputProcessTable";
import ProcessQueueVisualizer from "../(components)/processQueueVisualizer";
import { algorithmState, lineChartState } from "../(recoil)/store";
import { processesState } from "../(recoil)/store";
import { timeQuantumState } from "../(recoil)/store";
import { currAlgorithmState } from "../(recoil)/store";
import { outputProcessesState } from "../(recoil)/store";
import { ganntChart_processState } from "../(recoil)/store";
import { ganntChart_startTimeState } from "../(recoil)/store";
import { average_turnaround_time } from "../(recoil)/store";
import { average_waiting_time } from "../(recoil)/store";
import { average_response_time } from "../(recoil)/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import LineChart from "../(components)/lineChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Algorithm() {
  const algorithm = useRecoilValue(algorithmState);
  const processes = useRecoilValue(processesState);
  const time_quantum = useRecoilValue(timeQuantumState);
  const currentAlgorithm = useRecoilValue(currAlgorithmState);
  const outputProcesses = useRecoilValue(outputProcessesState);
  const ganttChartProcess = useRecoilValue(ganntChart_processState);
  const ganttChartStartTime = useRecoilValue(ganntChart_startTimeState);
  const avgTurnaroundTime = useRecoilValue(average_turnaround_time);
  const avgWaitingTime = useRecoilValue(average_waiting_time);
  const lineChartData = useRecoilValue(lineChartState);
  const currAlgorithm = useSetRecoilState(currAlgorithmState);
  const setOutputProcessesState = useSetRecoilState(outputProcessesState);
  const setOutputGanntChartProcess = useSetRecoilState(ganntChart_processState);
  const setOutputGanntChartStartTime = useSetRecoilState(
    ganntChart_startTimeState
  );
  const setAverageTurnaroundTime = useSetRecoilState(average_turnaround_time);
  const setAverageWaitingTime = useSetRecoilState(average_waiting_time);
  const setAverageResponseTime = useSetRecoilState(average_response_time);
  const setLineChartState = useSetRecoilState(lineChartState);
  const setProcesses = useSetRecoilState(processesState);
  const setTimeQuantum = useSetRecoilState(timeQuantumState);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetOutputProcesses = useSetRecoilState(outputProcessesState);

  const handleReset = () => {
    setProcesses([]);
    setTimeQuantum(0);
    resetOutputProcesses([]);
    setOutputGanntChartProcess([]);
    setOutputGanntChartStartTime([]);
    setAverageTurnaroundTime(0);
    setAverageWaitingTime(0);
    setAverageResponseTime(0);
    setLineChartState([]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (processes.length === 0) {
      setError("Please add processes before submitting");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let response;
      currAlgorithm(algorithm);

      // fcfs algorithm
      if (algorithm === "fcfs") {
        response = await axios.post("/api/fcfs", {
          n: processes.length,
          processes: processes,
        });
      }
      // sjf non-preemptive algorithm
      else if (algorithm === "sjf_non_preemptive") {
        response = await axios.post("/api/sjf_non_preemptive", {
          n: processes.length,
          processes: processes,
        });
      }
      // sjf preemptive algorithm
      else if (algorithm === "sjf_preemptive") {
        response = await axios.post("/api/sjf_preemptive", {
          n: processes.length,
          processes: processes,
        });
      }
      // priority preemptive algorithm
      else if (algorithm === "priority_preemptive") {
        response = await axios.post("/api/priority_preemptive", {
          n: processes.length,
          processes: processes,
        });
      }
      // priority non-preemptive algorithm
      else if (algorithm === "priority_non_preemptive") {
        response = await axios.post("/api/priority_non_preemptive", {
          n: processes.length,
          processes: processes,
        });
      }
      // round robin algorithm
      else if (algorithm === "round_robin") {
        response = await axios.post("/api/round_robin", {
          time_quantum: time_quantum,
          n: processes.length,
          processes: processes,
        });
      }

      if (response) {
        setOutputProcessesState(
          JSON.parse(response.data.output.process_output)
        );
        setOutputGanntChartProcess(response.data.output.ganntChart_process);
        setOutputGanntChartStartTime(
          response.data.output.ganntChart_startTime
        );
        setAverageTurnaroundTime(
          response.data.output.average_turnaround_time
        );
        setAverageWaitingTime(response.data.output.average_waiting_time);
        setAverageResponseTime(response.data.output.average_response_time);
        
        // Automatically trigger comparison after running the algorithm
        await handleComparison();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to execute algorithm";
      setError(errorMessage);
      console.error("Error running algorithm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparison = async () => {
    // first clear the previous line chart data
    setLineChartState([]);

    if (
      algorithm === "fcfs" ||
      algorithm === "sjf_non_preemptive" ||
      algorithm === "sjf_preemptive" ||
      algorithm === "round_robin"
    ) {
      if (processes.length == 0) {
        alert("Please add processes for comparison!");
      } else {
        try {
          const fcfs_response = await axios.post("/api/fcfs", {
            n: processes.length,
            processes: processes,
          });

          const rr_response = await axios.post("/api/round_robin", {
            time_quantum: time_quantum,
            n: processes.length,
            processes: processes,
          });

          const sjf_np_response = await axios.post("/api/sjf_non_preemptive", {
            n: processes.length,
            processes: processes,
          });

          const sjf_p_response = await axios.post("/api/sjf_preemptive", {
            n: processes.length,
            processes: processes,
          });

          setLineChartState([
            {
              name: "fcfs",
              att: fcfs_response.data.output.average_turnaround_time,
              awt: fcfs_response.data.output.average_waiting_time,
            },
            {
              name: `rr (T=${time_quantum})`,
              att: rr_response.data.output.average_turnaround_time,
              awt: rr_response.data.output.average_waiting_time,
            },
            {
              name: "sjf_np",
              att: sjf_np_response.data.output.average_turnaround_time,
              awt: sjf_np_response.data.output.average_waiting_time,
            },
            {
              name: "sjf_p",
              att: sjf_p_response.data.output.average_turnaround_time,
              awt: sjf_p_response.data.output.average_waiting_time,
            },
          ]);
        } catch (error) {
          console.log(
            "error occured while getting data for line chart: ",
            error
          );
        }
      }
    } else if (
      algorithm === "priority_preemptive" ||
      algorithm === "priority_non_preemptive"
    ) {
      if (processes.length == 0) {
        alert("Please add processes for comparison!");
      } else {
        try {
          const priority_p = await axios.post("/api/priority_preemptive", {
            n: processes.length,
            processes: processes,
          });

          const priority_np = await axios.post("/api/priority_non_preemptive", {
            n: processes.length,
            processes: processes,
          });

          setLineChartState([
            {
              name: "priority_p",
              att: priority_p.data.output.average_turnaround_time,
              awt: priority_p.data.output.average_waiting_time,
            },
            {
              name: "priority_np",
              att: priority_np.data.output.average_turnaround_time,
              awt: priority_np.data.output.average_waiting_time,
            },
          ]);
        } catch (error) {
          console.log(
            "error occured while getting data for line chart: ",
            error
          );
        }
      }
    }
  };

  const getAlgorithmName = (algo: string): string => {
    const algorithmNames: { [key: string]: string } = {
      fcfs: "First-Come, First-Served (FCFS)",
      sjf_non_preemptive: "Shortest Job First (Non-Preemptive)",
      sjf_preemptive: "Shortest Job First (Preemptive / SRTF)",
      priority_preemptive: "Priority Scheduling (Preemptive)",
      priority_non_preemptive: "Priority Scheduling (Non-Preemptive)",
      round_robin: `Round Robin (Time Quantum: ${time_quantum})`,
    };
    return algorithmNames[algo] || algo;
  };

  const handleExportResults = async () => {
    try {
      if (!currentAlgorithm || outputProcesses.length === 0) {
        alert("Please run an algorithm first before exporting results!");
        return;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("CPU Scheduling Results", pageWidth / 2, yPosition, {
        align: "center",
      });

      // Algorithm Name
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Algorithm: ${getAlgorithmName(currentAlgorithm)}`, 15, yPosition);

      // Average Times
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(
        `Average Turnaround Time: ${Number(avgTurnaroundTime).toFixed(2)}`,
        15,
        yPosition
      );
      yPosition += 7;
      pdf.text(`Average Waiting Time: ${Number(avgWaitingTime).toFixed(2)}`, 15, yPosition);

      // Input Process Table
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Input Process Table", 15, yPosition);
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const inputHeaders = ["Process ID", "Arrival Time", "Burst Time"];
      if (processes.length > 0 && "priority" in processes[0]) {
        inputHeaders.push("Priority");
      }

      const inputData = processes.map((process, index) => {
        const row = [
          `P${index + 1}`,
          process.arrival_time.toString(),
          process.burst_time.toString(),
        ];
        if ("priority" in process) {
          row.push(process.priority.toString());
        }
        return row;
      });

      autoTable(pdf, {
        startY: yPosition,
        head: [inputHeaders],
        body: inputData,
        theme: "grid",
        headStyles: { fillColor: [18, 172, 238] },
        margin: { left: 15 },
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Output Process Table
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Output Process Table", 15, yPosition);
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const outputHeaders = [
        "Process ID",
        "Arrival Time",
        "Burst Time",
        "Completion Time",
        "Turnaround Time",
        "Waiting Time",
      ];
      if (outputProcesses.length > 0 && "priority" in outputProcesses[0]) {
        outputHeaders.splice(3, 0, "Priority");
      }

      const outputData = outputProcesses.map((process) => {
        const row = [
          `P${process.process_id}`,
          process.arrival_time.toString(),
          process.burst_time.toString(),
        ];
        if ("priority" in process) {
          row.push(process.priority.toString());
        }
        row.push(
          process.completion_time.toString(),
          process.turnaround_time.toString(),
          process.waiting_time.toString()
        );
        return row;
      });

      autoTable(pdf, {
        startY: yPosition,
        head: [outputHeaders],
        body: outputData,
        theme: "grid",
        headStyles: { fillColor: [93, 244, 136] },
        margin: { left: 15 },
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Capture Gantt Chart
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      const ganttChartElement = document.querySelector(".gantt-chart-container");
      if (ganttChartElement) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Gantt Chart", 15, yPosition);
        yPosition += 7;

        const ganttCanvas = await html2canvas(ganttChartElement as HTMLElement, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        const ganttImgData = ganttCanvas.toDataURL("image/png");
        const ganttImgWidth = pageWidth - 30;
        const ganttImgHeight = (ganttCanvas.height * ganttImgWidth) / ganttCanvas.width;

        if (yPosition + ganttImgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.addImage(ganttImgData, "PNG", 15, yPosition, ganttImgWidth, ganttImgHeight);
        yPosition += ganttImgHeight + 15;
      }

      // Capture Comparison Chart if available
      if (lineChartData.length > 0) {
        const lineChartElement = document.querySelector(".recharts-wrapper");
        if (lineChartElement) {
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Algorithm Comparison Chart", 15, yPosition);
          yPosition += 7;

          const chartCanvas = await html2canvas(
            lineChartElement as HTMLElement,
            {
              scale: 2,
              backgroundColor: "#ffffff",
            }
          );
          const chartImgData = chartCanvas.toDataURL("image/png");
          const chartImgWidth = pageWidth - 30;
          const chartImgHeight =
            (chartCanvas.height * chartImgWidth) / chartCanvas.width;

          if (yPosition + chartImgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.addImage(
            chartImgData,
            "PNG",
            15,
            yPosition,
            chartImgWidth,
            chartImgHeight
          );
        }
      }

      // Save PDF
      const fileName = `CPU_Scheduling_${currentAlgorithm}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);

      alert("Results exported successfully!");
    } catch (error) {
      console.error("Error exporting results:", error);
      alert("Failed to export results. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        <div className="grid grid-cols-12 min-h-screen max-w-[1400px] mx-auto bg-white shadow-2xl overflow-hidden">
          <div className="col-span-12 xl:col-span-4 border-r border-gray-200">
            <div className="pl-5 pt-6 pb-6 bg-gradient-to-r from-indigo-600 to-purple-600 border-b-4 border-indigo-700 shadow-lg">
              <h1 className="lg:text-[24px] xl:text-[28px] font-bold text-white flex items-center gap-2">
                <span className="text-4xl">⚙️</span>
                <span>CPU Scheduling Visualizer</span>
              </h1>
              <p className="text-indigo-100 text-sm mt-2">Interactive process scheduling simulator</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:flex xl:flex-col">
              <div>
                <div>
                  <SelectAlgorithm />
                  <ProcessInserter />
                </div>
                <div className="p-5 space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>▶️</span>
                        <span>Run Algorithm</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleExportResults}
                    disabled={outputProcesses.length === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <span>📥</span>
                    <span>Export Results</span>
                  </button>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-2xl mr-2">⚠️</span>
                        <div>
                          <p className="text-sm font-semibold text-red-800">Error</p>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-10 lg:mb-0">
                <InputProcessTable />
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <OutputProcessTable />
            <br />
            <GanttChart />
            <ProcessQueueVisualizer />
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleComparison}
                  disabled={processes.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <span>📊</span>
                  <span>Compare Similar Algorithms</span>
                  <span>→</span>
                </button>
              </div>
              <div className="mb-44 sm:mb-0">
                <LineChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
