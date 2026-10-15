import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Captures a DOM element and downloads it as a PDF.
 *
 * @param {HTMLElement} element  - The DOM node to capture
 * @param {string}      filename - Output filename (without .pdf)
 * @param {object}      options  - Optional tweaks
 */
export const downloadElementAsPdf = async (element, filename = 'download', options = {}) => {
    if (!element) {
        console.error('downloadElementAsPdf: no element provided');
        return;
    }

    const {
        scale = 2,                 // higher = sharper, larger file
        orientation = 'portrait',  // 'portrait' | 'landscape'
        format = 'a4',
        margin = 10,               // mm around the page
        backgroundColor = '#ffffff',
    } = options;

    try {
        // 1. Rasterize the DOM node to a canvas
        const canvas = await html2canvas(element, {
        scale,
        useCORS: true,           // allow cross-origin images
        backgroundColor,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');

        // 2. Create the PDF
        const pdf = new jsPDF({ orientation, unit: 'mm', format });

        const pageWidth  = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const usableWidth  = pageWidth  - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        // Scale image to fit width
        const imgWidth  = usableWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // 3. Handle multi-page content
        let heightLeft = imgHeight;
        let position   = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;

        while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
        }

        // 4. Save
        pdf.save(`${filename}.pdf`);
    } catch (err) {
        console.error('Failed to generate PDF:', err);
        throw err;
    }
};