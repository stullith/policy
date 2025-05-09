
// src/app/trends/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceHistoryChart } from "@/components/trends/compliance-history-chart";
import { placeholderPolicyHistoryData, type PolicyComplianceHistory } from "@/lib/placeholder-data";
import { TrendingUp, ListFilter, CheckSquare, Layers } from 'lucide-react';

export default function TrendsPage() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(undefined);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | undefined>(undefined);

  const policies = useMemo(() => {
    return placeholderPolicyHistoryData.filter(item => item.type === 'policy');
  }, []);

  const initiatives = useMemo(() => {
    return placeholderPolicyHistoryData.filter(item => item.type === 'initiative');
  }, []);

  const handlePolicyChange = (policyId: string) => {
    setSelectedPolicyId(policyId);
    setSelectedInitiativeId(undefined); // Clear initiative selection
  };

  const handleInitiativeChange = (initiativeId: string) => {
    setSelectedInitiativeId(initiativeId);
    setSelectedPolicyId(undefined); // Clear policy selection
  };

  const selectedItemData = useMemo(() => {
    if (selectedPolicyId) {
      return placeholderPolicyHistoryData.find(p => p.policyId === selectedPolicyId);
    }
    if (selectedInitiativeId) {
      return placeholderPolicyHistoryData.find(p => p.policyId === selectedInitiativeId);
    }
    return undefined;
  }, [selectedPolicyId, selectedInitiativeId]);

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
          <CardTitle className="flex items-center gap-2">
            <ListFilter className="h-6 w-6 text-primary" />
            Select Item for Trend Analysis
          </CardTitle>
          <CardDescription>
            Choose either an individual policy or a policy initiative to view its historical compliance trend.
            Selecting an item from one dropdown will clear the selection in the other.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="policy-select" className="block text-sm font-medium text-foreground mb-1.5">
              Individual Policies
            </label>
            {policies.length > 0 ? (
              <Select
                value={selectedPolicyId}
                onValueChange={handlePolicyChange}
              >
                <SelectTrigger id="policy-select" className="w-full text-base">
                  <SelectValue placeholder={
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckSquare className="h-4 w-4" />
                      Select a policy...
                    </div>
                  } />
                </SelectTrigger>
                <SelectContent>
                  {policies.map((policy) => (
                    <SelectItem key={policy.policyId} value={policy.policyId} className="text-base">
                       <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        {policy.policyName}
                       </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground text-sm mt-2">No individual policies with historical data available.</p>
            )}
          </div>

          <div>
            <label htmlFor="initiative-select" className="block text-sm font-medium text-foreground mb-1.5">
              Policy Initiatives
            </label>
            {initiatives.length > 0 ? (
              <Select
                value={selectedInitiativeId}
                onValueChange={handleInitiativeChange}
              >
                <SelectTrigger id="initiative-select" className="w-full text-base">
                   <SelectValue placeholder={
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      Select an initiative...
                    </div>
                  } />
                </SelectTrigger>
                <SelectContent>
                  {initiatives.map((initiative) => (
                    <SelectItem key={initiative.policyId} value={initiative.policyId} className="text-base">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        {initiative.policyName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground text-sm mt-2">No policy initiatives with historical data available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedItemData ? (
        <ComplianceHistoryChart
          data={selectedItemData.history}
          title={`${selectedItemData.policyName} - Compliance Trend`}
          description={`Historical compliance percentage over time for the selected ${selectedItemData.type}.`}
        />
      ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Compliance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {placeholderPolicyHistoryData.length > 0 
                  ? "Select a policy or initiative from the dropdowns above to see its compliance trend."
                  : "No policies or initiatives with historical data are available."
                }
              </p>
            </CardContent>
          </Card>
       )}
    </div>
  );
}
