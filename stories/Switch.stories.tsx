import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const meta: Meta = { title: 'UI/Switch', tags: ['autodocs'] }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <Switch />,
}

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" />
      <Switch size="default" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
}
