import React, { createContext, useState } from "react";

// Provide a safe default value to avoid "value prop is required" runtime errors
export const StateContext = createContext({ deleted: false, setDeleted: () => {} });
StateContext.displayName = "StateContext";

export default function StateContextProvider({ children }) {
  const [deleted, setDeleted] = useState(false);
  return (
    <StateContext.Provider value={{ deleted, setDeleted }}>
      {children}
    </StateContext.Provider>
  );
}
