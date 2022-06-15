import { Flex } from "../containers";

const InputYear = ({ value, onChange }) => {
  return (
    <Flex className="mb-3">
      <label htmlFor="anio">Del Año: </label>
      <input
        type="number"
        name="delAgno"
        id="anio"
        className="select ml-2"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        min="2000"
        onChange={onChange}
      />
    </Flex>
  );
};

export default InputYear;
