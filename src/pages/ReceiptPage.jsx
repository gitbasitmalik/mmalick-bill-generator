import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, FileText,  Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Receipt from "../components/templates/Receipt";
import { formatCurrency } from "../utils/formatCurrency";
import { generateReceiptPDF } from "../utils/receiptPDFGenerator";
import FloatingLabelInput from "../components/FloatingLabelInput";
import ItemDetails from "../components/ItemDetails";

const generateRandomInvoiceNumber = () => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const footerOptions = [
  "Thank you for choosing us today! We hope your shopping experience was pleasant and seamless. Your satisfaction matters to us, and we look forward to serving you again soon. Keep this receipt for any returns or exchanges.",
  "Your purchase supports our community! We believe in giving back and working towards a better future. Thank you for being a part of our journey. We appreciate your trust and hope to see you again soon.",
  "We value your feedback! Help us improve by sharing your thoughts on the text message survey link. Your opinions help us serve you better and improve your shopping experience. Thank you for shopping with us!",
  "Did you know you can save more with our loyalty program? Ask about it on your next visit and earn points on every purchase. It's our way of saying thank you for being a loyal customer. See you next time!",
  "Need assistance with your purchase? We're here to help! Reach out to our customer support, or visit our website for more information. We're committed to providing you with the best service possible.",
  "Keep this receipt for returns or exchanges.",
  "Every purchase makes a difference! We are dedicated to eco-friendly practices and sustainability. Thank you for supporting a greener planet with us. Together, we can build a better tomorrow.",
  "Have a great day!",
  "Thank you for shopping with us today. Did you know you can return or exchange your items within 30 days with this receipt? We want to ensure that you're happy with your purchase, so don't hesitate to come back if you need assistance.",
  "Eco-friendly business. This receipt is recyclable.",
  "We hope you enjoyed your shopping experience! Remember, for every friend you refer, you can earn exclusive rewards. Visit www.example.com/refer for more details. We look forward to welcoming you back soon!",
  "Thank you for choosing us! We appreciate your business and look forward to serving you again. Keep this receipt for any future inquiries or returns.",
  "Your purchase supports local businesses and helps us continue our mission. Thank you for being a valued customer. We hope to see you again soon!",
  "We hope you had a great shopping experience today. If you have any feedback, please share it with us on our website. We are always here to assist you.",
  "Thank you for your visit! Remember, we offer exclusive discounts to returning customers. Check your email for special offers on your next purchase.",
  "Your satisfaction is our top priority. If you need any help or have questions about your purchase, don't hesitate to contact us. Have a great day!",
  "We love our customers! Thank you for supporting our business. Follow us on social media for updates on promotions and new products. See you next time!",
  "Every purchase counts! We are committed to making a positive impact, and your support helps us achieve our goals. Thank you for shopping with us today!",
  "We hope you found everything you needed. If not, please let us know so we can improve your experience. Your feedback helps us serve you better. Thank you!",
  "Thank you for visiting! Did you know you can save more with our rewards program? Ask about it during your next visit and start earning points today!",
  "We appreciate your trust in us. If you ever need assistance with your order, please visit our website or call customer service. We're here to help!",
];

const ReceiptPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const [billTo, setBillTo] = useState({ name: "", address: "", phone: "" });
  const [invoice, setInvoice] = useState({
    date: "",
    number: generateRandomInvoiceNumber(),
  });
  
  // Fixed company information - not changeable
  const yourCompany = {
    name: "M Malick & Sons",
    address: "57A Perrymann Farm Road, IG27LD, London",
    phone: "+44-7455-859170",
    gst: "",
  };
  
  // Fixed cashier name - not changeable
  const cashier = "Kashif Ur Rehman Malik";
  
  const [items, setItems] = useState([
    { name: "", description: "", quantity: 0, amount: 0, total: 0 },
  ]);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [notes, setNotes] = useState("");
  const [footer, setFooter] = useState("Thank you");
  
  // Fixed currency - GBP only
  const selectedCurrency = "GBP";

  const refreshFooter = () => {
    const randomIndex = Math.floor(Math.random() * footerOptions.length);
    setFooter(footerOptions[randomIndex]);
  };

  const handlePrint = () => {
    window.print();
  };


  const handleDownloadPDF = async () => {
    if (!isDownloading && receiptRef.current) {
      setIsDownloading(true);
      const receiptData = {
        billTo,
        invoice,
        yourCompany,
        cashier,
        items,
        taxPercentage,
        notes,
        footer,
        selectedCurrency,
      };
      try {
        await generateReceiptPDF(receiptRef.current, "Receipt1", receiptData);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity" || field === "amount") {
      newItems[index][field] = Number(value) || 0;
      newItems[index].total = (Number(newItems[index].quantity) || 0) * (Number(newItems[index].amount) || 0);
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubTotal = () => {
    return items.reduce((sum, item) => {
      const total = Number(item.total) || 0;
      return sum + total;
    }, 0).toFixed(2);
  };

  const calculateTaxAmount = () => {
    const subTotal = parseFloat(calculateSubTotal()) || 0;
    const tax = Number(taxPercentage) || 0;
    return (subTotal * (tax / 100)).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const subTotal = parseFloat(calculateSubTotal()) || 0;
    const taxAmount = parseFloat(calculateTaxAmount()) || 0;
    return (subTotal + taxAmount).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Receipt Generator</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Print Receipt
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
              "Download Receipt PDF"
            )}
          </Button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
            aria-label="Switch to Bill Generator"
          >
            <FileText size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="receipt-page-form w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <form>
            {/* <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="text-sm text-gray-600">Name: <span className="font-medium">{yourCompany.name}</span></p>
                  <p className="text-sm text-gray-600">Phone: <span className="font-medium">{yourCompany.phone}</span></p>
                  <p className="text-sm text-gray-600">Address: <span className="font-medium">{yourCompany.address}</span></p>
                  <p className="text-sm text-gray-600">Currency: <span className="font-medium">GBP (£)</span></p>
                  <p className="text-sm text-gray-600">Cashier: <span className="font-medium">{cashier}</span></p>
                </div>
              </div>
            </div> */}

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
              <FloatingLabelInput
                id="billTo"
                label="Customer Name"
                value={billTo.name}
                onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
                name="name"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Invoice Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="invoiceNumber"
                  label="Invoice Number"
                  value={invoice.number}
                  onChange={handleInputChange(setInvoice)}
                  name="number"
                />
                <FloatingLabelInput
                  id="invoiceDate"
                  label="Invoice Date"
                  type="date"
                  value={invoice.date}
                  onChange={handleInputChange(setInvoice)}
                  name="date"
                />
              </div>
            </div>

            <ItemDetails
              items={items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Totals</h3>
              <div className="flex justify-between mb-2">
                <span>Sub Total:</span>
                <span>{formatCurrency(parseFloat(calculateSubTotal()), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (%):</span>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) =>
                    setTaxPercentage(parseFloat(e.target.value) || 0)
                  }
                  className="w-24 p-2 border rounded"
                  min="0"
                  max="28"
                  step="1"
                />
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax Amount:</span>
                <span>{formatCurrency(parseFloat(calculateTaxAmount()), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Grand Total:</span>
                <span>{formatCurrency(parseFloat(calculateGrandTotal()), selectedCurrency)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">Footer</h3>
                <button
                  type="button"
                  onClick={refreshFooter}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                  title="Refresh footer"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <textarea
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="w-full p-2 border rounded"
                rows="2"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="receipt-page-preview w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Receipt Preview</h2>
          <div className="receipt-preview-container">
            <div ref={receiptRef} className="receipt-preview">
              <Receipt
                data={{
                  billTo,
                  invoice,
                  yourCompany,
                  cashier,
                  items,
                  taxPercentage,
                  notes,
                  footer,
                  selectedCurrency,
                  
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
