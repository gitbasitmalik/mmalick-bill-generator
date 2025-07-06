const BaseTemplate2 = ({ children, className = "", isPrint = false }) => {
  const printStyle = isPrint
    ? { 
        width: "80mm", 
        height: "auto", 
        minHeight: "auto",
        margin: "0",
        padding: "0",
        border: "none",
        boxShadow: "none"
      }
    : { 
        width: "380px", 
        height: "auto", 
        minHeight: "570px",
        margin: "0 auto"
      };
  
  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${className}`}
      style={printStyle}
    >
      {children}
    </div>
  );
};

export default BaseTemplate2;
