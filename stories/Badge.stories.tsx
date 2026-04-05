import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'ghost', 'link'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Badge', variant: 'default' } }
export const Secondary: Story = { args: { children: 'Badge', variant: 'secondary' } }
export const Outline: Story = { args: { children: 'Badge', variant: 'outline' } }
export const Destructive: Story = { args: { children: 'Badge', variant: 'destructive' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

export const Labels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">Interior Design</Badge>
      <Badge variant="secondary">Architecture</Badge>
      <Badge variant="secondary">Urban Design</Badge>
      <Badge variant="outline">Construction</Badge>
    </div>
  ),
}
