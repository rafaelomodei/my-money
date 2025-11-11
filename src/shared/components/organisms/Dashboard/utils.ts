import type { ChartConfig } from '@/shared/components/ui/chart';
import type { PieChartEntry } from './CategoryExpensesChart';

type PieDatum<Key extends string> = {
  [K in Key]: string;
} & {
  value: number;
  fill: string;
  label: string;
};

const createChartConfig = (entries: PieChartEntry[]): ChartConfig => {
  const config: ChartConfig = {
    value: {
      label: 'Total',
    },
  };

  entries.forEach((entry) => {
    config[entry.id] = {
      label: entry.label,
      color: entry.color,
    };
  });

  return config;
};

const createPieDataset = <Key extends string>(
  entries: PieChartEntry[],
  nameKey: Key
): PieDatum<Key>[] => {
  return entries.map((entry) => ({
    [nameKey]: entry.id,
    value: entry.value,
    fill: `var(--color-${entry.id})`,
    label: entry.label,
  })) as PieDatum<Key>[];
};

const getChartLabel = (config: ChartConfig, key: string | number) => {
  const normalizedKey = String(key);
  const chartEntry = config[normalizedKey];

  if (!chartEntry?.label) {
    return normalizedKey;
  }

  if (typeof chartEntry.label === 'string') {
    return chartEntry.label;
  }

  if (typeof chartEntry.label === 'number') {
    return chartEntry.label.toString();
  }

  return normalizedKey;
};

export { createChartConfig, createPieDataset, getChartLabel };
