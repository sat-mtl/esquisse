import React, { createContext, useContext, useRef } from "react";

const TapAddContext = createContext({ current: null });

export function TapAddProvider({ children }) {
  const ref = useRef(null);
  return <TapAddContext.Provider value={ref}>{children}</TapAddContext.Provider>;
}

export const useTapAdd = () => useContext(TapAddContext);
