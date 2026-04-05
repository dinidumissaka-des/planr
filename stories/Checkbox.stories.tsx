import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const meta: Meta = { title: 'UI/Checkbox', tags: ['autodocs'] }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <Checkbox />,
}

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="d1" disabled />
        <Label htmlFor="d1">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="d2" disabled defaultChecked />
        <Label htmlFor="d2">Disabled checked</Label>
      </div>
    </div>
  ),
}
