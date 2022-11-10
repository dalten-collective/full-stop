// @ts-nocheck
import React, { useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import FlowDatePicker from './datepicker';
import RateForm  from './rateform';

function reduceSubmission(state, action) {
  switch(action.type) {
    case 'daterange': {
      //convert to date string to guarantee both dates are 1 day behind (js quirk). add one day to both
      let flowDate = dayjs(action.payload.start.toDateString())
      let stopDate = dayjs(action.payload.end.toDateString())
      let ratings = action.payload.range;

      if (flowDate.isSame(stopDate, 'day')) {
        stopDate = undefined;
      }

      return {
        flowStart: flowDate,
        flowStop: stopDate,
        flowRatings: ratings,
      }
    }
    case 'finalize': {
      //collect all the flow ratings and put them into state. change date objects to unix timestamps
      if (state.flowStop != undefined) {
        state.flowStop = state.flowStop.unix();
      }
      if (state.flowStart != undefined) {
        state.flowStart = state.flowStart.unix();
      } 

      return state;
    }
  }
}

export function PeriodForm() {
    const initialState = {flowStart: undefined, flowStop: undefined, flowRatings: undefined }
    const [flowObject, dispatch] = useReducer(reduceSubmission, initialState);

  useEffect(() => {
    console.log(flowObject)
  }, [flowObject])

    function handleFlowRatings() {

    }

    function handleFlowDates(flowDates) {
      let dateRange = []

      for (let cur = dayjs(flowDates[0]); cur.isAfter(dayjs(flowDates[1]), 'day') != true; cur = cur.add(1, 'day')) {
        dateRange.push({date: cur, rate: null})
      }

      // setRange(dateRange);

      dispatch({
        type: 'daterange',
        payload: { start: flowDates[0], end: flowDates[1], range: dateRange}
      })
    }

    function handleSubmission() {
      dispatch({
        type: 'finalize'
      })

      if (flowObject.flowStart == undefined) {
        return window.alert('you must submit a date or date range within the last 40 days')
      }

      let actions = [];
      let timestamp = dayjs().unix()

      actions.push({ wen: timestamp, flow: { wen: flowObject.flowStart } });
      timestamp++;
  
      if (flowObject.flowStop != undefined) {
        actions.push({ wen: timestamp, stop: { wen: flowObject.flowStop } });
      }

      console.log(actions)

      return window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: actions,
      })//.then(() => location.reload());
    }

    return (
      <>
        <div className=''>
          <FlowDatePicker onDatePick={(v) => handleFlowDates(v)}/>
          <RateForm dates={flowObject.flowRatings}/>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3' onClick={handleSubmission}>Submit</button>
        </div>
      </>
    )
  }