// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
// import { Charges, ChargeUpdateInitial, scryCharges } from '@urbit/api';
// import { AppTile } from './components/AppTile';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

// window.api.poke({app: "full-stop", mark: "dot-point", json: [{wen: 1661527629, flow: {wen: 1661527629}}]})

export function App() {
  // const [subscription, setSub] = useState();
  const [periods, setPeriods] = useState();

  useEffect(() => {
    async function init() {
      const getPeriods = await api.scry({
        app: "full-stop",
        path: "/moon/each",
      })
      setPeriods(getPeriods);
    }
    init();
  }, [])

  console.log(periods)

  return (
    <main>
      <table className='table-auto text-left border ml-6 my-3'>
        <thead>
          <tr>
            <th className='border pr-6'>period entry last edited</th>
            <th className='border pr-6'>start date</th>
            <th className='border pr-6'>end date</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(periods || {})
          .map((each) => {
            return(
            <tr>
              <td className='border pr-6'>{new Date(each?.flow?.edit * 1000).toLocaleString()}</td>
              <td className='border pr-6'>{new Date(each?.start * 1000).toLocaleString()}</td>
              <td className='border pr-6'>{new Date(each?.flow?.stop * 1000).toLocaleString()}</td>
            </tr>)
          })}
        </tbody>
      </table>
    </main>
    // <main>
    //   periods.forEach(e => {
    //     <p>{e.}</p>
    //   });
    //   <p>{periods[0]}</p>
    // </main>
  )
}

// export function App() {
//   const [apps, setApps] = useState<Charges>();

//   useEffect(() => {
//     async function init() {
//       const charges = (await api.scry<ChargeUpdateInitial>(scryCharges)).initial;
//       setApps(charges);
//     }

//     init();
//   }, []);

//   return (
//     <main className="flex items-center justify-center min-h-screen">
//       <div className="max-w-md space-y-6 py-20">
//         <h1 className="text-3xl font-bold">Welcome to ui</h1>
//         <p>Here&apos;s your urbit&apos;s installed apps:</p>
//         {apps && (
//           <ul className="space-y-4">
//             {Object.entries(apps).map(([desk, app]) => (
//               <li key={desk} className="flex items-center space-x-3 text-sm leading-tight">
//                 <AppTile {...app} />
//                 <div className="flex-1 text-black">
//                   <p>
//                     <strong>{app.title || desk}</strong>
//                   </p>
//                   {app.info && <p>{app.info}</p>}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </main>
//   );
// }