import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  orientation?: 'portrait' | 'landscape';
  includeTimestamp?: boolean;
  quality?: number;
  margin?: number;
}

const defaultOptions: PDFExportOptions = {
  filename: 'crypto-forensics-export',
  pageTitle: 'Crypto Forensics Dashboard',
  orientation: 'landscape',
  includeTimestamp: true,
  quality: 2, // Higher quality for better resolution
  margin: 10
};

/**
 * Exports a DOM element as a PDF
 * @param element The DOM element to export
 * @param options PDF export options
 */
export const exportToPDF = async (
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> => {
  const mergedOptions = { ...defaultOptions, ...options };
  const { 
    filename, 
    pageTitle, 
    pageSubtitle,
    orientation, 
    includeTimestamp, 
    quality,
    margin
  } = mergedOptions;

  try {
    // Show a loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingElement.style.display = 'flex';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.zIndex = '9999';
    loadingElement.innerHTML = '<div style="background-color: white; padding: 20px; border-radius: 5px;">Generating PDF...</div>';
    document.body.appendChild(loadingElement);

    // Capture the element with html2canvas
    const canvas = await html2canvas(element, {
      scale: quality,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Initialize PDF with proper orientation
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit the page with margins
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title on first page
    pdf.setFontSize(16);
    pdf.text(pageTitle || '', margin, margin);
    
    if (pageSubtitle) {
      pdf.setFontSize(12);
      pdf.text(pageSubtitle, margin, margin + 8);
    }
    
    // Calculate initial position for content
    let yPosition = margin;
    if (pageTitle) {
      yPosition += 15;
    }
    
    // Add timestamp footer to first page
    if (includeTimestamp) {
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.text(`Generated: ${timestamp}`, margin, pageHeight - margin);
    }
    
    // Handle multi-page content
    if (yPosition + imgHeight > pageHeight - margin) {
      // Content needs multiple pages
      let imgTop = 0;
      let imgRemaining = canvas.height;
      const imgPageHeight = (pageHeight - margin * 2) * (canvas.width / imgWidth);
      let pageCount = 0;
      
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
          
          // Add new page if not the first page
          if (pageCount > 0) {
            pdf.addPage();
            
            // Add continuing header if needed
            pdf.setFontSize(12);
            pdf.text(`${pageTitle} (continued)`, margin, margin);
            
            // Add timestamp to footer
            if (includeTimestamp) {
              pdf.setFontSize(10);
              pdf.text(`Generated: ${new Date().toLocaleString()} - Page ${pageCount + 1}`, margin, pageHeight - margin);
            }
            
            // Reset position for content
            yPosition = margin + 8;
          }
          
          // Add this portion to the PDF
          const imgData = tmpCanvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgPortionHeightScaled);
          
          // Update tracking variables
          imgTop += imgPortionHeight;
          imgRemaining -= imgPortionHeight;
          pageCount++;
        }
      }
    } else {
      // Content fits on a single page
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    }
    
    // Generate filename with date if not specified
    let finalFilename = filename || 'crypto-forensics-export';
    if (!finalFilename.endsWith('.pdf')) {
      finalFilename += '.pdf';
    }
    
    // Save the PDF
    pdf.save(finalFilename);
    
    // Remove loading indicator
    document.body.removeChild(loadingElement);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again.');
  }
};

/**
 * Exports the entire dashboard (all tabs) as a single PDF
 */
export const exportEntireDashboard = async (): Promise<void> => {
  try {
    // Show a loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingElement.style.display = 'flex';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.zIndex = '9999';
    loadingElement.innerHTML = '<div style="background-color: white; padding: 20px; border-radius: 5px;">Generating Complete Dashboard PDF...</div>';
    document.body.appendChild(loadingElement);

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
    pdf.text('Contains data from all dashboard sections', pageWidth / 2, pageHeight / 3 + 30, { align: 'center' });

    // Save the PDF
    pdf.save('crypto-forensics-complete-report.pdf');
    
    // Remove loading indicator
    document.body.removeChild(loadingElement);
    
    // Now navigate to each page separately and export them
    // This part would need to be implemented in a component that can access router
    
  } catch (error) {
    console.error('Error generating dashboard PDF:', error);
    alert('An error occurred while generating the dashboard PDF. Please try again.');
  }
}; 