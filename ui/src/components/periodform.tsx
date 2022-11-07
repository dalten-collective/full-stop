// @ts-nocheck
import React, { useReducer, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';

export function PeriodForm() {
    const [flowDates, setFlowDates] = useState();
    const [flowDatesfutz, setFutz] = useReducer();
  
    let maxdate = dayjs()
    let mindate = dayjs().subtract(40, "days");
  
    const submitPeriod = (timestamp, rangep, fstart, fstop) => {
      let actions = []
  
      actions.push({ wen: timestamp, flow: { wen: fstart } });
      timestamp++ 
      
      if (rangep == true)  { 
        actions.push({ wen: timestamp, stop: { wen: fstop } })
      }

      console.log(actions)
  
      return window.api.poke({
          app: "full-stop",
          mark: "dot-point",
          json: actions,
        })//.then(() => location.reload());
    };
  
    const validateSubmission = (event) => {
      event.preventDefault();
      let isRange = false;
      if (typeof flowDates == 'undefined') { 
        return window.alert("you must submit a date or range from within last 40 days")
      }
      console.log(flowDates)
      let flowDate = dayjs(flowDates[0])//.unix()
      let stopDate = dayjs(flowDates[1])//.unix()
      let timeNow = dayjs()
      if (flowDate.isSame(stopDate, 'day')) { flowDate = stopDate }
      if (flowDate != stopDate) { isRange = true; console.log('fired') }
  
      return submitPeriod(timeNow.unix(), isRange, flowDate.unix(), stopDate.unix());
    }
  
    return (
      <form onSubmit={event => validateSubmission(event)} className='mr-6'>
        <Calendar maxDate={maxdate.toDate()} minDate={mindate.toDate()} selectRange allowPartialRange onChange={setFlowDates}/>
        <br/>
        <input type="submit" value="record"/>
      </form>
    )
  }