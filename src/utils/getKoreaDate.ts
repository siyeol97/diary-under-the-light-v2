const getKoreaDate = (date: Date) => {
  const KOREA_TIMEZONE_OFFSET = 9 * 60; // 9 hours in minutes
  const koreaDate = new Date(
    date.getTime() + KOREA_TIMEZONE_OFFSET * 60 * 1000,
  );
  return koreaDate;
};

export default getKoreaDate;
