import React from 'react';
import Select from './Select';
import { meses } from '../../utils/data';

export default function SelectMonth(props) {
  return (
    <Select {...props}>
        {
          meses.map(mes => (
            <option value={mes.value} key={mes.text}>{mes.text}</option>
          ))
        }
    </Select>
  )
}
