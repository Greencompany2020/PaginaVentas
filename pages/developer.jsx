import DateHelper from '../utils/dateHelper';
import {Formik , Form} from 'formik';
import { Input } from "../components/inputs/reportInputs";

export default function Developer() {
 
  const date = DateHelper();

  date.getYesterdayDate();
  console.log(date.getYesterdayDate());
  console.log(date.getWeekDate(date.getYesterdayDate()));

  const initial = {
    dateRange: date.getYesterdayDate(),
  }

  return(
    <Formik initialValues={initial} enableReinitialize>
      <Form>
        <Input type='date' name='dateRange' id='dateRange' label='Fecha'/>
      </Form>
    </Formik>
  )
}


