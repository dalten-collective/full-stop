// @ts-nocheck
import React from "react"
import dayjs from 'dayjs'
import CalendarItem from "./components/calendarItem";

export function Overview({data}) {
    let todaysDate = dayjs();
    let todaysDay = todaysDate.get('day')
    let monthDays = todaysDate.daysInMonth();
    let startOfMonth = todaysDate.startOf('month').day();
    let squares = [];
    for (let i = startOfMonth; i > 1; i--) {
        squares.push(<div key={"pad " + i}></div>)
    }

    for (let i = 1, todayp = false; i <= monthDays + 1; i++) {
        if (i == todaysDay) { todayp = true } else { todayp = false}
        squares.push(<CalendarItem key={i} day={i} current={todayp}/>)
    }

    return (
        <main>
            <div className="justify-center max-w-2xl m-auto">
                <div className="grid justify-items-center gap-3 grid-cols-7">
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((head) => {
                        return <div key={"head " + head} className="text-lg font-bold">{head}</div>
                    })}
                    {squares}
                </div>
            </div>
        </main>
        // <main>
        //     <h1>"fuck"</h1>
        //     <h2>data:</h2>
        //     <p>{}</p>
        // </main>
    );
}
// function buildFlowCells(periods) {
//     if (periods === undefined) {
//       return
//     }
  
//     let flowCells = []
  
//     Object.values(periods || {})
//           .map((each) => {
//             let rateString = retRateString(each.flow.rate)
//             let editDate = retDate(each?.flow?.edit)
//             let startDate = retDate(each?.start)
//             let endDate = retDate(each?.flow?.stop)
//             flowCells.push({start: startDate, end: endDate, edit: editDate, rate: rateString})
//           })
  
//     return flowCells;
//   }
  
//   function retDate(v) {
//     let rv = 'not recorded';
//     if (v !== null) {
//       rv = dayjs.unix(v).format('DD/MM/YYYY')
//     }
    
//     return rv;
//   }
  
//   function retRateString(tuples) {
//     let RateString = 'not recorded'
//     if (tuples.length > 0) {
//       RateString = ''
//       for (let pair of tuples) {
//         RateString += `${retDate(pair[0])} : ${pair[1]} ; `
//       }
//     }
  
//     return RateString
//   }

// return (
//     <main>
//       <div className='justify-center flex'>
//         <PeriodForm/>
//       </div>
//       <table className='table-auto text-left border ml-6 my-3'>
//         <thead>
//           <tr>
//             <th className='border pr-6'>date entered</th>
//             <th className='border pr-6'>period started</th>
//             <th className='border pr-6'>period ended</th>
//             <th className='border pr-6'>flow rate</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.values(flowcells || {})
//           .map((each, index) => {
//             return (
//               <tr key={"tablerow" + index}>
//                 <td className='border pr-6'>{ each?.edit }</td>
//                 <td className='border pr-6'>{ each?.start }</td>
//                 <td className='border pr-6'>{ each?.end }</td>
//                 <td className='border pr-6'>{ each?.rate }</td>
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>
//       <p className='ml-6 my-3'>flow key: <br/> [date] : [rating] ; <br/> '1' is light, '5' is heavy </p>
//       <hr/>
//     </main>
//   )