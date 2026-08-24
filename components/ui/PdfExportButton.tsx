"use client";

import { useState } from "react";
import { SFArrowDownDocument as Download, SFArrowClockwise as Loader2 } from 'sf-symbols-lib/monochrome';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PdfExportButton({ targetId, filename }: { targetId: string, filename: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = async () => {
    try {
      setIsExporting(true);
      const element = document.getElementById(targetId);
      if (!element) throw new Error("Target element not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#F4F6FA",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", "a4");
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportPdf}
      disabled={isExporting}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--color-card-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-sm disabled:opacity-50"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      <span>Export PDF</span>
    </button>
  );
}
