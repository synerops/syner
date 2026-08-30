import {
  ArrowSquareOut,
  Cube,
  CursorClick,
  Package,
  Pulse,
  SquaresFour,
  Stack,
  TextAa,
} from "@phosphor-icons/react"

// One source for both navigations: the sidebar on desktop, the bottom drawer on
// mobile. Every entry points at a section that exists on the page or at a real
// URL — no placeholder routes.
export const groups = [
  {
    label: "Design system",
    items: [
      { title: "Type scale", href: "#type-scale", icon: TextAa },
      { title: "Surfaces", href: "#surfaces", icon: Stack },
      { title: "Buttons", href: "#buttons", icon: CursorClick },
      { title: "Bits", href: "#bits", icon: Cube },
    ],
  },
  {
    label: "Repo",
    items: [
      { title: "Status", href: "#status", icon: Pulse },
      { title: "Tickets", href: "#tickets", icon: SquaresFour },
      { title: "Workspace", href: "#workspace", icon: Package },
    ],
  },
]

export const links = [
  { title: "GitHub", href: "https://github.com/synerops/syner", icon: ArrowSquareOut },
  {
    title: "Linear",
    href: "https://linear.app/synerops/project/syner-2478edca4427",
    icon: ArrowSquareOut,
  },
]

export const sections = groups.flatMap((g) => g.items)
