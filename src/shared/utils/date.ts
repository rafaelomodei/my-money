const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatMonthAndYear = (month: number, year: number): string => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
};

const createYearRange = (baseYear: number, totalYears = 5): number[] =>
  Array.from(
    { length: totalYears },
    (_, index) => baseYear - (totalYears - 1 - index)
  );

export { formatDate, formatMonthAndYear, createYearRange };
