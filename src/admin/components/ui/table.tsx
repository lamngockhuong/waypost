import type { ComponentChildren, JSX } from "preact"

interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  children: ComponentChildren
}

export function Table({ class: cls = "", children, ...props }: TableProps) {
  return (
    <div class="overflow-x-auto rounded-lg border border-border">
      <table class={`w-full text-sm ${cls}`} role="table" {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, ...props }: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead class="border-b border-border bg-background text-left text-xs font-semibold uppercase text-muted-fg" {...props}>{children}</thead>
}

export function TableBody({ children, ...props }: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody class="divide-y divide-border" {...props}>{children}</tbody>
}

export function TableRow({ class: cls = "", children, ...props }: JSX.HTMLAttributes<HTMLTableRowElement>) {
  return <tr class={`transition-colors hover:bg-surface-hover ${cls}`} {...props}>{children}</tr>
}

export function TableHead({ class: cls = "", children, ...props }: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return <th class={`px-4 py-3 ${cls}`} {...props}>{children}</th>
}

export function TableCell({ class: cls = "", children, ...props }: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return <td class={`px-4 py-3 ${cls}`} {...props}>{children}</td>
}
