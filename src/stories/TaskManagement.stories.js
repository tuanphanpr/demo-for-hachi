import { expect, within } from '@storybook/test';
import TaskManagement from '../components/TaskManagement';

export default {
  title: 'TaskManagement',
  component: TaskManagement,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Normal = {
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const loginButton = canvas.getByRole('button', { name: /Submit/i });
      await expect(loginButton).toBeInTheDocument();
    },
};
