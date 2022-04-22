import * as React from "react"

const TabContext = React.createContext<
  [string, (tab: React.SetStateAction<string>) => void]
    >(["uczniowie", () => {}])

export const TabProvider = TabContext.Provider

export default TabContext
