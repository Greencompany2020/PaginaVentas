const SemanaSantaTableFooter = ({ ventastotal1, ventastotal2, percentage, presupuesto }) => {
  return (
    <tfoot className="bg-black text-white text-center font-bold">
      <tr>
        <td className="border border-white">Total</td>
              <td rowSpan={2} className='border border-white'>{ventastotal1}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal2}</td>
              <td rowSpan={2} className='border border-white'>{presupuesto}</td>
              <td rowSpan={2} className='border border-white'>{percentage}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal1}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal2}</td>
              <td rowSpan={2} className='border border-white'>{percentage}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal1}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal2}</td>
              <td rowSpan={2} className='border border-white'>{percentage}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal1}</td>
              <td rowSpan={2} className='border border-white'>{ventastotal2}</td>
              <td rowSpan={2} className='border border-white'>{presupuesto}</td>
              <td rowSpan={3} className='border border-white'>{percentage}</td>
        
      </tr>
    </tfoot>
  );
};

export default SemanaSantaTableFooter;
