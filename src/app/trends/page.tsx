// src/app/trends/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceHistoryChart } from "@/components/trends/compliance-history-chart";
import { placeholderPolicyHistoryData, type PolicyComplianceHistory } from "@/lib/placeholder-data";
import { TrendingUp } from 'lucide-react';

export default function TrendsPage() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(
    placeholderPolicyHistoryData.length > 0 ? placeholderPolicyHistoryData[0].policyId : undefined
  );

  const handlePolicyChange = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  const selectedPolicyData = useMemo(() => {
    return placeholderPolicyHistoryData.find(p => p.policyId === selectedPolicyId);
  }, [selectedPolicyId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <TrendingUp className="mr-3 h-8 w-8" />
          Compliance Trends
        </h1>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Select Policy/Initiative</CardTitle>
          <CardDescription>
            Choose a policy or initiative to view its historical compliance trend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {placeholderPolicyHistoryData.length > 0 ? (
            <Select
              value={selectedPolicyId}
              onValueChange={handlePolicyChange}
            >
              <SelectTrigger className="w-full sm:w-[300px] text-base">
                <SelectValue placeholder="Select a policy/initiative..." />
              </SelectTrigger>
              <SelectContent>
                {placeholderPolicyHistoryData.map((policy) => (
                  <SelectItem key={policy.policyId} value={policy.policyId} className="text-base">
                    {policy.policyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground">No policies with historical data are available.</p>
          )}
        </CardContent>
      </Card>

      {selectedPolicyData ? (
        <ComplianceHistoryChart
          data={selectedPolicyData.history}
          title={`${selectedPolicyData.policyName} - Compliance Trend`}
          description="Historical compliance percentage over time for the selected policy/initiative."
        />
      ) : (
         selectedPolicyId && placeholderPolicyHistoryData.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Compliance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please select a policy to view its trend, or no data is available for the current selection.</p>
            </CardContent>
          </Card>
         )
      )}
       {!selectedPolicyId && placeholderPolicyHistoryData.length > 0 && (
         <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Compliance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a policy from the dropdown above to see its compliance trend.</p>
            </CardContent>
          </Card>
       )}

    </div>
  );
}
