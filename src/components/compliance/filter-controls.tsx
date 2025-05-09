
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ListFilter, Users, AlertTriangle, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useConnections } from '@/hooks/use-connections'; // Updated import
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Dummy data for other filters - replace with actual data sources or remove if not used
const subscriptions = ["All Subscriptions", "Subscription Alpha", "Subscription Bravo", "Subscription Charlie"];
const resourceGroups = ["All Resource Groups", "RG-Compute", "RG-Storage-Prod", "RG-Network-Infra"];
const policyDefinitions = ["All Policies", "Allowed locations", "Enforce HTTPS", "Require MFA for Admins"];
const complianceStatus = ["All Statuses", "Compliant", "Non-Compliant", "Pending"];

export function FilterControls() {
  const { connections: tenantConnections, isLoading: isLoadingConnections, error: connectionsError, retryFetch: retryFetchConnections } = useConnections();
  const [selectedTenant, setSelectedTenant] = useState<string>('');

  const handleApplyFilters = () => {
    console.log("Applying filters with selected tenant connection ID:", selectedTenant);
    // Actual filter application logic would go here
  };

  return (
    <Card className="p-4 md:p-6 mb-6 shadow-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        
        {/* Tenant Connection Filter */}
        <div className="min-w-0">
          <Label htmlFor="tenant-connection-filter">Tenant Connection</Label>
          {isLoadingConnections && (
            <Skeleton className="h-10 w-full rounded-md mt-1.5" />
          )}
          {connectionsError && !isLoadingConnections && (
             <Alert variant="destructive" className="mt-1.5 text-xs p-2">
              <AlertTriangle className="h-3 w-3" />
              <AlertTitle className="text-xs mb-0.5">Error</AlertTitle>
              <AlertDescription className="text-xs">
                Failed to load. 
                <Button onClick={retryFetchConnections} variant="link" className="p-0 h-auto ml-1 text-destructive-foreground underline text-xs">
                   <RotateCw className="mr-0.5 h-2.5 w-2.5" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {!isLoadingConnections && !connectionsError && (
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger id="tenant-connection-filter" className="w-full mt-1.5">
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                   <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      All Tenants
                    </div>
                </SelectItem>
                {tenantConnections.map(conn => (
                  <SelectItem key={conn.id} value={conn.id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {conn.name}
                    </div>
                  </SelectItem>
                ))}
                {tenantConnections.length === 0 && (
                   <div className="p-2 text-sm text-muted-foreground text-center">No connections found.</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Other Filters (unchanged from original, using dummy data) */}
        <div className="min-w-0">
          <Label htmlFor="subscription-filter">Subscription</Label>
          <Select defaultValue={subscriptions[0].toLowerCase().replace(/\s+/g, '-')}>
            <SelectTrigger id="subscription-filter" className="w-full mt-1.5">
              <SelectValue placeholder="All Subscriptions" />
            </SelectTrigger>
            <SelectContent>
              {subscriptions.map(sub => <SelectItem key={sub.toLowerCase().replace(/\s+/g, '-')} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <Label htmlFor="resource-group-filter">Resource Group</Label>
          <Select defaultValue={resourceGroups[0].toLowerCase().replace(/\s+/g, '-')}>
            <SelectTrigger id="resource-group-filter" className="w-full mt-1.5">
              <SelectValue placeholder="All Resource Groups" />
            </SelectTrigger>
            <SelectContent>
              {resourceGroups.map(rg => <SelectItem key={rg.toLowerCase().replace(/\s+/g, '-')} value={rg.toLowerCase().replace(/\s+/g, '-')}>{rg}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <Label htmlFor="policy-filter">Policy Definition</Label>
          <Select defaultValue={policyDefinitions[0].toLowerCase().replace(/\s+/g, '-')}>
            <SelectTrigger id="policy-filter" className="w-full mt-1.5">
              <SelectValue placeholder="All Policies" />
            </SelectTrigger>
            <SelectContent>
              {policyDefinitions.map(policy => <SelectItem key={policy.toLowerCase().replace(/\s+/g, '-')} value={policy.toLowerCase().replace(/\s+/g, '-')}>{policy}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="min-w-0">
          <Label htmlFor="status-filter">Compliance Status</Label>
          <Select defaultValue={complianceStatus[0].toLowerCase()}>
            <SelectTrigger id="status-filter" className="w-full mt-1.5">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {complianceStatus.map(status => <SelectItem key={status.toLowerCase()} value={status.toLowerCase()}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleApplyFilters}>
            <ListFilter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
      </div>
    </Card>
  );
}
