export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function formatDateVi(dateStr?: string): string {
  if (!dateStr) return 'Không thời hạn';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getRemainingDays(endDateStr?: string): number {
  if (!endDateStr) return 999;
  const now = new Date().getTime();
  const end = new Date(endDateStr).getTime();
  if (isNaN(end)) return 999;
  const diffTime = end - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
