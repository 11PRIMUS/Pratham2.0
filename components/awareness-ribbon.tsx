import type { SVGProps } from "react"

export default function AwarenessRibbon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3c-1.432 0-2.927 1.17-3.427 1.639-.5.468-1.93 1.95-2.4 3.326-.47 1.375-.585 3.324-.585 4.035s.116 2.66.586 4.035c.47 1.376 1.9 2.858 2.4 3.326.5.469 1.995 1.639 3.427 1.639 1.432 0 2.927-1.17 3.427-1.639.5-.468 1.93-1.95 2.4-3.326.47-1.375.585-3.324.585-4.035s-.116-2.66-.586-4.035c-.47-1.376-1.9-2.858-2.4-3.326C14.928 4.17 13.432 3 12 3z" />
      <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  )
}

