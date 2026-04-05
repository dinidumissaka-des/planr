import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'

const meta: Meta = { title: 'UI/Avatar', tags: ['autodocs'] }
export default meta
type Story = StoryObj

const src = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80'

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src={src} alt="User" />
      <AvatarFallback>JL</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['sm', 'default', 'lg'] as const).map(size => (
        <Avatar key={size} size={size}>
          <AvatarImage src={src} alt="User" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JL</AvatarFallback>
    </Avatar>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src={src} alt="User" />
      <AvatarFallback>JL</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {[src,
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      ].map((s, i) => (
        <Avatar key={i}>
          <AvatarImage src={s} alt="User" />
          <AvatarFallback>U{i}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}
