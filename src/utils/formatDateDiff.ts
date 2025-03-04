export default function formatDateDiff(date: string): string {
  const dateObj = new Date(new Date(date).getTime());

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}
