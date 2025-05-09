
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ListFilter, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AzureConnection } from '@/hooks/use-connections';

// Dummy data for other filters - replace with actual data sources or remove if not used
const subscriptions = ["All Subscriptions", "Subscription Alpha", "Subscription Bravo", "Subscription Charlie"];
const resourceGroups = ["All Resource Groups", "RG-Compute", "RG-Storage-Prod", "RG-Network-Infra"];
const policyDefinitions = ["All Policies", "Allowed locations", "Enforce HTTPS", "Require MFA for Admins"];
const complianceStatus = ["All Statuses", "Compliant", "Non-Compliant", "Pending"];

const LOCAL_STORAGE_KEY_CONNECTIONS = 'azureConnections';

export function FilterControls() {
  const [tenantConnections, setTenantConnections] = useState<AzureConnection[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>(''); // Store selected tenant ID (value of SelectItem)
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedConnections = localStorage.getItem(LOCAL_STORAGE_KEY_CONNECTIONS);
        if (storedConnections) {
          setTenantConnections(JSON.parse(storedConnections));
        }
      } catch (error) {
        console.error("Failed to load tenant connections from localStorage:", error);
      }
      setIsLoadingConnections(false);
    }
  }, []);

  const handleApplyFilters = () => {
    // This is where you would typically trigger a data fetch or state update
    // based on all selected filter values, including `selectedTenant`.
    console.log("Applying filters with selected tenant connection ID:", selectedTenant);
    // For now, it's just a console log.
  };

  return (
    <Card className="p-4 md:p-6 mb-6 shadow-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        {!isLoadingConnections && tenantConnections.length > 0 && (
          <div className="min-w-0"> {/* Added min-w-0 for better truncation handling if needed */}
            <Label htmlFor="tenant-connection-filter">Tenant Connection</Label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger id="tenant-connection-filter" className="w-full">
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
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="min-w-0">
          <Label htmlFor="subscription-filter">Subscription</Label>
          <Select defaultValue={subscriptions[0].toLowerCase().replace(/\s+/g, '-')}>
            <SelectTrigger id="subscription-filter" className="w-full">
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
            <SelectTrigger id="resource-group-filter" className="w-full">
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
            <SelectTrigger id="policy-filter" className="w-full">
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
            <SelectTrigger id="status-filter" className="w-full">
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
