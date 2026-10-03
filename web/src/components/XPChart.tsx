"use client";

import React, { useEffect, useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useActivityStore from "@/../core/activityState";
import useUserStore from "@/../core/userState";

interface XPChartProps {
  className?: string;
}

const XPChart: React.FC<XPChartProps> = ({ className = "" }) => {
  const user = useUserStore((state) => state.user);
  const { activities, fetchActivities, isLoading } = useActivityStore();

  useEffect(() => {
    if (user?.id) {
      fetchActivities(user.id);
    }
  }, [user?.id, fetchActivities]);

  const chartData = useMemo(() => {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return date;
    });

    const dailyXP = past7Days.map(date => {
      const dateStr = date.toDateString();
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate.toDateString() === dateStr;
      });

      const totalXP = dayActivities.reduce((sum, activity) => sum + activity.xpEarned, 0);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        day: dayName,
        xp: totalXP,
        date: dateStr
      };
    });

    return dailyXP;
  }, [activities]);

  const chartConfig = {
    xp: {
      label: "XP Earned",
      color: "#10b981",
    },
  };

  if (isLoading) {
    return (
      <div className={`bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 h-[300px] flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00FF80]"></div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#E0E0E0] text-lg font-semibold">Earning Statistics</h3>
          {/* <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF80] rounded-full"></div>
              <span className="text-[#B3B3B3] text-sm">
                {chartData.reduce((sum, day) => sum + day.xp, 0)} XP Earned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#B3B3B3] text-sm">7 days</span>
            </div>
          </div> */}
        </div>
        <div className="text-[#B3B3B3] text-sm">
          Weekly
        </div>
      </div>
      
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-[#2A2A2A] border border-[#3E3E3E] rounded-lg"
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.date;
                  }
                  return label;
                }}
                formatter={(value, name) => [
                  `${value} `,
                  name === 'xp' ? 'XP Earned' : name
                ]}
              />
            }
          />
          <Bar 
            dataKey="xp" 
            fill="#00FF80"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default XPChart;
