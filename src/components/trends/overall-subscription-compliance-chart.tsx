// src/components/trends/overall-subscription-compliance-chart.tsx
'use client';

import type { SubscriptionComplianceHistory, HistoricalComplianceDataPoint } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from 'recharts';
import { TrendingUp, Layers } from 'lucide-react'; // Using Layers for generic subscription icon in legend
import React from 'react';

interface OverallSubscriptionComplianceChartProps {
  data: SubscriptionComplianceHistory[];
  title: string;
  description?: string;
}

export function OverallSubscriptionComplianceChart({ data, title, description }: OverallSubscriptionComplianceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical data available for subscriptions.</p>
        </CardContent>
      </Card>
    );
  }

  const subscriptionNames = data.map(sub => sub.subscriptionName);
  
  const allDates = new Set<string>();
  data.forEach(sub => sub.history.forEach(h => allDates.add(h.date)));

  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const transformedChartData = sortedDates.map(date => {
    const entry: { date: string; [key: string]: number | string | null } = { date };
    data.forEach(sub => {
      const historyPoint = sub.history.find(h => h.date === date);
      entry[sub.subscriptionName] = historyPoint ? historyPoint.compliancePercentage : null;
    });
    return entry;
  });

  const chartColors = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))', 
    'hsl(var(--chart-5))',
    // Add more distinct HSL colors if more than 5 subscriptions are common
    'hsl(var(--primary))', 
    'hsl(var(--accent))',
  ];

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    subscriptionNames.forEach((name, index) => {
      config[name] = {
        label: name,
        color: chartColors[index % chartColors.length],
        icon: Layers, // Using a generic icon for subscriptions in legend
      };
    });
    return config;
  }, [subscriptionNames]);


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            accessibilityLayer
            data={transformedChartData}
            margin={{
              left: 12,
              right: 24,
              top: 20, // Increased top margin for legend
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                // Add one day to date to prevent off-by-one timezone issues displaying previous month
                const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000 + 24*60*60*1000);
                return adjustedDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="line" />} // nameKey and labelKey are handled by default or via formatter
            />
            <ChartLegend content={<ChartLegendContent />} />
            {subscriptionNames.map((name) => (
              <Line
                key={name}
                dataKey={name}
                type="monotone"
                stroke={`var(--color-${name})`} // Uses color from chartConfig via ChartStyle
                strokeWidth={2.5}
                dot={{
                  r: 2, // Smaller dots for multi-line chart
                  fill: `var(--color-${name})`,
                  strokeWidth: 1,
                  stroke: "hsl(var(--background))"
                }}
                activeDot={{
                  r: 5, // Slightly larger active dot
                  strokeWidth: 2,
                  fill: `var(--color-${name})`,
                  stroke: "hsl(var(--background))"
                }}
                connectNulls // Connects points across null values if a subscription doesn't have data for a date
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
