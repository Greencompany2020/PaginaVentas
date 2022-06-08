import { Flex } from "../containers";

const InputYear = ({ value, onChange }) => {
  return (
    <Flex className="mb-3">
      <label htmlFor="anio">Del Año: </label>
      <input
        type="number"
        pattern="\d*"
        inputMode="numeric"
        name="delAgno"
        id=""
        className="select ml-2"
        value={value}
        min={2000}
        step={1}
        onChange={onChange}
      />
    </Flex>
  );
};

export default InputYear;
