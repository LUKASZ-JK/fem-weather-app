import { Days, type Day } from '@/types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import iconDropdown from '../assets/icon-dropdown.svg';

type DaySelectorProps = {
  day: Day | undefined;
  handleDayChange: (newDay: Day) => void;
};

const DaySelector = ({ day, handleDayChange }: DaySelectorProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="flex items-center gap-2 
            text-neutral
            text-base
            bg-neutral-600 
            hover:text-neutral
            hover:bg-neutral-600
            focus-visible:ring-0
            ">
            <span>{!day ? '-' : day}</span>
            <img src={iconDropdown} alt="Dropdown Icon" />
          </Button>
        </DropdownMenuTrigger>
        {day && (
          <DropdownMenuContent
            className="bg-neutral-800 text-neutral border-0 w-48 p-2"
            align="start">
            {Object.values(Days).map(day => (
              <DropdownMenuItem
                className="text-base data-[highlighted]:text-neutral data-[highlighted]:bg-neutral-600"
                key={day}
                onClick={() => handleDayChange(day)}>
                {day}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default DaySelector;
