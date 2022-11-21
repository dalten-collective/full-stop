// @ts-nocheck
import React, {useState} from "react"
import dayjs from 'dayjs'
import CalendarItem from "./components/calendarItem";

export function Overview({data}) {
    let todaysDate = dayjs();
    let monthDays = todaysDate.daysInMonth();
    let startOfMonth = todaysDate.startOf('month').day();
    let squares = [];

    let [selectedDate, setSelectedDate] = useState(todaysDate.date());
    let [spotButtonClicked, setSpotButtonClicked] = useState(false)

    squares.push(<CalendarItem key={1} day={1} offset={startOfMonth} highlight={selectedDate} onDateClicked={setSelectedDate} spotState={spotButtonClicked}/>)

    for (let i = 2; i <= monthDays; i++) {
        squares.push(<CalendarItem key={i} day={i} highlight={selectedDate} onDateClicked={setSelectedDate} spotState={spotButtonClicked}/>)
    }
    
    return (
        <main>
            <div className="justify-center max-w-2xl m-auto">
                <div className={`grid flex-col gap-3 grid-cols-7 justify-items-center`}>
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((head) => {
                        return <div key={"head " + head} className="sm:text-lg text-m font-bold">{head}</div>
                    })}
                    {squares}
                </div>
                <div className="float-right mt-3 p-3 w-12 h-12 sm:w-20 sm:h-20 bg-gray-100 hover:bg-gray-300 active:bg-gray-500" onClick={(e) => setSpotButtonClicked(spotButtonClicked => !spotButtonClicked)}/>
            </div>
        </main>
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