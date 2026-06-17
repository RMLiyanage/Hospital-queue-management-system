import { render, screen } from '@testing-library/react';
import App from './App';

test('renders patient registration header', () => {
  render(<App />);
  const headerElement = screen.getByText(/patient registration/i);
  expect(headerElement).toBeInTheDocument();
});
