// @ts-nocheck
import React, { useState } from 'react';
import dayjs from 'dayjs';

export function PeriodForm() {
    const [flowDate, setFlowdate] = useState();
    const [stopDate, setStopdate] = useState();
  
    let maxdate = dayjs()
    let mindate = dayjs().subtract(40, "days");
  
    const submitPeriod = (timestamp, pstart, pstop) => {
      let actions = []
  
      if (pstart) { 
        actions.push({ wen: timestamp, flow: { wen: flowDate } });
        timestamp++ 
      }
      
      if (pstop)  { 
        actions.push({ wen: timestamp, stop: { wen: stopDate } })
      }
  
      return window.api.poke({
          app: "full-stop",
          mark: "dot-point",
          json: actions,
        }).then(() => location.reload());
    };
  
    const validateSubmission = (event) => {
      event.preventDefault();
  
      let start = true, end = true;
      let maxdateUnix = maxdate.add(1, "day").unix();
      let mindateUnix = mindate.unix();
      let timeNow = Math.floor(Date.now() / 1000);
  
      if (typeof flowDate == 'undefined') { start = false; }
      if (typeof stopDate == 'undefined') { end = false; }
      if (flowDate > maxdateUnix || flowDate < mindateUnix) { start = false; }
      if (stopDate > maxdateUnix || stopDate < mindateUnix) { end = false; }
      if (flowDate === stopDate) { start = end = false;}
  
      if (!start && !end) {
        return window.alert("you must submit a valid start or end date within the last fourty days")
      }
  
      return submitPeriod(timeNow, start, end);
    }
  
    return (
      <form onSubmit={event => validateSubmission(event)} className='mr-6'>
        <label>period start:<br/>
          <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setFlowdate(e.target.valueAsNumber / 1000)}/>
        </label>
        <br/>
        <label>period end:<br/>
          <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setStopdate(e.target.valueAsNumber / 1000)}/>
        </label>
        <br/>
        <input type="submit" value="record"/>
      </form>
    )
  }