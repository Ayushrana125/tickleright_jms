import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Filter,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  Download,
  Share2,
} from "lucide-react";
import logoImg from "../../assets/logo.png";
import {
  kpiMetrics,
  sourceCategoryDistribution,
  sourcePerformanceData,
  salesCycleMoM,
  conversionRatesMoM,
  revenueContributionWoW,
  inquiriesWoW,
  inquiriesDoD,
  targetVsAchievementData,
} from "./marketingData";

export default function MarketingOverviewReport() {
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const venues = [
    "All Venues",
    "Andheri - Tr",
    "Juhu - Het Kunj",
    "Worli",
    "Office Colaba",
    "Kandivali East",
    "Tod Bubble - Thane",
    "Tardeo - Ubantu",
    "Matunga",
  ];

  const cities = ["All Cities", "Mumbai", "Delhi", "Pune", "Bengaluru", "Dubai", "Ahmedabad", "Chennai"];

  return (
    <div
      className={`bg-[#f0f2f5] min-h-screen text-slate-800 font-sans p-3 sm:p-5 transition-all ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto bg-[#f0f2f5] p-6" : ""
      }`}
    >
      {/* ──────────────── Looker Studio Top Utility Bar ──────────────── */}
      <div className="bg-white border border-slate-300 rounded shadow-xs mb-3 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-slate-600 font-medium hover:text-slate-900 transition">
            <Filter size={14} className="text-slate-500" />
            <span>Add viewer filter</span>
          </button>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">venue:</span>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-700 font-medium hover:border-slate-400 focus:outline-none"
            >
              {venues.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">city:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-700 font-medium hover:border-slate-400 focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition" title="Options">
            <MoreVertical size={15} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition" title="Collapse header">
            <ChevronUp size={15} />
          </button>
        </div>
      </div>

      {/* ──────────────── Main Canvas (Looker Studio Page 1 Aspect Grid) ──────────────── */}
      <div className="bg-white border border-slate-300 rounded-sm shadow-xs p-4 sm:p-6 grid grid-cols-12 gap-4">
        {/* ════════════════ LEFT COLUMN (3 Cols) ════════════════ */}
        {/* Inquiries Performance WoW (YTD) */}
        <div className="col-span-12 lg:col-span-3 border border-slate-200 rounded-xs p-3 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 tracking-tight mb-2">
              Inquiries Performance WoW (YTD)
            </h3>
            <div className="text-[10px] text-slate-400 font-medium mb-1">Inquiries • Conversion...</div>

            {/* Scrollable container for the 42 weeks list */}
            <div className="h-[620px] overflow-y-auto pr-1 space-y-1 text-[11px]">
              {inquiriesWoW.map((item, idx) => {
                const maxVal = 1000;
                const barWidth = Math.min(100, Math.round((item.inquiries / maxVal) * 100));
                return (
                  <div key={idx} className="flex items-center gap-1.5 leading-tight">
                    <span className="w-16 shrink-0 text-[10px] text-slate-600 font-mono font-medium">
                      {item.week}
                    </span>
                    <div className="flex-1 bg-slate-100 h-3 rounded-2xs overflow-hidden relative">
                      <div
                        className="bg-[#f5b15b] h-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="shrink-0 flex items-center gap-1 min-w-[70px] text-[10px] font-semibold">
                      <span className="text-slate-800">{item.inquiries}</span>
                      <span className="text-[#c03952] text-[9px]">{item.convRate}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Scale */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
              <span>800</span>
              <span>1k</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-4 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#f5b15b] inline-block rounded-2xs" />
              <span>Inquiries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#b63a52] inline-block rounded-2xs" />
              <span>Conversion...</span>
            </div>
          </div>
        </div>

        {/* ════════════════ MIDDLE COLUMN (6 Cols) ════════════════ */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          {/* Table 1: Avg Sales Cycle by Source Category MoM (YTD) */}
          <div className="border border-slate-200 rounded-xs overflow-hidden bg-white">
            <div className="bg-[#f8f9fa] border-b border-slate-200 px-3 py-1.5 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                Avg Sales Cycle by Source Category MoM (YTD)
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-[#f1f3f5] text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">Final Source Category</th>
                    <th className="py-1.5 px-2 text-right">Oct 2026</th>
                    <th className="py-1.5 px-2 text-right">Sept 2026</th>
                    <th className="py-1.5 px-2 text-right">Aug 2026</th>
                    <th className="py-1.5 px-2 text-right">Jul 2026</th>
                    <th className="py-1.5 px-2 text-right">Jun 2026</th>
                    <th className="py-1.5 px-2 text-right">May 2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesCycleMoM.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 font-medium">
                      <td className="py-1.5 px-2.5 font-semibold text-slate-700">{row.category}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.oct}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.sep}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.aug}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.jul}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.jun}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{row.may}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Avg Conversion Rates by Source Category MoM (YTD) */}
          <div className="border border-slate-200 rounded-xs overflow-hidden bg-white">
            <div className="bg-[#b63a52] px-3 py-1.5 flex items-center justify-between text-white">
              <h4 className="text-xs font-bold">Avg Conversion Rates by Source Category MoM (YTD)</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-[#f8f9fa] text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">Final Source Category</th>
                    <th className="py-1.5 px-2 text-right">Oct 2026</th>
                    <th className="py-1.5 px-2 text-right">Sept 2026</th>
                    <th className="py-1.5 px-2 text-right">Aug 2026</th>
                    <th className="py-1.5 px-2 text-right">Jul 2026</th>
                    <th className="py-1.5 px-2 text-right">Jun 2026</th>
                    <th className="py-1.5 px-2 text-right">May 2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {conversionRatesMoM.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-semibold text-slate-700">{row.category}</td>
                      <td className="py-1.5 px-2 text-right bg-rose-50/50 font-semibold text-rose-900">
                        {row.oct}
                      </td>
                      <td className="py-1.5 px-2 text-right bg-rose-100/40 font-semibold text-rose-900">
                        {row.sep}
                      </td>
                      <td className="py-1.5 px-2 text-right bg-rose-100/40 font-semibold text-rose-900">
                        {row.aug}
                      </td>
                      <td className="py-1.5 px-2 text-right bg-rose-200/50 font-bold text-rose-950">
                        {row.jul}
                      </td>
                      <td className="py-1.5 px-2 text-right bg-rose-200/40 font-bold text-rose-950">
                        {row.jun}
                      </td>
                      <td className="py-1.5 px-2 text-right bg-rose-200/60 font-bold text-rose-950">
                        {row.may}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Revenue Contribution WoW (YTD) */}
          <div className="border border-slate-200 rounded-xs overflow-hidden bg-white">
            <div className="bg-[#8fa4ae] px-3 py-1.5 flex items-center justify-between text-white">
              <h4 className="text-xs font-bold">Revenue Contribution WoW (YTD)</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left">
                <thead className="bg-[#f8f9fa] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2 whitespace-nowrap">Final Source Category</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 42</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 41</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 40</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 39</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 38</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 37</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 36</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 35</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 34</th>
                    <th className="py-1.5 px-1.5 text-right whitespace-nowrap">Week 33</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {revenueContributionWoW.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2 font-semibold text-slate-700 whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">{row.w42}</td>
                      <td className="py-1.5 px-1.5 text-right">{row.w41}</td>
                      <td className="py-1.5 px-1.5 text-right">{row.w40}</td>
                      <td className="py-1.5 px-1.5 text-right">{row.w39}</td>
                      <td className="py-1.5 px-1.5 text-right">{row.w38}</td>
                      <td className="py-1.5 px-1.5 text-right font-semibold text-slate-900 bg-slate-50">
                        {row.w37}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">{row.w36}</td>
                      <td className="py-1.5 px-1.5 text-right">{row.w35}</td>
                      <td className="py-1.5 px-1.5 text-right font-semibold text-slate-900 bg-slate-50">
                        {row.w34}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">{row.w33}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inquiries Performance DoD (L30 Days) Combo Chart */}
          <div className="border border-slate-200 rounded-xs p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              Inquiries Performance DoD (L30 Days)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={inquiriesDoD} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    angle={-45}
                    textAnchor="end"
                    interval={1}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 9, fill: "#64748b" }} domain={[0, 200]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 15]}
                    tick={{ fontSize: 9, fill: "#b63a52" }}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{ fontSize: "11px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    formatter={(val, name) => [name === "Conversion Rate" ? `${val}%` : val, name]}
                  />
                  <Bar yAxisId="left" dataKey="inquiries" fill="#f5b15b" name="Inquiries" radius={[2, 2, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    stroke="#b63a52"
                    strokeWidth={1.8}
                    dot={{ r: 2.5, fill: "#b63a52" }}
                    name="Conversion Rate"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-1 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#f5b15b] inline-block rounded-2xs" />
                <span>Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#b63a52] inline-block rounded-2xs" />
                <span>Conversion Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN (3 Cols) ════════════════ */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* Top Crimson Banner Card: "Marketing Overview" */}
          <div className="bg-[#b63a52] text-white rounded-md py-4 px-5 shadow-xs flex items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-center">
              Marketing Overview
            </h2>
          </div>

          {/* 6 KPI Cards Grid (2x3) */}
          <div className="grid grid-cols-3 gap-2">
            {kpiMetrics.map((kpi, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-sm bg-white p-2.5 text-center flex flex-col justify-between shadow-2xs"
              >
                <div className="text-[10px] text-slate-500 font-semibold truncate">{kpi.label}</div>
                <div className="text-lg font-black text-slate-800 tracking-tight my-0.5">{kpi.value}</div>
                <div
                  className={`flex items-center justify-center gap-0.5 text-[10px] font-bold ${
                    kpi.deltaType === "positive" ? "text-emerald-600" : "text-[#c03952]"
                  }`}
                >
                  {kpi.deltaType === "positive" ? (
                    <ArrowUp size={11} strokeWidth={2.5} />
                  ) : (
                    <ArrowDown size={11} strokeWidth={2.5} />
                  )}
                  <span>{kpi.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Source Performance (YTD) Horizontal Bar Chart */}
          <div className="border border-slate-200 rounded-xs p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Source Performance (YTD)</h4>
            <div className="space-y-2 text-[11px]">
              {sourcePerformanceData.map((item, idx) => {
                const maxVal = 700;
                const barWidth = Math.min(100, Math.round((item.conversions / maxVal) * 100));
                return (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium">
                      <span className="truncate max-w-[130px]">{item.source}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-slate-800">{item.conversions}</span>
                        <span className="text-[#b63a52] font-semibold text-[9px]">{item.rate}</span>
                      </div>
                    </div>
                    <div className="bg-slate-100 h-3 rounded-2xs overflow-hidden">
                      <div
                        className="bg-[#cf7074] h-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
              <span>800</span>
            </div>
          </div>

          {/* Source Category Distribution (YTD) Donut Chart */}
          <div className="border border-slate-200 rounded-xs p-3 bg-white flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-800 self-start mb-1">
              Source Category Distribution (YTD)
            </h4>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceCategoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={36}
                    outerRadius={65}
                    paddingAngle={2}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {sourceCategoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-slate-600 mt-1">
              {sourceCategoryDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target vs Achievement (YTD) Combo Chart */}
          <div className="border border-slate-200 rounded-xs p-3 bg-white">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Target vs Achievement (YTD)</h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={targetVsAchievementData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 8, fill: "#64748b" }}
                    angle={-45}
                    textAnchor="end"
                    interval={1}
                  />
                  <YAxis tick={{ fontSize: 9, fill: "#64748b" }} domain={[0, 50]} unit="k" />
                  <Tooltip formatter={(val) => `${val}k`} />
                  <Bar dataKey="value" fill="#f5b15b" name="Value" radius={[2, 2, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#b63a52"
                    strokeWidth={1.8}
                    dot={{ r: 2.5, fill: "#b63a52" }}
                    name="Target"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#f5b15b] inline-block rounded-2xs" />
                  <span>Value</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-[#b63a52] inline-block rounded-2xs" />
                  <span>Target</span>
                </div>
              </div>
              <img src={logoImg} alt="Tickle Right" className="h-6 w-auto object-contain opacity-85" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
