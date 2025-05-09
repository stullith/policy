'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListFilter, Search } from "lucide-react";

// Dummy data for filters - replace with actual data sources
const subscriptions = ["Subscription A", "Subscription B", "Subscription C"];
const resourceGroups = ["RG-WebApp", "RG-Database", "RG-Network"];
const policyDefinitions = ["Allowed locations", "Enforce HTTPS", "Require Tags"];
const complianceStatus = ["Compliant", "Non-Compliant", "Pending"];

export function FilterControls() {
  // TODO: Implement state and handlers for filters
  return (
    <Card className="p-4 mb-6 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="subscription-filter">Subscription</Label>
          <Select>
            <SelectTrigger id="subscription-filter">
              <SelectValue placeholder="All Subscriptions" />
            </SelectTrigger>
            <SelectContent>
              {subscriptions.map(sub => <SelectItem key={sub} value={sub.toLowerCase().replace(' ', '-')}>{sub}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="resource-group-filter">Resource Group</Label>
          <Select>
            <SelectTrigger id="resource-group-filter">
              <SelectValue placeholder="All Resource Groups" />
            </SelectTrigger>
            <SelectContent>
              {resourceGroups.map(rg => <SelectItem key={rg} value={rg.toLowerCase()}>{rg}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="policy-filter">Policy Definition</Label>
          <Select>
            <SelectTrigger id="policy-filter">
              <SelectValue placeholder="All Policies" />
            </SelectTrigger>
            <SelectContent>
              {policyDefinitions.map(policy => <SelectItem key={policy} value={policy.toLowerCase().replace(' ', '-')}>{policy}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status-filter">Compliance Status</Label>
          <Select>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {complianceStatus.map(status => <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="w-full">
            <ListFilter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Need Card for FilterControls
import { Card } from "@/components/ui/card";
