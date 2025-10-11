import { useWeatherStore } from '@/stores/weatherStore';
import { ApiStates } from '@/types';

type ConditionTileProps = {
  title: string;
  value: number | undefined;
  units: string;
};

const ConditionTile = ({ title, value, units }: ConditionTileProps) => {
  const { apiState } = useWeatherStore();

  return (
    <div className="bg-neutral-800 rounded-2xl p-4 flex flex-col items-left">
      <span className="text-neutral-200 mb-4">{title}</span>
      <span className="text-3xl">
        {apiState === ApiStates.loading ? '-' : `${value?.toFixed(0)} ${units}`}
      </span>
    </div>
  );
};

export default ConditionTile;
