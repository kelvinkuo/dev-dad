export interface ScheduleItem {
  id: number;
  time: string;
  start: number;
  end: number;
  title: string;
  /** 用于 donut 圆环上展示的短标题（建议 2 字） */
  donutTitle: string;
  category: string;
  duration: number;
  colorHex: string;
  bgClass: string;
  borderClass: string;
  icon: string;
  details: string;
}

export const scheduleData: ScheduleItem[] = [
  {
    id: 1,
    time: "07:00 - 08:00",
    start: 7.0,
    end: 8.0,
    title: "晨间唤醒",
    donutTitle: "晨间",
    category: "个人精力",
    duration: 1.0,
    colorHex: "#10b981",
    bgClass: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-200",
    icon: "🌅",
    details:
      "起床、拉伸、喝温水、早饭、洗漱、上厕所。这是纯粹的个人状态启动时间，为一天的高效打下生理基础。",
  },
  {
    id: 2,
    time: "08:00 - 10:00",
    start: 8.0,
    end: 10.0,
    title: "规划与准备",
    donutTitle: "规划",
    category: "日常杂务",
    duration: 2.0,
    colorHex: "#64748b",
    bgClass: "bg-slate-100 text-slate-700",
    borderClass: "border-slate-200",
    icon: "🧹",
    details:
      "制定计划、阅读、新闻、打扫、晚饭食材准备。因为雨果能自理，可以安心看新闻、理清一天思路，顺手把晚上的食材解冻或洗切好。",
  },
  {
    id: 3,
    time: "10:00 - 12:00",
    start: 10.0,
    end: 12.0,
    title: "沉浸工作 I",
    donutTitle: "深工",
    category: "深度工作",
    duration: 2.0,
    colorHex: "#4f46e5",
    bgClass: "bg-indigo-50 text-indigo-700",
    borderClass: "border-indigo-200",
    icon: "🎯",
    details:
      "技术攻坚、核心代码编写、架构思考。关闭不必要的通知。<br><br>💡 <strong>建议：</strong>对于非紧急消息，采用“批处理”模式。",
  },
  {
    id: 4,
    time: "12:00 - 13:30",
    start: 12.0,
    end: 13.5,
    title: "午休与午饭",
    donutTitle: "午休",
    category: "个人精力",
    duration: 1.5,
    colorHex: "#34d399",
    bgClass: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-200",
    icon: "🍛",
    details:
      "吃午饭并进行休息。建议午休控制在30分钟左右，避免进入深度睡眠导致下午昏沉。",
  },
  {
    id: 5,
    time: "13:30 - 15:30",
    start: 13.5,
    end: 15.5,
    title: "沉浸工作 II",
    donutTitle: "深工",
    category: "深度工作",
    duration: 2.0,
    colorHex: "#6366f1",
    bgClass: "bg-indigo-50 text-indigo-700",
    borderClass: "border-indigo-200",
    icon: "💻",
    details:
      "业务开发、代码产出。延续上午的心流状态。<br><br><span class='inline-block bg-rose-100 text-rose-700 px-3 py-1.5 rounded-md text-sm font-bold mt-3 border border-rose-200'>⚠️ 周二特殊：14:00 - 14:30 团队例会</span>",
  },
  {
    id: 6,
    time: "15:30 - 17:00",
    start: 15.5,
    end: 17.0,
    title: "运动与洗漱",
    donutTitle: "运动",
    category: "个人精力",
    duration: 1.5,
    colorHex: "#059669",
    bgClass: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-200",
    icon: "🏃‍♂️",
    details:
      "跑步、器械等高强度个人锻炼，并在结束后冲澡换装。彻底释放脑力疲劳。",
  },
  {
    id: 7,
    time: "17:00 - 18:00",
    start: 17.0,
    end: 18.0,
    title: "制作晚饭",
    donutTitle: "做饭",
    category: "日常杂务",
    duration: 1.0,
    colorHex: "#475569",
    bgClass: "bg-slate-100 text-slate-700",
    borderClass: "border-slate-200",
    icon: "🍳",
    details:
      "1个小时非常从容。播放播客或音乐，享受烹饪的乐趣。这是从工作脑切换回居家脑的完美缓冲。",
  },
  {
    id: 8,
    time: "18:00 - 19:00",
    start: 18.0,
    end: 19.0,
    title: "晚饭与收拾",
    donutTitle: "晚饭",
    category: "家庭陪伴",
    duration: 1.0,
    colorHex: "#f59e0b",
    bgClass: "bg-amber-50 text-amber-700",
    borderClass: "border-amber-200",
    icon: "🍽️",
    details: "和雨果交流一天见闻。放下手机，专注沟通。",
  },
  {
    id: 9,
    time: "19:00 - 22:00",
    start: 19.0,
    end: 22.0,
    title: "亲子与爱好",
    donutTitle: "亲子",
    category: "家庭陪伴",
    duration: 3.0,
    colorHex: "#d97706",
    bgClass: "bg-amber-50 text-amber-700",
    borderClass: "border-amber-200",
    icon: "🏸",
    details:
      "天气好时户外羽毛球，天气不好时室内互动。这 3 小时完全自由分配。",
  },
  {
    id: 10,
    time: "22:00 - 23:00",
    start: 22.0,
    end: 23.0,
    title: "个人沉淀",
    donutTitle: "沉淀",
    category: "个人精力",
    duration: 1.0,
    colorHex: "#10b981",
    bgClass: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-200",
    icon: "📖",
    details: "阅读、复盘、冥想。远离屏幕蓝光，降低大脑兴奋度。",
  },
  {
    id: 11,
    time: "23:00 - 23:30",
    start: 23.0,
    end: 23.5,
    title: "准备入睡",
    donutTitle: "入睡",
    category: "个人精力",
    duration: 0.5,
    colorHex: "#047857",
    bgClass: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-200",
    icon: "💤",
    details: "洗漱并争取 23:30 前入睡。睡足7.5小时，保证明天活力充足。",
  },
];

export const TOTAL_WAKING_HOURS = 16.5;
