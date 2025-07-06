import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BillToSection from "../components/BillToSection";
import ShipToSection from "../components/ShipToSection";
import ItemDetails from "../components/ItemDetails";
import { formatCurrency } from "../utils/formatCurrency";
import { generateGSTNumber } from "../utils/invoiceCalculations";
import Template from "../components/templates/Template";
import { generatePDF } from "../utils/pdfGenerator";

const Index = () => {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fixed company information
  const [yourCompany] = useState({
    name: "M Malick & Sons",
    address: "57A Perrymann Farm Road, IG27LD, London",
    phone: "+44-1234-123456",
    gst: generateGSTNumber(),
  });

  const [billTo, setBillTo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [shipTo, setShipTo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [invoice, setInvoice] = useState({
    number: "",
    date: "",
    paymentDate: "",
  });

  const [items, setItems] = useState([
    { name: "", description: "", quantity: 1, amount: 0 },
  ]);

  const [taxPercentage, setTaxPercentage] = useState(0);
  const [notes, setNotes] = useState("");
  
  // Fixed currency to GBP
  const selectedCurrency = "GBP";

  // Handle input changes for BillTo
  const handleBillToChange = (e) => {
    const { name, value } = e.target;
    setBillTo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for ShipTo
  const handleShipToChange = (e) => {
    const { name, value } = e.target;
    setShipTo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${invoiceRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = async () => {
    const formData = {
      billTo,
      shipTo,
      invoice,
      yourCompany,
      items,
      taxPercentage,
      taxAmount: calculateTaxAmount(),
      subTotal: calculateSubTotal(),
      grandTotal: calculateGrandTotal(),
      notes,
      selectedCurrency,
    };

    setIsDownloading(true);
    try {
      await generatePDF(formData, Template); // Template 5
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const calculateSubTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.amount || 0), 0);
  };

  const calculateTaxAmount = () => {
    return calculateSubTotal() * (taxPercentage / 100);
  };

  const calculateGrandTotal = () => {
    return calculateSubTotal() + calculateTaxAmount();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", description: "", quantity: 1, amount: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bill Generator</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Print Bill
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              "Download PDF"
            )}
          </Button>
          <button
            onClick={() => navigate("/receipt")}
            className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
            aria-label="Switch to Receipt Generator"
          >
            <Receipt size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded border">
                <p className="text-sm text-gray-600">Name: <span className="font-medium">{yourCompany.name}</span></p>
                <p className="text-sm text-gray-600">Address: <span className="font-medium">{yourCompany.address}</span></p>
                <p className="text-sm text-gray-600">Phone: <span className="font-medium">{yourCompany.phone}</span></p>
                <p className="text-sm text-gray-600">Currency: <span className="font-medium">GBP (£)</span></p>
              </div>
            </CardContent>
          </Card> */}

          <BillToSection billTo={billTo} handleInputChange={handleBillToChange} />
          <ShipToSection shipTo={shipTo} handleInputChange={handleShipToChange} billTo={billTo} />

          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoice.number}
                    onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoice.paymentDate}
                    onChange={(e) => setInvoice({ ...invoice, paymentDate: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ItemDetails
            items={items}
            handleItemChange={handleItemChange}
            addItem={addItem}
            removeItem={removeItem}
            currencyCode={selectedCurrency}
          />

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>{formatCurrency(calculateSubTotal(), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax (%):</span>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                  className="w-24 p-2 border rounded"
                  min="0"
                  max="28"
                  step="1"
                />
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span>{formatCurrency(calculateTaxAmount(), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>{formatCurrency(calculateGrandTotal(), selectedCurrency)}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Additional notes..."
                ></textarea>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full ">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={invoiceRef} className="w-full mx-auto border shadow-lg bg-white overflow-auto max-h-[800px]" style={{ minHeight: '600px' }}>
                <Template
                  data={{
                    billTo,
                    shipTo,
                    invoice,
                    yourCompany,
                    items,
                    taxPercentage,
                    taxAmount: calculateTaxAmount(),
                    subTotal: calculateSubTotal(),
                    grandTotal: calculateGrandTotal(),
                    notes,
                    selectedCurrency,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
