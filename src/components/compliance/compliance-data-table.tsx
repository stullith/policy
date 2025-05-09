'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ComplianceItem, ComplianceStatus } from "@/lib/placeholder-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ComplianceDataTableProps {
  data: ComplianceItem[];
  isDetailedView?: boolean;
}

const statusIcons: Record<ComplianceStatus, React.ElementType> = {
  "Compliant": ShieldCheck,
  "Non-Compliant": ShieldAlert,
  "Pending": ShieldQuestion,
};

const statusColors: Record<ComplianceStatus, string> = {
  "Compliant": "bg-accent text-accent-foreground", // Teal based
  "Non-Compliant": "bg-destructive text-destructive-foreground", // Red based
  "Pending": "bg-muted text-muted-foreground", // Gray based
};


export function ComplianceDataTable({ data, isDetailedView = false }: ComplianceDataTableProps) {
  const [tableData, setTableData] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredData = data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(lowerSearchTerm)
      )
    );
    setTableData(filteredData);
  }, [searchTerm, data]);


  // TODO: Add sorting state and handlers
  // For simplicity, sorting is not fully implemented here but structure is present
  const handleSort = (columnId: keyof ComplianceItem) => {
    // Basic sort toggle example (can be expanded)
    const sortedData = [...tableData].sort((a, b) => {
       if (a[columnId] < b[columnId]) return -1;
       if (a[columnId] > b[columnId]) return 1;
       return 0;
    });
    // Toggle direction or use a more complex sort state
    // For now, just sorts ascending, or reverse if already sorted by this column (very basic)
    if (JSON.stringify(tableData) === JSON.stringify(sortedData)) {
        setTableData(sortedData.reverse());
    } else {
        setTableData(sortedData);
    }
  };
  
  return (
    <div className="w-full">
       <div className="flex items-center py-4">
        <Input
          placeholder="Filter resources..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead onClick={() => handleSort('resourceName')}>
                <Button variant="ghost" size="sm">Resource Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('resourceType')}>
                <Button variant="ghost" size="sm">Type <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('resourceGroup')}>
                <Button variant="ghost" size="sm">Resource Group <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('subscription')}>
                <Button variant="ghost" size="sm">Subscription <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('policyDefinition')}>
                <Button variant="ghost" size="sm">Policy <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('complianceStatus')}>
                <Button variant="ghost" size="sm">Status <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('lastScanned')}>
                <Button variant="ghost" size="sm">Last Scanned <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              {isDetailedView && <TableHead>Details</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((item) => {
                const StatusIcon = statusIcons[item.complianceStatus];
                return (
                  <TableRow key={item.id} data-state={item.complianceStatus === 'Non-Compliant' ? "selected" : undefined} className={item.complianceStatus === 'Non-Compliant' ? 'bg-destructive/10 hover:bg-destructive/20' : ''}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{item.resourceName}</TableCell>
                    <TableCell>{item.resourceType}</TableCell>
                    <TableCell>{item.resourceGroup}</TableCell>
                    <TableCell>{item.subscription}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.policyDefinition}</TableCell>
                    <TableCell>
                      <Badge variant={item.complianceStatus === 'Compliant' ? 'default' : item.complianceStatus === 'Non-Compliant' ? 'destructive' : 'secondary'} className={`capitalize ${statusColors[item.complianceStatus]}`}>
                        <StatusIcon className="mr-1 h-3.5 w-3.5" />
                        {item.complianceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastScanned}</TableCell>
                    {isDetailedView && <TableCell className="max-w-md truncate text-xs">{item.details}</TableCell>}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Remediate (AI)</DropdownMenuItem>
                          <DropdownMenuItem>Ignore Violation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={isDetailedView ? 10 : 9} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          // onClick={() => previousPage()}
          // disabled={!canPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          // onClick={() => nextPage()}
          // disabled={!canNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
