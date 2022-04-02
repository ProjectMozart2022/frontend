import * as React from "react"

const TabContext = React.createContext<
  [String, (tab: React.SetStateAction<String>) => void]
>(["uczniowie", () => {}])

export const TabProvider = TabContext.Provider

export default TabContext
