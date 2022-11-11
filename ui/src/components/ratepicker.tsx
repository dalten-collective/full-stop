// @ts-nocheck
import React, { useEffect, useState } from 'react';

export default function RatingSlider({onRating, index}) {
    const [flowRating, setFlowRating] = useState();

    useEffect(() => {
        if (typeof flowRating != 'undefined'){
            onRating(flowRating, index);
        }
    }, [flowRating])

    return(
        <>
            <input type='range' min={1} max={5} defaultValue={3} onChange={e => setFlowRating(e.target.valueAsNumber)}></input>
        </>
    )
}