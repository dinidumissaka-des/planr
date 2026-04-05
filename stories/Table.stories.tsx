import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const meta: Meta = { title: 'UI/Table', tags: ['autodocs'] }
export default meta
type Story = StoryObj

const consultations = [
  { name: 'Judith Lowe',    type: 'Architecture',   date: 'Oct 04, 2022', status: 'Ongoing' },
  { name: 'Conrad Harber',  type: 'Urban Design',   date: 'Oct 06, 2022', status: 'Ongoing' },
  { name: 'Erica Jones',    type: 'Construction',   date: 'Oct 13, 2022', status: 'Upcoming' },
  { name: 'Beth Fisher',    type: 'Interior Design', date: 'Oct 14, 2022', status: 'Upcoming' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent consultations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Consultant</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.map((c) => (
          <TableRow key={c.name}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.type}</TableCell>
            <TableCell>{c.date}</TableCell>
            <TableCell>
              <Badge variant={c.status === 'Ongoing' ? 'default' : 'outline'}>{c.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
