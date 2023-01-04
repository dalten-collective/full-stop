//@ts-nocheck
import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
import { DetailPicker } from "./detailpicker";

function buildPeriodCells(periods) {
    if (periods === undefined) {
      return
    }
  
    let flowCells = []
  
    Object.values(periods || {})
          .map((each) => {
            let rateString = retRateString(each.flow.rate)
            let editDate = retDate(each?.flow?.edit)
            let startDate = retDate(each?.start)
            let endDate = retDate(each?.flow?.stop)
            flowCells.push({start: startDate, end: endDate, edit: editDate, rate: rateString})
          })
  
    return flowCells;
  }

function buildSpotCells(spots) {
    if (spots === undefined) {
        return
    }

    let spotCells = []
    Object.values(spots || {})
          .map((each) => {
            spotCells.push(retDate(each));
          })
    return spotCells;
}
  
  function retDate(v) {
    let rv = 'not recorded';
    if (v !== null) {
      rv = dayjs.unix(v).format('DD/MM/YYYY')
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

export function DetailComponent({data}) {
    let [periodTablecells, setPeriodTable] = useState([]);
    let [spotTablecells, setSpotTable] = useState([]);
    let [currentDetails, setCurrentDetails] = useState('periods')

    function handleSelection(value) {
        setCurrentDetails(value);
    }

    let detailTemplates = {
        periods: { 
            headers: ['recorded', 'flow started', 'flow ended'],
            // fields: ['edit', 'start', 'end']
        },
        ratings: {
            headers: ['recorded', 'flow between', 'ratings'],
            // fields: ['edit', 'start', 'end', 'rate']
        },
        spotting: {
            headers: ['recorded spot']
        },
        sex: {
            headers: ['recorded', 'date']
        }
    }

    useEffect(() => {
        setPeriodTable(buildPeriodCells(data.periods))
        setSpotTable(buildSpotCells(data.spots))
    }, [data])

    return (
        <div>
            <DetailPicker currentSelection={currentDetails} handleNewSelection={handleSelection}/>
            <table className='table-auto text-left '>
                <thead>
                    <tr>
                        {detailTemplates[currentDetails].headers.map((each, i) => {
                            return <th key={'head-' + i} className="pr-6 sm:text-lg text-m font-bold">{each}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* {Object.values(periodTablecells || {})
                    .map((each, index) => {
                        if (currentDetails == 'periods') {
                            return (
                                <tr key={"tablerow" + index}>
                                    <td className='border pr-6'>{ each.edit }</td>
                                    <td className='border pr-6'>{ each.start }</td>
                                    <td className='border pr-6'>{ each.end }</td>
                                </tr>
                            )
                        } else if (currentDetails == 'ratings') {
                            return (
                                <tr key={"tablerow" + index}>
                                    <td className='border pr-6'>{ each.edit }</td>
                                    <td className='border pr-6'>{ each.start } to { each.end }</td>
                                    <td className='border pr-6'>{ each.rate }</td>
                                </tr>
                            )
                        } else if (currentDetails == 'spotting') {
                            return (
                                <tr key={"tablerow" + index}>
                                    <td className='border pr-6'>{index}</td>
                                    <td className='border pr-6'>{index}</td>
                                </tr>
                            )
                        }
                    })} */}
                </tbody>
            </table>
        </div>
    )
}