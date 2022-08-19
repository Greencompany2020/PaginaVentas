const TableHead = ({ children }) => {
  return (
    <thead className="text-white font-bold text-center text-xs table-head table-head-rl table-head-rr">
      {children}
    </thead>
  );
};

export default TableHead;
