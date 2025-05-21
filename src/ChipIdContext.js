// ChipIdContext.js
import React, { createContext, useContext, useState } from 'react';

const ChipIdContext = createContext();

export function ChipIdProvider({ children }) {
  const [chipId, setChipId] = useState('');

  return (
    <ChipIdContext.Provider value={{ chipId, setChipId }}>
      {children}
    </ChipIdContext.Provider>
  );
}

export const useChipId = () => useContext(ChipIdContext);