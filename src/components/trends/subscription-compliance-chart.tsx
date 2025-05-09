// src/components/trends/subscription-compliance-chart.tsx
'use client';

import type { HistoricalComplianceDataPoint } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

const chartConfig = {
  compliance: {
    label: 'Compliance %',
    color: 'hsl(var(--chart-2))', // Using chart-2 for differentiation from policy/initiative chart
    icon: TrendingUp,
  },
} satisfies ChartConfig;

interface SubscriptionComplianceChartProps {
  data: HistoricalComplianceDataPoint[];
  title: string;
  description?: string;
}

export function SubscriptionComplianceChart({ data, title, description }: SubscriptionComplianceChartProps) {
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
          <p className="text-muted-foreground">No historical data available for this subscription.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: item.date,
      compliance: item.compliancePercentage,
    }));

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
        <ChartContainer config={chartConfig} className="h-[300px] w-full"> {/* Adjusted height slightly */}
          <LineChart
            accessibilityLayer
            data={sortedData}
            margin={{
              left: 12,
              right: 24,
              top: 10,
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
              content={<ChartTooltipContent indicator="line" nameKey="compliance" labelKey="date" />}
            />
            <Line
              dataKey="compliance"
              type="monotone"
              stroke="var(--color-compliance)" 
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "var(--color-compliance)",
                strokeWidth: 2,
                stroke: "hsl(var(--background))"
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                fill: "var(--color-compliance)",
                stroke: "hsl(var(--background))"
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
