export function submitEntry(entry) {
  return new Promise((resolve, reject) => {
    const delay = 400 + Math.random() * 900;
    setTimeout(() => {
      if (Math.random() < 0.08) {
        return reject(new Error('Network error, please retry'));
      }
      resolve({
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      });
    }, delay);
  });
}
