"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { scheduleData } from "../schedule-data";
import { playBlockSound, unlockAudio } from "../lib/sound";
import RealTimeClock from "./RealTimeClock";
import TimeDoughnut from "./TimeDoughnut";
import DetailPanel from "./DetailPanel";

const RETURN_CURRENT_DELAY_MS = 5000;
const DAY_START_HOUR = 7;
const WAKING_HOURS = 16.5;

function getCurrentBlockIndex(): number {
  const now = new Date();
  const decimalTime =
    now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  return scheduleData.findIndex(
    (item) => decimalTime >= item.start && decimalTime < item.end
  );
}

function getCurrentBlockProgress(): {
  index: number;
  elapsed: number;
  remaining: number;
  decimalTime: number;
} | null {
  const idx = getCurrentBlockIndex();
  if (idx < 0) return null;
  const item = scheduleData[idx];
  const now = new Date();
  const decimalTime =
    now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const elapsed = Math.max(0, decimalTime - item.start);
  const remaining = Math.max(0, item.end - decimalTime);
  return { index: idx, elapsed, remaining, decimalTime };
}

/** 当前时刻在「清醒日盘」上的角度（度），0 为 12 点方向，顺时针 */
function getCurrentTimeAngle(decimalTime: number): number {
  return ((decimalTime - DAY_START_HOUR) / WAKING_HOURS) * 360;
}

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [blockProgress, setBlockProgress] = useState<ReturnType<
    typeof getCurrentBlockProgress
  > | null>(null);
  const userOverrideRef = useRef(false);
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevBlockIndexRef = useRef<number>(-1);
  const lastWasBeforeMiddleRef = useRef(true);

  useEffect(() => {
    const tick = () => {
      const progress = getCurrentBlockProgress();
      setBlockProgress(progress);
      if (!userOverrideRef.current && progress && progress.index >= 0) {
        setActiveIndex(progress.index);
      }

      if (!progress || progress.index < 0) return;
      const { index, elapsed } = progress;
      const duration = scheduleData[index].duration;

      if (index !== prevBlockIndexRef.current) {
        prevBlockIndexRef.current = index;
        lastWasBeforeMiddleRef.current = true;
        playBlockSound("start");
      } else if (duration > 0 && lastWasBeforeMiddleRef.current && elapsed >= duration / 2) {
        lastWasBeforeMiddleRef.current = false;
        playBlockSound("middle");
      } else if (elapsed < duration / 2) {
        lastWasBeforeMiddleRef.current = true;
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onInteraction = () => {
      unlockAudio();
    };
    window.addEventListener("click", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });
    return () => {
      window.removeEventListener("click", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const handleSegmentClick = useCallback((index: number) => {
    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
    setActiveIndex(index);
    const currentIdx = getCurrentBlockIndex();
    if (currentIdx >= 0 && index !== currentIdx) {
      userOverrideRef.current = true;
      returnTimerRef.current = setTimeout(() => {
        returnTimerRef.current = null;
        userOverrideRef.current = false;
        const nowIdx = getCurrentBlockIndex();
        setActiveIndex(nowIdx >= 0 ? nowIdx : 0);
      }, RETURN_CURRENT_DELAY_MS);
    } else {
      userOverrideRef.current = false;
    }
  }, []);

  const item = scheduleData[activeIndex] ?? scheduleData[0];

  return (
    <div className="antialiased fixed inset-0 flex flex-col overflow-hidden bg-[#f8fafc] text-slate-800">
      <header className="w-full px-6 md:px-12 py-5 flex justify-between items-center bg-white/50 border-b border-slate-200 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍💻</span>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Dev Dad
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <span>试听：</span>
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                playBlockSound("start");
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              开始音效
            </button>
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                playBlockSound("middle");
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              中间音效
            </button>
          </div>
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            16.5 小时清醒时间
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-3/5 min-w-0 h-[50vh] lg:h-full p-6 lg:p-12 flex flex-col items-center justify-center bg-slate-50 shrink-0 border-r border-slate-200">
          <RealTimeClock />
          <div className="w-full max-w-[650px] aspect-square flex items-center justify-center min-h-0 shrink">
            <TimeDoughnut
              activeIndex={activeIndex}
              currentBlockIndex={blockProgress?.index ?? -1}
              onSegmentClick={handleSegmentClick}
              currentTimeAngle={blockProgress ? getCurrentTimeAngle(blockProgress.decimalTime) : 0}
            />
          </div>
        </div>

        <div className="w-full lg:w-2/5 h-[50vh] lg:h-full overflow-y-auto no-scrollbar p-6 lg:p-10 relative bg-white">
          <div
            className="detail-panel max-w-md mx-auto h-full flex flex-col justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ opacity: 1 }}
          >
            <DetailPanel item={item} />
          </div>
        </div>
      </main>
    </div>
  );
}
