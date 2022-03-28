import { useState } from "react"
import { Container, Group, Tabs, Burger, Image } from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import StudentContainer from "../Student/StudentContainer"
import { ProfileForm } from "../Profile/ProfileForm"
import { User } from "../../types/User"
import MenuHeader from "./HeaderMenu"
import { useStyles } from "./styles/headerStyles"

interface HeaderTabsProps {
  user: User
  tabs: string[]
}

export const HeaderTabsColored = ({ user, tabs }: HeaderTabsProps) => {
  const { classes, theme } = useStyles()
  const [opened, toggleOpened] = useBooleanToggle(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const onChangeTab = (active: number, tabKey: string) => {
    setActiveTab(active)
    console.log("tabKey", tabKey)
  }

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Image
            radius="md"
            /* do poprawy */
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

          <MenuHeader
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
          <Tabs.Tab label="Uczniowie" tabKey="first">
            <StudentContainer />
          </Tabs.Tab>
          <Tabs.Tab label="Nauczyciele" tabKey="second">
            Nauczyciele
          </Tabs.Tab>
          <Tabs.Tab label="Zajęcia" tabKey="third">
            <ProfileForm />
          </Tabs.Tab>
        </Tabs>
      </Container>
    </div>
  )
}
