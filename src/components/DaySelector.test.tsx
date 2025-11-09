import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DaySelector from './DaySelector';
import { Days } from '@/types';

describe('DaySelector', () => {
  it('renders the DaySelector button without dropdown menu when no day is selected', () => {
    render(<DaySelector day={undefined} handleDayChange={vi.fn()} />);

    const button = screen.getByTestId('day-selector-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByAltText('Dropdown Icon')).toBeInTheDocument();
    expect(
      screen.queryByTestId('day-selector-dropdown'),
    ).not.toBeInTheDocument();
  });

  it('renders the dropdown menu when a day is selected', async () => {
    const user = userEvent.setup();
    render(<DaySelector day={Days.monday} handleDayChange={vi.fn()} />);

    const button = screen.getByTestId('day-selector-button');
    expect(button).toHaveTextContent(Days.monday);
    await user.click(button);

    const dropdown = screen.getByTestId('day-selector-dropdown');

    // Check if all days are rendered in the dropdown
    Object.values(Days).forEach(day => {
      expect(dropdown).toHaveTextContent(day);
    });
  });

  it('calls handleDayChange with the correct day when a day is clicked', async () => {
    const user = userEvent.setup();
    const handleDayChange = vi.fn();
    render(<DaySelector day={Days.monday} handleDayChange={handleDayChange} />);

    const button = screen.getByTestId('day-selector-button');
    await user.click(button);

    const tuesdayOption = screen.getByText(new RegExp(Days.tuesday, 'i'));
    await user.click(tuesdayOption);
    expect(handleDayChange).toHaveBeenCalledWith(Days.tuesday);
  });
});
