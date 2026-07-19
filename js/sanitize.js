export function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  const htmlRegExp = /[&<>"']/g;
  return htmlRegExp.test(str)
    ? str.replace(htmlRegExp, (char) => {
        switch (char) {
          case '&': return '&amp;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#x27;';
          default: return char;
        }
      })
    : str;
}
