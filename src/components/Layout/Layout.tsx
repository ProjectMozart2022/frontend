import { AppShell } from "@mantine/core"
import CustomNavbar from "./Navbar/CustomNavbar"

const Layout = ({ children }: any) => {
  return (
    <AppShell
      padding="md"
      navbar={<CustomNavbar />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}>
      {children}
    </AppShell>
  )
}

export default Layout
