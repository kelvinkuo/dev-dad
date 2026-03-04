"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Chart as ChartJS } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { scheduleData } from "../schedule-data";

ChartJS.register(ChartDataLabels);

const UPCOMING_COLOR = "#e8edf2";
const ACTIVE_BORDER = "#ffffff";
const INACTIVE_BORDER = "#f0f4f8";
const ACTIVE_OFFSET = 15;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface TimeDoughnutProps {
  activeIndex: number;
  /** 当前实际进行中的时间块索引（与 activeIndex 可能不同，用户可手动选择其他块） */
  currentBlockIndex: number;
  onSegmentClick: (index: number) => void;
  /** 当前时刻在日盘上的角度（度），用于指针指向 */
  currentTimeAngle: number;
}

export default function TimeDoughnut({
  activeIndex,
  currentBlockIndex,
  onSegmentClick,
  currentTimeAngle,
}: TimeDoughnutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const currentBlockIndexRef = useRef(currentBlockIndex);
  const [chartGeometry, setChartGeometry] = useState<{
    cx: number;
    cy: number;
    outerRadius: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    currentBlockIndexRef.current = currentBlockIndex;
  }, [currentBlockIndex]);

  const syncChartGeometry = useCallback(() => {
    const chart = chartRef.current;
    if (!chart?.chartArea) return;
    const meta = chart.getDatasetMeta(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstArc = meta?.data?.[0] as any;
    if (!firstArc) return;
    const cx = (chart.chartArea.left + chart.chartArea.right) / 2;
    const cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;
    setChartGeometry({
      cx,
      cy,
      outerRadius: firstArc.outerRadius as number,
      width: chart.width,
      height: chart.height,
    });
  }, []);

  const applyActiveStyle = useCallback((chart: ChartJS<"doughnut">) => {
    const idx = activeIndexRef.current;
    const cur = currentBlockIndexRef.current;
    const ds = chart.data.datasets[0];
    if (!ds) return;
    ds.backgroundColor = scheduleData.map((item, i) => {
      if (i === idx) return item.colorHex;
      if (i < cur) return hexToRgba(item.colorHex, 0.22); // 已完成：淡色印记
      return UPCOMING_COLOR; // 未开始：中性灰
    });
    ds.borderColor = scheduleData.map((item, i) => {
      if (i === idx) return ACTIVE_BORDER;
      if (i < cur) return hexToRgba(item.colorHex, 0.15);
      return INACTIVE_BORDER;
    });
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
        layout: { padding: 0 },
        cutout: "48%",
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            color: (context) => {
              const i = context.dataIndex;
              if (i === activeIndexRef.current) return "#ffffff";
              if (i < currentBlockIndexRef.current) return scheduleData[i].colorHex;
              return "#94a3b8";
            },
            font: { weight: "bold", size: 20 },
            formatter: (value: number, context: { dataIndex: number }) => {
              if (value < 0.6) return "";
              return scheduleData[context.dataIndex].donutTitle;
            },
            opacity: (context) => {
              const i = context.dataIndex;
              if (i === activeIndexRef.current) return 1;
              if (i < currentBlockIndexRef.current) return 0.6;
              return 0.35;
            },
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
    requestAnimationFrame(() => syncChartGeometry());

    const ro = containerRef.current
      ? new ResizeObserver(() => {
          chart.update("resize");
          requestAnimationFrame(() => syncChartGeometry());
        })
      : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    return () => {
      ro?.disconnect();
      chart.destroy();
      chartRef.current = null;
    };
  }, [onSegmentClick, applyActiveStyle, syncChartGeometry]);

  useEffect(() => {
    if (chartRef.current) applyActiveStyle(chartRef.current);
  }, [activeIndex, applyActiveStyle]);

  useEffect(() => {
    currentBlockIndexRef.current = currentBlockIndex;
    if (chartRef.current) applyActiveStyle(chartRef.current);
  }, [currentBlockIndex, applyActiveStyle]);

  // 外侧游标：SVG 与 canvas 共享同一像素坐标系，圆心和外径直接从 Chart.js 读取
  const arcR = chartGeometry?.outerRadius ?? 0;
  const circumference = 2 * Math.PI * arcR;
  const arcLength = (currentTimeAngle / 360) * circumference;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[650px] mx-auto"
      style={{ aspectRatio: "1" }}
    >
      <canvas
        ref={canvasRef}
        id="timeDoughnut"
        className="absolute inset-0 size-full"
      />
      {chartGeometry && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: chartGeometry.width,
            height: chartGeometry.height,
            pointerEvents: "none",
          }}
          viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
        >
          <circle
            cx={chartGeometry.cx}
            cy={chartGeometry.cy}
            r={arcR}
            fill="none"
            stroke="rgb(71 85 105)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${chartGeometry.cx} ${chartGeometry.cy})`}
          />
        </svg>
      )}
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
