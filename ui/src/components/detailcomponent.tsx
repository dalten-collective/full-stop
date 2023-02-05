//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { DetailPicker } from './detailpicker';
import { DetailTable } from './detailtable';

export function DetailComponent({ data }) {
  let [currentDetails, setCurrentDetails] = useState('periods');

  function handleSelection(value) {
    setCurrentDetails(value);
  }

  return (
    <div>
      <DetailPicker
        currentSelection={currentDetails}
        handleNewSelection={handleSelection}
      />
      <DetailTable currentTable={currentDetails} data={data} />
    </div>
  );
}
