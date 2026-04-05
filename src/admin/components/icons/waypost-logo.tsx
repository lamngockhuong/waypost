interface WaypostLogoProps {
  class?: string
}

export function WaypostLogo({ class: className }: WaypostLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={className}
    >
      <polyline points="2,2 5,15 9.5,5 13,15" />
      <circle cx="2" cy="2" r="1.8" fill="currentColor" opacity="0.15" stroke="none" />
      <circle cx="2" cy="2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="5" r="3" fill="currentColor" opacity="0.15" stroke="none" />
      <circle cx="9.5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M13 15 Q15.5 8 19 4.5 M16.8 5 L19 4.5 L18.5 6.7" />
      <path d="M13 15 Q16.5 10.5 20 8.5 M18 8 L20 8.5 L19 10" opacity="0.6" />
      <path d="M13 15 Q17 15.5 20 15 M18.5 13.5 L20 15 L18.5 16.5" opacity="0.35" />
    </svg>
  )
}
