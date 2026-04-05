import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/ui/button'
import { MessageCircle, CalendarCheck } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'inverted', 'secondary-inverted'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xs', 'icon', 'icon-sm', 'icon-xs', 'icon-lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Button', variant: 'default' },
}

export const Secondary: Story = {
  args: { children: 'Button', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Button', variant: 'outline' },
}

export const Ghost: Story = {
  args: { children: 'Button', variant: 'ghost' },
}

export const Destructive: Story = {
  args: { children: 'Button', variant: 'destructive' },
}

export const Link: Story = {
  args: { children: 'Button', variant: 'link' },
}

export const Inverted: Story = {
  decorators: [
    (Story) => (
      <div className="bg-primary p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
  args: { children: 'Ask a Question', variant: 'inverted' },
}

export const SecondaryInverted: Story = {
  name: 'Secondary Inverted',
  decorators: [
    (Story) => (
      <div className="bg-primary p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
  args: { children: 'Book Consultation', variant: 'secondary-inverted' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button><MessageCircle className="w-4 h-4" /> Ask a Question</Button>
      <Button variant="secondary-inverted" className="bg-primary"><CalendarCheck className="w-4 h-4" /> Book Consultation</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-3 bg-primary p-6 rounded-xl">
        <Button variant="inverted">Inverted</Button>
        <Button variant="secondary-inverted">Secondary Inverted</Button>
      </div>
    </div>
  ),
}
