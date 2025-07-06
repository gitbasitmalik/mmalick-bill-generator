import { format } from 'date-fns';
import BaseTemplate2 from './BaseTemplate2';
import { formatCurrency } from '../../utils/formatCurrency';

const calculateSubTotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

const calculateTaxAmount = (subTotal, taxPercentage) =>
  (Number(subTotal) || 0) * ((Number(taxPercentage) || 0) / 100);

const calculateGrandTotal = (subTotal, taxAmount) =>
  (Number(subTotal) || 0) + (Number(taxAmount) || 0);

const Receipt = ({ data, isPrint = false }) => {
  const { billTo = {}, invoice = {}, yourCompany = {}, cashier = '', items = [], taxPercentage = 0, notes = '', footer = '', selectedCurrency } = data || {};

  const subTotal = calculateSubTotal(items);
  const taxAmount = calculateTaxAmount(subTotal, taxPercentage);
  const total = calculateGrandTotal(subTotal, taxAmount);

  // Get current local time
  const currentTime = new Date();
  const localTime = format(currentTime, "HH:mm:ss");

  return (
    <BaseTemplate2
      width="80mm"
      height="auto"
      className="p-2"
      data={data}
      isPrint={isPrint}
    >
      <div
        className="bg-white flex flex-col min-h-full"
        style={{
          fontSize: isPrint ? "10px" : "14px",
          fontFamily: "'Courier New', Courier, monospace",
          whiteSpace: "pre-wrap",
          lineHeight: "1.2",
          width: "100%",
          maxWidth: isPrint ? "80mm" : "380px",
        }}
      >
        <div className="flex-grow">
          <div className="text-center font-bold mb-2">RECEIPT</div>
          <div className="mb-2 text-center">
            <div>{yourCompany.name || "N/A"}</div>
            <div>{yourCompany.address || "N/A"}</div>
            {yourCompany.phone && <div>{yourCompany.phone}</div>}
          </div>
          <div>Invoice: {invoice.number || "N/A"}</div>
          <div>
            Date: {invoice.date ? `${format(new Date(invoice.date), "MM/dd/yyyy")}` : "N/A"}
          </div>
          <div>Time: {localTime}</div>
          <div className="mb-2">Customer: {billTo.name || "N/A"}</div>
          <div className="mb-2">Cashier: {cashier || "N/A"}</div>
          <div className="border-t border-b py-2 mb-2">
            <div className="flex justify-between font-bold mb-2">
              <span>Item</span>
              <span>Total</span>
            </div>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div>
                  <span>{item.name || "N/A"} X {item.quantity || 0} qty</span>
                </div>
                <span>
                  {formatCurrency((Number(item.quantity) || 0) * (Number(item.amount) || 0), selectedCurrency)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subTotal, selectedCurrency)}</span>
          </div>
          {taxPercentage > 0 && (
            <div className="flex justify-between">
              <span>Tax ({taxPercentage}%):</span>
              <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>{formatCurrency(total, selectedCurrency)}</span>
          </div>
          {notes && (
            <div className="mt-4">
              <div>{notes}</div>
            </div>
          )}
        </div>
        <div className="text-center mt-4">{footer || ""}</div>
      </div>
    </BaseTemplate2>
  );
};

export default Receipt;
