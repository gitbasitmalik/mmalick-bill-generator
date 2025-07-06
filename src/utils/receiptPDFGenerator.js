import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateReceiptPDF = async (receiptElement) => {
  try {
    // Get the receipt element's dimensions
    const rect = receiptElement.getBoundingClientRect();

    const canvas = await html2canvas(receiptElement, {
      scale: 2, // Increase scale for better quality
      useCORS: true,
      logging: false,
      width: rect.width,
      height: rect.height,
      backgroundColor: "#ffffff", // Ensure white background
    });

    // Calculate proper dimensions for receipt (80mm width is standard)
    const receiptWidth = 100; // mm
    const aspectRatio = canvas.height / canvas.width;
    const receiptHeight = receiptWidth * aspectRatio;

    const pdf = new jsPDF({
      orientation: receiptHeight > receiptWidth ? "portrait" : "landscape",
      unit: "mm",
      format: [receiptWidth, receiptHeight],
    });

    // Add the image to fit the receipt dimensions
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      receiptWidth,
      receiptHeight
    );

    const timestamp = new Date().getTime();
    const fileName = `Receipt_${timestamp}.pdf`;

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
