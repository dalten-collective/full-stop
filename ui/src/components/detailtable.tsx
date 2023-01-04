//@ts-nocheck
import React, { useState } from "react";
import dayjs from "dayjs";

function TableType({data, type}) {
    if (type == 'periods' || type == 'ratings') {
        return <PeriodTable type={type} periodData={data.periods}/>
    } else if (type == 'spotting') {
        return <SpottingTable spotData={data.spots}/>
    }
}

function SpottingTable({spotData}) {
    let table = Object.values(spotData || {}).map((each, index) => {
        let date = retDate(each)
        return (
            <tr key={"tablerow" + index}>
                <td className='border pr-6'>{ date }</td>
            </tr>
        )
    })

    return table;
}

function PeriodTable({periodData, type}) {
    let table = Object.values(periodData || {}).map((each, index) => {
        let rateString = retRateString(each.flow.rate)
        let editDate = retDate(each?.flow?.edit)
        let startDate = retDate(each?.start)
        let endDate = retDate(each?.flow?.stop)
        if (type == 'periods') {
            return (
                <tr key={"tablerow" + index}>
                    <td className='border pr-6'>{ editDate }</td>
                    <td className='border pr-6'>{ startDate }</td>
                    <td className='border pr-6'>{ endDate }</td>
                </tr>
            )
        } else if (type == 'ratings') {
            return (
                <tr key={"tablerow" + index}>
                    <td className='border pr-6'>{ editDate }</td>
                    <td className='border pr-6'>{ startDate } to { endDate }</td>
                    <td className='border pr-6'>{ rateString }</td>
                </tr>
            )
        }
    })

    return table;
}

function buildPeriodData(periods) {
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

function buildSpotData(spots) {
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

export function DetailTable({currentTable, data}) {
    // let [periodTable, setPeriodTable] = useState();
    // let [ratingTable, setRatingTable] = useState()
    // let [spotTable, setSpotTable] = useState();

    let detailTemplates = {
        periods: { 
            headers: ['recorded', 'flow started', 'flow ended'],
        },
        ratings: {
            headers: ['recorded', 'flow between', 'ratings'],
        },
        spotting: {
            headers: ['recorded']
        },
        sex: {
            headers: ['recorded', 'date']
        }
    }

    function setupTables() {
        let periodData = buildPeriodData(data.periods);
        // let spotData = buildSpotData(data.spots)

        let periodTable = Object.values(periodData || {}).map((each, index) => {
            return (
                <tr key={"tablerow" + index}>
                    <td className='border pr-6'>{ each.edit }</td>
                    <td className='border pr-6'>{ each.start }</td>
                    <td className='border pr-6'>{ each.end }</td>
                </tr>
            )
        })
        setPeriodTable(periodTable)

        let spotTable = Object.values(periodData || {}).map((each, index) => {
            return (
                <tr key={"tablerow" + index}>
                    <td className='border pr-6'>{ each.edit }</td>
                    <td className='border pr-6'>{ each.start } to { each.end }</td>
                    <td className='border pr-6'>{ each.rate }</td>
                </tr>
            )
        })
        setRatingTable(spotTable)
    }

    // useEffect(() => {
    //     setupTables();
    //     // setPeriodTableData(buildPeriodData(data.periods))
    //     // setSpotTableData(buildSpotData(data.spots))
    // }, [data])

    return(            
    <table className='table-auto text-left '>
    <thead>
        <tr>
            {detailTemplates[currentTable].headers.map((each, i) => {
                return <th key={'head-' + i} className="pr-6 sm:text-lg text-m font-bold">{each}</th>
            })}
        </tr>
    </thead>
    <tbody>
        <TableType data={data} type={currentTable}/>
        {/* {currentTable} */}
        {/* {() => { if (currentDetails == 'periods') {
            console.log(periodTable);
            return periodTable;
        } else if (currentDetails == 'ratings') {
            return spotTable;
        }}} */}
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
</table>)
}