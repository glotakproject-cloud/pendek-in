"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface MiniChartProps {
  data: { date: string; clicks: number; unique: number }[];
}

export function Mini7DayChart({ data }: MiniChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[220px] w-full flex items-center justify-center bg-cream/30 border-2 border-black">
        <span className="font-mono text-xs font-bold text-neutral-500">Memuat grafik...</span>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D26A" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#00D26A" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B4FF39" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#B4FF39" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <YAxis
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="border-2 border-black bg-white p-2.5 shadow-brutal-sm font-mono text-xs">
                    <p className="font-black text-black border-b border-black pb-1 mb-1">{label}</p>
                    <p className="text-primary-dark font-bold">
                      Total Klik: <span className="text-black font-black">{payload[0]?.value}</span>
                    </p>
                    <p className="text-neutral-600 font-bold">
                      Klik Unik: <span className="text-black font-black">{payload[1]?.value}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#0A0A0A"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#primaryGradient)"
          />
          <Area
            type="monotone"
            dataKey="unique"
            stroke="#00A653"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#accentGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsMainChart({ data }: MiniChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[320px] w-full flex items-center justify-center bg-cream/30 border-2 border-black">
        <span className="font-mono text-xs font-bold text-neutral-500">Memuat grafik analitik...</span>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="mainClicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D26A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00D26A" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="mainUniqueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B4FF39" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#B4FF39" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#0A0A0A", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <YAxis
            tick={{ fill: "#0A0A0A", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="border-2 border-black bg-white p-3 shadow-brutal font-mono text-xs space-y-1">
                    <p className="font-black text-black border-b-2 border-black pb-1 uppercase">{label}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-neutral-700">Total Klik:</span>
                      <span className="font-black text-black bg-primary px-1 border border-black">
                        {payload[0]?.value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-neutral-700">Klik Unik:</span>
                      <span className="font-black text-black bg-accent px-1 border border-black">
                        {payload[1]?.value}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Total Klik"
            stroke="#0A0A0A"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#mainClicksGradient)"
          />
          <Area
            type="monotone"
            dataKey="unique"
            name="Klik Unik"
            stroke="#00A653"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#mainUniqueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReferrerBarChart({ data }: { data: { name: string; clicks: number }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center bg-cream/30 border-2 border-black">
        <span className="font-mono text-xs font-bold text-neutral-500">Memuat grafik...</span>
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700 }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
            width={100}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="border-2 border-black bg-white p-2 shadow-brutal-sm font-mono text-xs">
                    <p className="font-bold">{payload[0]?.payload.name}</p>
                    <p className="font-black text-primary-dark">{payload[0]?.value} klik</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="clicks" fill="#00D26A" stroke="#0A0A0A" strokeWidth={2} radius={0}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? "#00D26A" : index === 1 ? "#B4FF39" : "#F5F5F0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeviceBreakdownChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center bg-cream/30 border-2 border-black">
        <span className="font-mono text-xs font-bold text-neutral-500">Memuat grafik...</span>
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700 }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <YAxis
            tick={{ fill: "#0A0A0A", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-space-mono)" }}
            axisLine={{ stroke: "#0A0A0A", strokeWidth: 2 }}
            tickLine={{ stroke: "#0A0A0A" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="border-2 border-black bg-white p-2 shadow-brutal-sm font-mono text-xs">
                    <p className="font-bold">{payload[0]?.payload.name}</p>
                    <p className="font-black text-black">{payload[0]?.value} klik</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" stroke="#0A0A0A" strokeWidth={2} radius={0}>
            {data.map((entry, index) => (
              <Cell key={`cell-device-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
