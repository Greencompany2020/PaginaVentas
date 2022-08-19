import Input from "../components/inputs/reportInputs/Input";
import Select from '../components/inputs/reportInputs/Select'
import Checbox from '../components/inputs/reportInputs/Checkbox'
import Radio from '../components/inputs/reportInputs/Radio';
import DateRange from '../components/inputs/reportInputs/DateRange';

import { Form, Formik } from "formik"
export default function Developer() {
  return(
    <div>
      <input type={'month'} />
     <Formik>
      <Form>
        <fieldset className="p-8 w-12">
          <DateRange
          />
        </fieldset>
        
      </Form>
     </Formik>
    </div>
  )
}


