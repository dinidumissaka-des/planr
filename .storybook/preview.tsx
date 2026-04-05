import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
          :root { --font-manrope: 'Manrope', sans-serif; }
          body { font-family: 'Manrope', sans-serif; }
        `}</style>
        <Story />
      </>
    ),
  ],
}

export default preview