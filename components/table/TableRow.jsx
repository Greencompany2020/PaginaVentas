import { useState } from "react";

const TableRow = ({ children, rowId, className }) => {
  const [active, setActive] = useState(null);

  const toggleActive = (newValue) => {
    if (newValue === active) {
      setActive(null);
    } else {
      setActive(newValue);
    }
  };

  return (
    <tr
      className={`p-1 hover:cursor-pointer ${
        active === rowId ? "bg-yellow-200" : ""
      } ${className ?? ""}`}
      onClick={() => toggleActive(rowId)}
    >
      {children}
    </tr>
  );
};

export default TableRow;
