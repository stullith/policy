'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ComplianceItem } from "@/lib/placeholder-data";

interface ExportButtonProps {
  data: ComplianceItem[];
  filenamePrefix?: string;
}

export function ExportButton({ data, filenamePrefix = "compliance-report" }: ExportButtonProps) {
  const { toast } = useToast();

  const exportToCsv = () => {
    if (data.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    try {
      const header = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).map(String).join(',')); // Ensure all values are strings
      const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows.join('\n')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filenamePrefix}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Exported to CSV", description: `${filenamePrefix}.csv downloaded.` });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({ title: "CSV Export Failed", description: "Could not generate CSV file.", variant: "destructive" });
    }
  };

  const exportToJson = () => {
     if (data.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    try {
      const jsonContent = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const link = document.createElement('a');
      link.setAttribute('href', jsonContent);
      link.setAttribute('download', `${filenamePrefix}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Exported to JSON", description: `${filenamePrefix}.json downloaded.` });
    } catch (error) {
      console.error("JSON Export Error:", error);
      toast({ title: "JSON Export Failed", description: "Could not generate JSON file.", variant: "destructive" });
    }
  };

  const exportToPdf = () => {
    // Placeholder for PDF export
    toast({
      title: "PDF Export Not Implemented",
      description: "PDF export functionality is coming soon.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCsv}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJson}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPdf}>
          <FileType className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
