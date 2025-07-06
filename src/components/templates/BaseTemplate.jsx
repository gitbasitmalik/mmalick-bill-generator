

const BaseTemplate = ({children, isPrint = false }) => {
  const printStyle = isPrint
    ? { 
        width: "210mm", 
        height: "297mm", 
        margin: "0",
        padding: "0",
        border: "none",
        boxShadow: "none"
      }
    : { 
        width: "794px", 
        height: "auto",
        minHeight: "1123px",
        margin: "0 auto"
      };
  
  return (
    <div
      className="bg-white rounded-lg shadow-lg"
      style={printStyle}
    >
      {children}
    </div>
  );
};

export default BaseTemplate;
