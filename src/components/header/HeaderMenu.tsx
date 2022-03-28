import { Avatar, Group, UnstyledButton, Text, Menu } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { ChevronDown } from "tabler-icons-react"
import { User } from "../../types/User"
import { useStyles } from "./styles/headerStyles"

interface IProps {
  userMenuOpened: boolean
  user: User
  setUserMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuHeader: FunctionComponent<IProps> = ({
  userMenuOpened,
  user,
  setUserMenuOpened,
}) => {
  const { classes, theme, cx } = useStyles()

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
      null
    </Menu>
  )
}

export default MenuHeader
