// @ts-nocheck
import React, { useState } from 'react';
import dayjs from 'dayjs';

export default function RateForm({dates = []}) {
    // const [flowRate, setFlowrate] = useState();
    // const [rateDate, setRatedate] = useState();
  
    // let maxdate = dayjs()
    // let mindate = dayjs().subtract(40, "days");
  
    // const submitFlowrate = (timestamp) => {
    //   return window.api.poke({
    //       app: "full-stop",
    //       mark: "dot-point",
    //       json: [{ wen: timestamp, rate: {wen: rateDate, how: flowRate}}],
    //     }).then(() => location.reload());
    // };
  
    return (
      <>
        <ul>{dates?.map((e) => {
          <li key={e.date}> Rating for: {e.date.format('DD/MM/YYYY')} </li>
          })}
        </ul>
      </>
      // <form onSubmit={event => validateSubmission(event)}>
      //   <label>date:<br/>
      //     <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setRatedate(e.target.valueAsNumber / 1000)}/>
      //   </label>
      //   <br/>
      //   <label>flow rate (5 being heavy):<br/>
      //     <input type="range" className='border mb-3' min={1} max={5} defaultValue={3} onChange={ e => setFlowrate(e.target.valueAsNumber) }/>
      //   </label>
      //   <br/>
      //   <input type="submit" value="record"/>
      // </form>
    )
  
}