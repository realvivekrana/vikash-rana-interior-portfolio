// Analytics ke "aaj / kal" ka hisaab is timezone mein hota hai (Render server UTC pe chalta hai)
export const TZ = process.env.ANALYTICS_TZ || 'Asia/Kolkata';
export const DAY = 24 * 60 * 60 * 1000;

export const dayKey = (date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

const tzOffset = (date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  const asUTC = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUTC - Math.floor(date.getTime() / 1000) * 1000;
};

// Diye gaye din ki 00:00 (TZ mein) ka asli Date
export const startOfDay = (date = new Date()) => {
  const [y, m, d] = dayKey(date).split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d);
  return new Date(guess - tzOffset(new Date(guess)));
};