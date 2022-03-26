import React, { useState } from "react"
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  Image,
} from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import { ChevronDown } from "tabler-icons-react"
import StudentContainer from "./Student/StudentContainer"

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors[theme.primaryColor][6],
    borderBottom: `1px solid ${theme.colors[theme.primaryColor][6]}`,
    marginBottom: 120,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  userMenu: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  user: {
    color: theme.white,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5],
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5],
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tabControl: {
    fontWeight: 500,
    height: 38,
    color: `${theme.white} !important`,

    "&:hover": {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5],
    },
  },

  tabControlActive: {
    color: `${
      theme.colorScheme === "dark" ? theme.white : theme.black
    } !important`,
    borderColor: `${theme.colors[theme.primaryColor][6]} !important`,
  },
}))

interface HeaderTabsProps {
  user: { name: string; image: string }
  tabs: string[]
}

export const HeaderTabsColored = ({ user, tabs }: HeaderTabsProps) => {
  const { classes, theme, cx } = useStyles()
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

          <Menu
            size={260}
            placement="end"
            transition="pop-top-right"
            className={classes.userMenu}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            control={
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}>
                <Group spacing={7}>
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    radius="xl"
                    size={20}
                  />
                  <Text
                    weight={500}
                    size="sm"
                    sx={{ lineHeight: 1, color: theme.white }}
                    mr={3}>
                    {user.name}
                  </Text>
                  <ChevronDown size={12} />
                </Group>
              </UnstyledButton>
            }>
            null
          </Menu>
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
            nauczyciele
          </Tabs.Tab>
          <Tabs.Tab label="Zajęcia" tabKey="third">
            zjaecia
          </Tabs.Tab>
        </Tabs>
      </Container>
    </div>
  )
}
