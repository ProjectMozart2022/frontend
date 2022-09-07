import { Burger, Container, Group, Image, Tabs } from "@mantine/core"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { User } from "../../types/User"
import HeaderMenu from "./HeaderMenu"
import { headerStyle } from "./styles/headerStyle"

interface HeaderProps {
  user: User
  tabs?: string[]
}

export const Header = ({ user }: HeaderProps) => {
  const { classes, theme } = headerStyle()
  const { tabValue } = useParams()
  const navigate = useNavigate()
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)

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
            opened={isToggleOpen}
            onClick={() => setIsToggleOpen(!isToggleOpen)}
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
          defaultValue={tabValue}
          onTabChange={(value) => navigate(`/${value as string}`)}
          variant="outline"
          classNames={{
            root: classes.tabs,
          }}>
          <Tabs.List>
            <Tabs.Tab value="uczniowie">Uczniowie</Tabs.Tab>
            <Tabs.Tab value="nauczyciele">Nauczyciele</Tabs.Tab>
            <Tabs.Tab value="przedmioty">Przedmioty</Tabs.Tab>
            <Tabs.Tab value="lekcje">Lekcje</Tabs.Tab>
            <Tabs.Tab value="raport">Raporcik</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Container>
    </div>
  )
}
