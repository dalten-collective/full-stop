// @ts-nocheck
import React, { useState, useEffect } from 'react';
import RatingSlider from './ratepicker';

export default function RateForm({dates = [], onRatingPick}) {
  
    return (
      <>
        <h1> Ratings: </h1>
        <ul>{dates?.map((item, index) => (
          <li key={item.date}>
            Rating for {item.date.format('DD/MM/YYYY')}: <RatingSlider onRating={onRatingPick} index={index}/>
          </li>
          ))}
        </ul>
      </>
    )  
}