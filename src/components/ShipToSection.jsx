
import { useState } from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShipToSection = ({ shipTo, handleInputChange, billTo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyBillToShip, setCopyBillToShip] = useState(false);

  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const handleCopyBillToShip = (e) => {
    setCopyBillToShip(e.target.checked);
    if (e.target.checked) {
      handleInputChange({ target: { name: 'name', value: billTo.name } });
      handleInputChange({ target: { name: 'address', value: billTo.address } });
      handleInputChange({ target: { name: 'phone', value: billTo.phone } });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ship To</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="copyBillToShip"
                checked={copyBillToShip}
                onChange={handleCopyBillToShip}
                className="mr-2"
              />
              <label htmlFor="copyBillToShip" className="text-sm">Same as Bill To</label>
            </div>
            <button onClick={(e) => toggleExpand(e)} className="focus:outline-none">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="shipToName"
              label="Name"
              value={shipTo.name}
              onChange={handleInputChange}
              name="name"
            />
            <FloatingLabelInput
              id="shipToPhone"
              label="Phone"
              value={shipTo.phone}
              onChange={handleInputChange}
              name="phone"
            />
          </div>
          <FloatingLabelInput
            id="shipToAddress"
            label="Address"
            value={shipTo.address}
            onChange={handleInputChange}
            name="address"
          />
        </CardContent>
      )}
    </Card>
  );
};

export default ShipToSection;
