import React, { useCallback, useEffect, useRef, useState } from "react";


interface ReportType {
  aggregate: any
  setAggregate: (newInformation) => any;
}

export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {
  const [aggregate, setAggregate] = useState<any>()


  useEffect(() => {

    if (aggregate) {
      handleChange()
    }

  }, [JSON.stringify(aggregate)])


  const handleChange = useCallback(() => {
    setAggregate(aggregate)
  }, [JSON.stringify(aggregate)])


    return (
    <AggregateContext.Provider value={{aggregate, setAggregate}}>
      {children}
    </AggregateContext.Provider>
  )
}


export default AggregateProvider;
