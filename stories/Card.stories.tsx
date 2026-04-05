import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta: Meta = { title: 'UI/Card', tags: ['autodocs'] }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Next consultation</CardTitle>
        <CardDescription>Your upcoming session details</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Oct 14, 2022 · 10AM – 9PM</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Join Session</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">View all</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">3 upcoming consultations</p>
      </CardContent>
    </Card>
  ),
}

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Small card variant</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Card content goes here.</p>
      </CardContent>
    </Card>
  ),
}
