
import FloatingLabelInput from './FloatingLabelInput';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BillToSection = ({ billTo, handleInputChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill To</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            id="billToName"
            label="Name"
            value={billTo.name}
            onChange={handleInputChange}
            name="name"
          />
          <FloatingLabelInput
            id="billToPhone"
            label="Phone"
            value={billTo.phone}
            onChange={handleInputChange}
            name="phone"
          />
        </div>
        <FloatingLabelInput
          id="billToAddress"
          label="Address"
          value={billTo.address}
          onChange={handleInputChange}
          name="address"
        />
      </CardContent>
    </Card>
  );
};

export default BillToSection;
