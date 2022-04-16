import { useState, useContext } from "react"
import { Container, Group, Tabs, Burger, Image } from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import { User } from "../../types/User"
import HeaderMenu from "./HeaderMenu"
import { useStyles } from "./styles/headerStyles"
import TabContext from "../../contexts/TabContext"

interface HeaderTabsProps {
  user: User
  tabs?: string[]
}

export const HeaderTabsColored = ({ user, tabs }: HeaderTabsProps) => {
  const { classes, theme } = useStyles()
  const [opened, toggleOpened] = useBooleanToggle(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [, setTab] = useContext(TabContext)
  const onChangeTab = (active: number, tabKey: string) => {
    setActiveTab(active)
    setTab(tabKey)
  }

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Image
            radius="md"
            src="https://www.muzyczna-sosnowa.pl/wp-content/uploads/2016/09/logo_1-2.png"
            alt="Random unsplash image"
          />

          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
            color={theme.white}
          />

          <HeaderMenu
            user={user}
            userMenuOpened={userMenuOpened}
            setUserMenuOpened={setUserMenuOpened}
          />
        </Group>
      </Container>

      <Container>
        <Tabs
          active={activeTab}
          onTabChange={onChangeTab}
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsListWrapper: classes.tabsList,
            tabControl: classes.tabControl,
            tabActive: classes.tabControlActive,
          }}>
          <Tabs.Tab label="Uczniowie" tabKey="uczniowie" />
          <Tabs.Tab label="Nauczyciele" tabKey="nauczyciele" />
          <Tabs.Tab label="Profile" tabKey="profile" />
        </Tabs>
      </Container>
    </div>
  )
}
