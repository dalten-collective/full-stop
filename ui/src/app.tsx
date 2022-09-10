// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import dayjs from 'dayjs';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

function RateForm() {
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

function PeriodForm() {
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

function retActions(scryArray) {
  let actions = []
  let actionTemplate = (timestamp, type, obj) => { 
    return {
      wen: timestamp,
      [type]: obj
    }
  }
  let timeNow = Math.floor(Date.now() / 1000);

  for (let period of scryArray) {
    let { flow: { edit, rate, stop}, start } = period;

    actions.push(actionTemplate(timeNow++, 'flow', {wen: start}))
    actions.push(actionTemplate(timeNow++, 'stop', {wen: stop}))
    if (rate.length > 0) {
      for (let tuples of rate) {
        let [recordDate, rating] = tuples;
        actions.push(actionTemplate(timeNow++, 'rate', {wen: recordDate, how: rating}))
      }
    }
  }

  return actions
}

function retDate(v) {
  let rv = 'not recorded';
  if (v !== null) {
    rv = dayjs(v * 1000).format('DD/MM/YYYY').toString()
  }
  
  return rv;
}

function retRateString(tuples) {
  let RateString = 'not recorded'
  if (tuples.length > 0) {
    RateString = ''
    for (let pair of tuples) {
      RateString += `${retDate(pair[0])} : ${pair[1]} ; `
    }
  }

  return RateString
}

export function App() {
  const [periods, setPeriods] = useState();

  useEffect(() => {
    async function init() {
      const getPeriods = await api.scry({
        app: "full-stop",
        path: "/moon/each",
      })
      setPeriods(getPeriods);
    }
    init();
  }, [])

  if (periods != undefined) { console.log(retActions(periods)); }

  return (
    <main>
      <table className='table-auto text-left border ml-6 my-3'>
        <thead>
          <tr>
            <th className='border pr-6'>date entered</th>
            <th className='border pr-6'>period started</th>
            <th className='border pr-6'>period ended</th>
            <th className='border pr-6'>flow rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(periods || {})
          .map((each) => {
            let rateString = retRateString(each.flow.rate)

            return(
            <tr>
              <td className='border pr-6'>{ retDate(each?.flow?.edit) }</td>
              <td className='border pr-6'>{ retDate(each?.start) }</td>
              <td className='border pr-6'>{ retDate(each?.flow?.stop) }</td>
              <td className='border pr-6'>{ rateString }</td>
            </tr>)
          })}
        </tbody>
      </table>
      <p className='ml-6 my-3'>flow key: <br/> [date] : [rating] ; <br/> '1' is light, '5' is heavy </p>
      <hr/>
      <div className='ml-6 my-3 inline-flex'>
          <PeriodForm/>
          <RateForm/>
      </div>
    </main>
  )
}