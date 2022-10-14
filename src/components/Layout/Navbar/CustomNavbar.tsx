import { Center, Navbar, Stack, Tooltip, UnstyledButton } from "@mantine/core"
import type { TablerIcon } from "@tabler/icons"
import {
  IconAlbum,
  IconBackpack,
  IconBook,
  IconCalendarStats,
  IconFileAnalytics,
  IconLogout,
  IconSchool,
} from "@tabler/icons"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate, useParams } from "react-router"
import { authService, signOut } from "../../../services/auth"
import { useStyles } from "./styles/navbarStyle"

interface NavbarLinkProps {
  icon: TablerIcon
  label: string
  active?: boolean
  onClick?: () => void
}

const NavbarLink = ({
  icon: Icon,
  label,
  active,
  onClick,
}: NavbarLinkProps): JSX.Element => {
  const { classes, cx } = useStyles()
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const navLinks = [
  { icon: IconBackpack, label: "Uczniowie", navigate: "uczniowie" },
  { icon: IconSchool, label: "Nauczyciele", navigate: "nauczyciele" },
  {
    icon: IconBook,
    label: "Przedmioty",
    navigate: "przedmioty",
  },
  { icon: IconAlbum, label: "Lekcje", navigate: "lekcje" },
  { icon: IconFileAnalytics, label: "Raport", navigate: "raport" },
]

const CustomNavbar = (): JSX.Element => {
  const { tabValue } = useParams()
  const navigate = useNavigate()
  const [user, loading, error] = useAuthState(authService)

  useEffect(() => {
    if (loading) return
    if (!user) return navigate("/")
  }, [loading, navigate, user])

  const links = navLinks.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={tabValue === link.navigate}
      onClick={() => navigate(`/${link.navigate}`)}
    />
  ))

  return (
    <Navbar
      width={{ base: 80 }}
      p="md"
      sx={(theme) => ({
        backgroundColor: theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background,
      })}>
      <Center>
        <IconCalendarStats size={30} />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" align="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <NavbarLink
          icon={IconLogout}
          label="Wyloguj"
          onClick={async () => {
            await signOut()
          }}
        />
      </Navbar.Section>
    </Navbar>
  )
}

export default CustomNavbar
