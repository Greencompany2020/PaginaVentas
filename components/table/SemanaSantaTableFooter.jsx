const SemanaSantaTableFooter = ({ ventastotal1, ventastotal2, percentage }) => {
  return (
    <tfoot className="bg-black text-white text-center font-bold">
      <tr>
        <td className="border border-white">Total</td>
        <td className="border border-white">{ventastotal1}</td>
        <td className="border border-white">{ventastotal2}</td>
        <td className="border border-white">{percentage}</td>
      </tr>
    </tfoot>
  );
};

export default SemanaSantaTableFooter;
