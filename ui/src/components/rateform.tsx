// @ts-nocheck
import React, { useState, useEffect } from 'react';
import RatingSlider from './ratepicker';

export default function RateForm({dates = [], onRatingPick}) {
  
    // const submitFlowrate = (timestamp) => {
    //   return window.api.poke({
    //       app: "full-stop",
    //       mark: "dot-point",
    //       json: [{ wen: timestamp, rate: {wen: rateDate, how: flowRate}}],
    //     }).then(() => location.reload());
    // };
  
    return (
      <>
        <h1 className='mt-3'> Ratings: </h1>
        <ul className='ml-3'>{dates?.map((item, index) => (
          <li key={item.date}>
            Rating for {item.date.format('DD/MM/YYYY')}: <RatingSlider onRating={onRatingPick} index={index}/>
          </li>
          ))}
        </ul>
      </>
    )  
}