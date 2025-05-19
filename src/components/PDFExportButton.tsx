import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToPDF } from '@/lib/pdfExport';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportButtonProps {
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ className }) => {
  const [isExporting, setIsExporting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleExportCurrentPage = async () => {
    try {
      setIsExporting(true);
      
      // Find the main content area
      const contentElement = document.querySelector('main');
      if (!contentElement) {
        throw new Error('Content element not found');
      }

      // Get current page name from path
      const pathSegments = location.pathname.split('/');
      const pageName = pathSegments[pathSegments.length - 1] || 'summary';
      const pageTitle = pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Export the current page
      await exportToPDF(contentElement as HTMLElement, {
        filename: `crypto-forensics-${pageName}.pdf`,
        pageTitle: `Crypto Forensics - ${pageTitle}`,
        pageSubtitle: `Dashboard Export - ${new Date().toLocaleDateString()}`
      });

      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const exportPageByPath = async (path: string) => {
    try {
      setIsExporting(true);
      
      // Store current path to return to it later
      const currentPath = location.pathname;
      
      // Set global PDF export mode for Fund Source Hierarchy
      let didSetPdfExportMode = false;
      if (path === '/fund-source-hierarchy') {
        window.__pdfExportMode = true;
        didSetPdfExportMode = true;
        // Wait for UI to update
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Navigate to the target page
      navigate(path);
      
      // Wait for page to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Special handling for Fund Source Hierarchy
      let didExpand = false;
      if (path === '/fund-source-hierarchy' && window.__expandAllFundSourceNodes) {
        window.__expandAllFundSourceNodes();
        didExpand = true;
        // Wait for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Find the main content area
      const contentElement = document.querySelector('main');
      if (!contentElement) {
        throw new Error('Content element not found');
      }

      // Get page name from path
      const pathSegments = path.split('/');
      const pageName = pathSegments[pathSegments.length - 1] || 'summary';
      const pageTitle = pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Export the page
      await exportToPDF(contentElement as HTMLElement, {
        filename: `crypto-forensics-${pageName}.pdf`,
        pageTitle: `Crypto Forensics - ${pageTitle}`,
        pageSubtitle: `Dashboard Export - ${new Date().toLocaleDateString()}`
      });

      // Restore Fund Source Hierarchy state
      if (didExpand && window.__restoreFundSourceNodes) {
        window.__restoreFundSourceNodes();
      }
      // Unset PDF export mode
      if (didSetPdfExportMode) {
        window.__pdfExportMode = false;
      }

      // Navigate back to original page
      navigate(currentPath);
      
      toast.success(`${pageTitle} page exported successfully`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllPages = async () => {
    try {
      setIsExporting(true);
      
      // Define all pages in the dashboard
      const pages = [
        { path: '/', name: 'Summary Dashboard' },
        { path: '/network-analytics', name: 'Network Analytics' },
        { path: '/inbound-transactions', name: 'Inbound Transactions' },
        { path: '/outbound-transactions', name: 'Outbound Transactions' },
        { path: '/address-attribution', name: 'Address Attribution' },
        { path: '/fund-source-hierarchy', name: 'Fund Source Hierarchy' }
      ];
      
      // Store current path to return to it later
      const currentPath = location.pathname;
      
      // Create a merged PDF of all pages
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Add title page
      pdf.setFontSize(24);
      pdf.text('Crypto Forensics Dashboard', pageWidth / 2, pageHeight / 3, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text('Complete Analysis Report', pageWidth / 2, pageHeight / 3 + 10, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight / 3 + 20, { align: 'center' });
      
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Show progress
        toast.info(`Exporting ${page.name}... (${i + 1}/${pages.length})`);
        
        // Set global PDF export mode for Fund Source Hierarchy
        let didSetPdfExportMode = false;
        if (page.path === '/fund-source-hierarchy') {
          window.__pdfExportMode = true;
          didSetPdfExportMode = true;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Navigate to the page
        navigate(page.path);
        
        // Wait for page to render
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Special handling for Fund Source Hierarchy
        let didExpand = false;
        if (page.path === '/fund-source-hierarchy' && window.__expandAllFundSourceNodes) {
          window.__expandAllFundSourceNodes();
          didExpand = true;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Find the main content area
        const contentElement = document.querySelector('main');
        if (!contentElement) {
          throw new Error(`Content element not found for ${page.name}`);
        }
        
        // Capture the page
        const canvas = await html2canvas(contentElement as HTMLElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        // Always add a new page after title page
        pdf.addPage();
        
        // Add page section header
        pdf.setFontSize(18);
        pdf.text(page.name, margin, margin + 5);
        
        // Calculate image dimensions
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Handle multi-page content for this section
        let contentStartY = margin + 15; // Starting position after section header
        
        if (contentStartY + imgHeight > pageHeight - margin) {
          // Content needs multiple pages
          let imgTop = 0;
          let imgRemaining = canvas.height;
          const imgPageHeight = (pageHeight - (margin * 2) - 15) * (canvas.width / imgWidth);
          let sectionPageCount = 0;
          
          // Process image across multiple pages
          while (imgRemaining > 0) {
            // Calculate portion of the image to render on this page
            const imgPortionHeight = Math.min(imgRemaining, imgPageHeight);
            const imgPortionHeightScaled = (imgPortionHeight / canvas.height) * imgHeight;
            
            // Create a temporary canvas for this portion
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = canvas.width;
            tmpCanvas.height = imgPortionHeight;
            const ctx = tmpCanvas.getContext('2d');
            
            if (ctx) {
              // Draw only the portion needed for this page
              ctx.drawImage(
                canvas, 
                0, imgTop, canvas.width, imgPortionHeight,
                0, 0, canvas.width, imgPortionHeight
              );
              
              // Add new page if not the first page of this section
              if (sectionPageCount > 0) {
                pdf.addPage();
                
                // Add section header on continuation pages
                pdf.setFontSize(14);
                pdf.text(`${page.name} (continued)`, margin, margin + 5);
                contentStartY = margin + 10;
              }
              
              // Add footer with page info
              pdf.setFontSize(10);
              pdf.text(`${page.name} - Page ${sectionPageCount + 1} | Generated: ${new Date().toLocaleString()}`, 
                margin, pageHeight - margin);
              
              // Add this portion to the PDF
              const imgData = tmpCanvas.toDataURL('image/png');
              pdf.addImage(imgData, 'PNG', margin, contentStartY, imgWidth, imgPortionHeightScaled);
              
              // Update tracking variables
              imgTop += imgPortionHeight;
              imgRemaining -= imgPortionHeight;
              sectionPageCount++;
            }
          }
        } else {
          // Content fits on a single page
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', margin, contentStartY, imgWidth, imgHeight);
          
          // Add footer
          pdf.setFontSize(10);
          pdf.text(`${page.name} | Generated: ${new Date().toLocaleString()}`, margin, pageHeight - margin);
        }

        // Restore Fund Source Hierarchy state
        if (didExpand && window.__restoreFundSourceNodes) {
          window.__restoreFundSourceNodes();
        }
        // Unset PDF export mode
        if (didSetPdfExportMode) {
          window.__pdfExportMode = false;
        }
      }
      
      // Save the PDF
      pdf.save('crypto-forensics-complete-report.pdf');
      
      // Navigate back to original page
      navigate(currentPath);
      
      toast.success('Complete dashboard PDF exported successfully');
    } catch (error) {
      console.error('Error exporting all pages:', error);
      toast.error('Failed to export all pages');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCurrentPage}>
          Export Current Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportAllPages}>
          Export All Pages
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/')}>
          Export Summary Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/network-analytics')}>
          Export Network Analytics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/inbound-transactions')}>
          Export Inbound Transactions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/outbound-transactions')}>
          Export Outbound Transactions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/address-attribution')}>
          Export Address Attribution
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPageByPath('/fund-source-hierarchy')}>
          Export Fund Source Hierarchy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PDFExportButton; 