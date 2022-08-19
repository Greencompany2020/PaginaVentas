import React from 'react';
import AccessParameterList from '../../components/profile/AccessParameterList';
import { useSelector, useDispatch } from 'react-redux';
import { setParameters } from '../../redux/reducers/parametersSlice';

export default function ParameterContainers(props) {
    const {access, parameters} = useSelector(state => state);
    const dispatch = useDispatch();
    const refreshParams = (newParams) => dispatch(setParameters(newParams))

    return <AccessParameterList items={access} parameters = {parameters} refreshParams={refreshParams}/>
}
