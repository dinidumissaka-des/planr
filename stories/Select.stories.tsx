import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select'

const meta: Meta = { title: 'UI/Select', tags: ['autodocs'] }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="architecture">Architecture</SelectItem>
        <SelectItem value="interior">Interior Design</SelectItem>
        <SelectItem value="urban">Urban Design</SelectItem>
        <SelectItem value="construction">Construction</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select consultant type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Design</SelectLabel>
          <SelectItem value="architecture">Architecture</SelectItem>
          <SelectItem value="interior">Interior Design</SelectItem>
          <SelectItem value="urban">Urban Design</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Construction</SelectLabel>
          <SelectItem value="residential">Residential</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectContent>
    </Select>
  ),
}
