import  { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import InvoiceTemplate from '../components/InvoiceTemplate';
import { generatePDF } from '../utils/pdfGenerator';
import { templates } from '../utils/templateRegistry';

const A4_WIDTH = 794; // px
const A4_HEIGHT = 1123; // px

const TemplatePage = () => {
  const navigate = useNavigate();
  const [currentTemplate, setCurrentTemplate] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);


  // Dynamically scale invoice preview to fit container
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        // Leave some margin (e.g., 16px)
        const availableWidth = offsetWidth - 16;
        const availableHeight = offsetHeight - 16;
        const scaleW = availableWidth / A4_WIDTH;
        const scaleH = availableHeight / A4_HEIGHT;
        setScale(Math.min(scaleW, scaleH, 1));
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTemplateChange = (templateNumber) => {
    setCurrentTemplate(templateNumber);
  };

  const handleDownloadPDF = async () => {
    if (!isDownloading) {
      setIsDownloading(true);
      try {
        await generatePDF( currentTemplate);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/');
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              "Download PDF"
            )}
          </Button>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`cursor-pointer p-4 border rounded ${
                currentTemplate === index + 1
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleTemplateChange(index + 1)}
            >
              {template.name}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Preview Container */}
      <div
        ref={containerRef}
        className="flex justify-center w-full items-center"
        style={{ height: '90vh', overflow: 'hidden', background: '#f8fafc', borderRadius: 12 }}
      >
        <div
          className="invoice-preview"
          style={{
            width: `${A4_WIDTH}px`,
            height: `${A4_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            background: 'white',
            border: '1px solid #e5e7eb',
            position: 'relative',
          }}
        >
          <InvoiceTemplate templateNumber={currentTemplate} />
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
