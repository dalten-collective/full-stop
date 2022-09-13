// @ts-nocheck
import React, { useState } from 'react';
import dayjs from 'dayjs';

export function RateForm() {
    const [flowRate, setFlowrate] = useState();
    const [rateDate, setRatedate] = useState();
  
    let maxdate = dayjs()
    let mindate = dayjs().subtract(40, "days");
  
    const submitFlowrate = (timestamp) => {
      return window.api.poke({
          app: "full-stop",
          mark: "dot-point",
          json: [{ wen: timestamp, rate: {wen: rateDate, how: flowRate}}],
        }).then(() => location.reload());
    };
  
    const validateSubmission = (event) => {
      event.preventDefault();
  
      let start = true;
      let maxdateUnix = maxdate.add(1, "day").unix();
      let mindateUnix = mindate.unix();
      let timeNow = Math.floor(Date.now() / 1000);
  
      if (typeof rateDate == 'undefined') { start = false }
      if (rateDate > maxdateUnix || rateDate < mindateUnix) { start = false; }
  
      if (!start ) {
        return window.alert("you must submit a valid date for this rating, within the past 40 days")
      }
  
      return submitFlowrate(timeNow);
    }
  
    return (
      <form onSubmit={event => validateSubmission(event)}>
        <label>date:<br/>
          <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setRatedate(e.target.valueAsNumber / 1000)}/>
        </label>
        <br/>
        <label>flow rate (5 being heavy):<br/>
          <input type="range" className='border mb-3' min={1} max={5} defaultValue={3} onChange={ e => setFlowrate(e.target.valueAsNumber) }/>
        </label>
        <br/>
        <input type="submit" value="record"/>
      </form>
    )
  
  }