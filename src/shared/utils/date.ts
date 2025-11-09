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

export { formatDate, formatMonthAndYear };
