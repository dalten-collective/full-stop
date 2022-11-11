// @ts-nocheck
import React, { useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import FlowDatePicker from './datepicker';
import RateForm  from './rateform';
import RatingSlider from './ratepicker';

function reduceSubmission(state, action) {
  let newState;
  switch(action.type) {
    case 'rating': {
      let rating = action.payload.flowRating;
      let index = action.payload.dateIndex;
      let ratingsList = state.flowRatings;
      ratingsList[index].rate = rating;

      newState = {
        ...state,
        flowRatings: ratingsList
      }
      
      break;
    }
    case 'reset': {
      newState = {
        ...state,
        submit: action.payload.submit,
        noStart: action.payload.submit
      }
      break;
    }
    case 'submission': {
      let stopDate;
      let flowDate;
      if (state.flowStop != undefined) {
        stopDate = state.flowStop.unix();
      }

      if (state.flowStart != undefined) {
        flowDate = state.flowStart.unix();
      } else {
        newState = {
          ...state,
          submit: action.payload.submit,
          noStart: true
        }
        break;
      }

      newState = {
        ...state,
        flowStart: flowDate,
        flowStop: stopDate,
        submit: action.payload.submit,
      }
      break;
    }
    case 'daterange': {
      let flowDate = dayjs(action.payload.start.toDateString())
      let stopDate = dayjs(action.payload.end.toDateString())
      let ratings = action.payload.range;

      if (flowDate.isSame(stopDate, 'day')) {
        stopDate = undefined;
      }

      newState = {
        ...state,
        flowStart: flowDate,
        flowStop: stopDate,
        flowRatings: ratings,
      }

      break;
    }
  }

  return newState;
}

export function PeriodForm() {
    const initialState = {flowStart: undefined, flowStop: undefined, flowRatings: undefined, submit: false, noStart: false }
    const [flowObject, dispatch] = useReducer(reduceSubmission, initialState);

    useEffect(() => {
      if (!flowObject.submit) {
        return;
      }

      if (flowObject.noStart) {
        dispatch({type: 'reset', payload: {submit: false, noStart: false}})
        return window.alert('you must submit a date or date range within the last 40 days')
      }

      let actions = [];
      let timestamp = dayjs().unix()

      actions.push({ wen: timestamp, flow: { wen: flowObject.flowStart } });
      timestamp++;
  
      if (flowObject.flowStop != undefined) {
        actions.push({ wen: timestamp, stop: { wen: flowObject.flowStop } });
      }

      let ratings = [];

      flowObject.flowRatings.forEach((rating) => {
        if (rating.rate == null) {
          return;
        }
        timestamp++;
        ratings.push({ wen: timestamp, rate: {wen: rating.date.unix(), how: rating.rate}})
      })

      if (ratings != []) {
        actions = actions.concat(ratings);
      }

      // console.log(actions)

      return window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: actions,
      }).then(() => location.reload());
    }, [flowObject.submit])

    function handleFlowRatings(rating, index) {
      dispatch({
        type: 'rating',
        payload: {flowRating: rating, dateIndex: index}
      })
    }

    function handleFlowDates(flowDates) {
      let dateRange = []

      for (let cur = dayjs(flowDates[0]); cur.isAfter(dayjs(flowDates[1]), 'day') != true; cur = cur.add(1, 'day')) {
        dateRange.push({date: cur, rate: null})
      }

      dispatch({
        type: 'daterange',
        payload: { start: flowDates[0], end: flowDates[1], range: dateRange}
      })
    }

    function handleSubmission() {
      dispatch({
        type: 'submission',
        payload: { submit: true }
      })
    }

    return (
      <>
        <div className=''>
          <FlowDatePicker onDatePick={(v) => handleFlowDates(v)}/>
          <RateForm dates={flowObject.flowRatings} onRatingPick={(v, i) => handleFlowRatings(v, i)}/>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3' onClick={handleSubmission}>Submit</button>
        </div>
      </>
    )
  }