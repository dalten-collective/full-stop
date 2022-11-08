// @ts-nocheck
import React, { useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import FlowDatePicker from './datepicker';

function reduceSubmission(state, action) {
  switch(action.type) {
    case 'daterange': {
      let flowDate = dayjs(action.payload[0])
      let stopDate = dayjs(action.payload[1])

      if (flowDate.isSame(stopDate, 'day')) {
        state.flowStart = flowDate
        state.flowStop = undefined
      } else {
        state.flowStart = flowDate
        state.flowStop = stopDate
      }

      return state;
    }
    case 'finalize': {
      //collect all the flow ratings and put them into state. change date objects to unix timestamps. etc anything wrong we fall thru
      state.timeNow = dayjs().unix()
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

// const submitPeriod = (timestamp, rangep, fstart, fstop) => {
//   let actions = []

//   actions.push({ wen: timestamp, flow: { wen: fstart } });
//   timestamp++ 
  
//   if (rangep == true)  { 
//     actions.push({ wen: timestamp, stop: { wen: fstop } })
//   }

//   console.log(actions)

//   return window.api.poke({
//       app: "full-stop",
//       mark: "dot-point",
//       json: actions,
//     })//.then(() => location.reload());
// };

export function PeriodForm() {
    const initialValue = {flowStart: undefined, flowStop: undefined, flowRatings: undefined, timeNow: undefined}
    const [flowObject, dispatch] = useReducer(reduceSubmission, initialValue);

    function handleFlowDates(flowDates) {
      dispatch({
        type: 'daterange',
        payload: flowDates
      })
    }

    function handleSubmission() {
      dispatch({
        type: 'finalize'
      })

      if (flowObject.flowStart == undefined) {
        return window.alert('you must submit a date or date range within the last 40 days')
      }

      console.log(flowObject)
    }

    return (
      <>
        <div className='flex-wrap'>
          <FlowDatePicker onDatePick={(v) => handleFlowDates(v)}/>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3' onClick={handleSubmission}>Submit</button>
          <button onClick={() => console.log(flowObject)}>whats the flow object</button>
        </div>
        <br/>
      </>
    )
  }