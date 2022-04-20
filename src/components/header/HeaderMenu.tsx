import {
  Avatar,
  Group,
  UnstyledButton,
  Text,
  Menu,
  Button,
} from "@mantine/core"
import React, { FunctionComponent } from "react"
import { ChevronDown } from "tabler-icons-react"
import { auth } from "../../contexts/UserContext"
import { User } from "../../types/User"
import { headerStyle } from "./styles/headerStyle"

interface IProps {
  userMenuOpened: boolean
  user: User
  setUserMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderMenu: FunctionComponent<IProps> = ({
  userMenuOpened,
  user,
  setUserMenuOpened,
}) => {
  const { classes, theme, cx } = headerStyle()

  const onLogOut = () => {
    auth.signOut().catch((err) => console.log(err))
  }

  return (
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
            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
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
      <Button style={{ float: "right" }} onClick={onLogOut}>
        Wyloguj
      </Button>
    </Menu>
  )
}

export default HeaderMenu
