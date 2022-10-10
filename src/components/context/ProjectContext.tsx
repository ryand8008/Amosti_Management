import React, { useState } from "react";


interface ReportType {
  hello: string
}


export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {

  const hello = 'world!'
  return (
    <AggregateContext.Provider value={{hello}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;