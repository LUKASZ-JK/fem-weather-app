import { Days, type Day } from '@/types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
            variant="outline"
            className="flex items-center gap-2 
            text-neutral
            bg-neutral-800 
            hover:text-neutral
            hover:bg-neutral-700
            active:bg-neutral-700
            ">
            {!day ? '-' : day}
          </Button>
        </DropdownMenuTrigger>
        {day && (
          <DropdownMenuContent className="w-56" align="start">
            {Object.values(Days).map(day => (
              <DropdownMenuItem key={day} onClick={() => handleDayChange(day)}>
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
