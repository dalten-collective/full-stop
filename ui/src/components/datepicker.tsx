// @ts-nocheck
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';

export default function FlowDatePicker({onDatePick}) {
    const [flowDates, setFlowDates] = useState();
    let maxdate = dayjs()
    let mindate = dayjs().subtract(40, "days");

    useEffect(() => {
        if (typeof flowDates != 'undefined') 
            onDatePick(flowDates);
    }, [flowDates])

    return(
        <>
            <Calendar maxDate={maxdate.toDate()} minDate={mindate.toDate()} selectRange onChange={setFlowDates} />
        </>
    )
}