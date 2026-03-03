"use client";

import { useRef, useEffect, useCallback } from "react";
import { Chart as ChartJS } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { scheduleData } from "../schedule-data";

ChartJS.register(ChartDataLabels);

const INACTIVE_COLOR = "#e2e8f0";
const ACTIVE_BORDER = "#ffffff";
const INACTIVE_BORDER = "#f8fafc";
const ACTIVE_OFFSET = 15;

export interface TimeDoughnutProps {
  activeIndex: number;
  onSegmentClick: (index: number) => void;
  /** 当前时刻在日盘上的角度（度），用于指针指向 */
  currentTimeAngle: number;
}

export default function TimeDoughnut({
  activeIndex,
  onSegmentClick,
  currentTimeAngle,
}: TimeDoughnutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const applyActiveStyle = useCallback((chart: ChartJS<"doughnut">) => {
    const idx = activeIndexRef.current;
    const ds = chart.data.datasets[0];
    if (!ds) return;
    ds.backgroundColor = scheduleData.map(
      (_, i) => (i === idx ? scheduleData[i].colorHex : INACTIVE_COLOR)
    );
    ds.borderColor = scheduleData.map((_, i) =>
      i === idx ? ACTIVE_BORDER : INACTIVE_BORDER
    );
    ds.borderWidth = scheduleData.map((_, i) => (i === idx ? 4 : 1));
    ds.offset = scheduleData.map((_, i) => (i === idx ? ACTIVE_OFFSET : 0));
    chart.update("none");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: scheduleData.map((item) => item.title),
        datasets: [
          {
            data: scheduleData.map((item) => item.duration),
            backgroundColor: scheduleData.map((item) => item.colorHex),
            borderWidth: 1,
            borderColor: INACTIVE_BORDER,
            hoverOffset: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "48%",
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            color: (context) =>
              context.dataIndex === activeIndexRef.current ? "#ffffff" : "#64748b",
            font: { weight: "bold", size: 20 },
            formatter: (value: number, context: { dataIndex: number }) => {
              if (value < 0.6) return "";
              return scheduleData[context.dataIndex].donutTitle;
            },
            opacity: (context) =>
              context.dataIndex === activeIndexRef.current ? 1 : 0.6,
          },
        },
        onClick: (_event, elements) => {
          if (elements.length > 0) {
            onSegmentClick(elements[0].index);
          }
        },
      },
    });

    chartRef.current = chart;
    applyActiveStyle(chart);

    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [onSegmentClick, applyActiveStyle]);

  useEffect(() => {
    if (chartRef.current) applyActiveStyle(chartRef.current);
  }, [activeIndex, applyActiveStyle]);

  // 0° = 7:00 = 晨间在圆环顶部；指针默认向上(12点)，故直接使用 currentTimeAngle
  const handRotation = currentTimeAngle;

  return (
    <div className="relative w-full max-w-[650px] mx-auto aspect-square">
      <canvas
        ref={canvasRef}
        id="timeDoughnut"
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none" style={{ padding: "26%" }}>
        <div
          className="absolute left-1/2 w-1 rounded-full bg-slate-700 shadow-md"
          style={{
            top: "2%",
            marginLeft: "-2px",
            height: "48%",
            transformOrigin: "center 100%",
            transform: `rotate(${handRotation}deg)`,
          }}
        />
      </div>
      <div className="doughnut-center-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center justify-center w-48 h-48 rounded-full bg-white shadow-xl border-4 border-slate-50">
        <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-1">
          Total Waking
        </span>
        <span className="text-4xl font-black text-slate-800 tracking-tighter">
          16.5
          <span className="text-xl text-slate-500 ml-1 font-bold">h</span>
        </span>
        <span className="text-xs text-slate-500 mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full">
          除睡眠外全天候
        </span>
      </div>
    </div>
  );
}
