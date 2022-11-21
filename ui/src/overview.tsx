// @ts-nocheck
import React from "react"
import CalendarComponent from "./components/calendarcomponent";

export function Overview({data}) {
    
    return (
        <main>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Your Overview</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
                <CalendarComponent/>
            </div>
        </main>
    )
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