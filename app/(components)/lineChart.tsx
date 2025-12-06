"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRecoilValue } from "recoil";
import { lineChartState } from "../(recoil)/store";

const config = {
  att: { label: "Avg Turnaround Time", color: "#4F46E5" },
  awt: { label: "Avg Waiting Time", color: "#E53E3E" },
};

export default function LineChartComponent() {
  const data = useRecoilValue(lineChartState);

  if (data.length === 0) {
    return (
      <div className="max-w-xl h-[350px] mx-auto pt-10">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border-2 border-dashed border-indigo-200 rounded-xl text-center shadow-sm">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Algorithm Comparison</p>
          <p className="text-gray-600 text-sm">Click "Compare similar algorithms" to see performance comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📈</span> Algorithm Comparison
        </h2>
        <p className="text-sm text-gray-600 mt-1">Compare average turnaround and waiting times</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <ChartContainer config={config} className="w-full">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} className="p-2">
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorAwt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E53E3E" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  dy={15} 
                  tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 500 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  label={{
                    value: "Time (units)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 13, fill: '#4b5563', fontWeight: 500 }
                  }}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#9ca3af"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="att"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ 
                    r: 6, 
                    fill: '#4F46E5',
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  activeDot={{ 
                    r: 8,
                    fill: '#4F46E5',
                    strokeWidth: 3,
                    stroke: '#fff'
                  }}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line
                  type="monotone"
                  dataKey="awt"
                  stroke="#E53E3E"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ 
                    r: 6, 
                    fill: '#E53E3E',
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  activeDot={{ 
                    r: 8,
                    fill: '#E53E3E',
                    strokeWidth: 3,
                    stroke: '#fff'
                  }}
                  animationDuration={1500}
                  animationBegin={200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
