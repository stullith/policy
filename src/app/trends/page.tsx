// src/app/trends/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceHistoryChart } from "@/components/trends/compliance-history-chart";
import { placeholderPolicyHistoryData, placeholderSubscriptionHistoryData, placeholderComplianceItems, type PolicyComplianceHistory } from "@/lib/placeholder-data";
import { TrendingUp, ListFilter, CheckSquare, Layers, Server } from 'lucide-react'; // Added Server icon

export default function TrendsPage() {
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | undefined>(undefined);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(undefined);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | undefined>(undefined);

  const availableSubscriptions = useMemo(() => {
    return [
      { id: 'all', name: 'All Subscriptions', subscriptionId: 'all' },
      ...placeholderSubscriptionHistoryData.map(sub => ({ ...sub, id: sub.subscriptionId, name: sub.subscriptionName }))
    ];
  }, []);

  const selectedSubscriptionName = useMemo(() => {
    if (!selectedSubscriptionId || selectedSubscriptionId === 'all') return null;
    const sub = availableSubscriptions.find(s => s.id === selectedSubscriptionId);
    return sub?.name;
  }, [selectedSubscriptionId, availableSubscriptions]);

  const filteredPoliciesAndInitiatives = useMemo(() => {
    let dataToFilter = placeholderPolicyHistoryData;

    if (selectedSubscriptionName) {
      const relevantPolicyNamesForSub = Array.from(
        new Set(
          placeholderComplianceItems
            .filter(item => item.subscription === selectedSubscriptionName)
            .map(item => item.policyDefinition)
        )
      );
      dataToFilter = placeholderPolicyHistoryData.filter(p => relevantPolicyNamesForSub.includes(p.policyName));
    }
    return dataToFilter;
  }, [selectedSubscriptionName]);

  const policies = useMemo(() => {
    return filteredPoliciesAndInitiatives.filter(item => item.type === 'policy');
  }, [filteredPoliciesAndInitiatives]);

  const initiatives = useMemo(() => {
    return filteredPoliciesAndInitiatives.filter(item => item.type === 'initiative');
  }, [filteredPoliciesAndInitiatives]);

  useEffect(() => {
    // Reset policy/initiative if subscription changes and selected item is no longer available
    if (selectedPolicyId && !policies.find(p => p.policyId === selectedPolicyId)) {
      setSelectedPolicyId(undefined);
    }
    if (selectedInitiativeId && !initiatives.find(i => i.policyId === selectedInitiativeId)) {
      setSelectedInitiativeId(undefined);
    }
  }, [selectedSubscriptionId, policies, initiatives, selectedPolicyId, selectedInitiativeId]);


  const handleSubscriptionChange = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setSelectedPolicyId(undefined);
    setSelectedInitiativeId(undefined);
  };

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
      return filteredPoliciesAndInitiatives.find(p => p.policyId === selectedPolicyId);
    }
    if (selectedInitiativeId) {
      return filteredPoliciesAndInitiatives.find(p => p.policyId === selectedInitiativeId);
    }
    return undefined;
  }, [selectedPolicyId, selectedInitiativeId, filteredPoliciesAndInitiatives]);

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
            Select Filters for Trend Analysis
          </CardTitle>
          <CardDescription>
            Choose a subscription, then an individual policy or a policy initiative to view its historical compliance trend.
            Selecting an item from one dropdown for policy/initiative will clear the selection in the other.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="subscription-select" className="block text-sm font-medium text-foreground mb-1.5">
              Subscription
            </label>
            <Select
              value={selectedSubscriptionId}
              onValueChange={handleSubscriptionChange}
            >
              <SelectTrigger id="subscription-select" className="w-full text-base">
                <SelectValue placeholder={
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Server className="h-4 w-4" />
                    Select a subscription...
                  </div>
                } />
              </SelectTrigger>
              <SelectContent>
                {availableSubscriptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id} className="text-base">
                     <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      {sub.name}
                     </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="policy-select" className="block text-sm font-medium text-foreground mb-1.5">
              Individual Policies
            </label>
            {policies.length > 0 ? (
              <Select
                value={selectedPolicyId}
                onValueChange={handlePolicyChange}
                disabled={!selectedSubscriptionId && availableSubscriptions.length > 1} // Disable if no sub selected and subs exist
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
              <p className="text-muted-foreground text-sm mt-2">
                {selectedSubscriptionId && selectedSubscriptionId !== 'all' ? 'No policies with historical data for this subscription.' : 'No individual policies with historical data available.'}
              </p>
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
                disabled={!selectedSubscriptionId && availableSubscriptions.length > 1} // Disable if no sub selected and subs exist
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
              <p className="text-muted-foreground text-sm mt-2">
                 {selectedSubscriptionId && selectedSubscriptionId !== 'all' ? 'No initiatives with historical data for this subscription.' : 'No policy initiatives with historical data available.'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedItemData ? (
        <ComplianceHistoryChart
          data={selectedItemData.history}
          title={`${selectedItemData.policyName} - Compliance Trend ${selectedSubscriptionName ? `for ${selectedSubscriptionName}` : ''}`}
          description={`Historical compliance percentage over time for the selected ${selectedItemData.type}${selectedSubscriptionName ? ` within ${selectedSubscriptionName}` : ''}.`}
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
                {filteredPoliciesAndInitiatives.length > 0 
                  ? `Select a subscription, then a policy or initiative from the dropdowns above to see its compliance trend.`
                  : `No policies or initiatives with historical data are available ${selectedSubscriptionName ? `for ${selectedSubscriptionName}` : 'for the current selection'}.`
                }
              </p>
            </CardContent>
          </Card>
       )}
    </div>
  );
}
