export function findAndReplaceHashTag(text: string, hashtag?: string | null) {
  return text
    .replace(/#[\p{L}]+/ugi, i => {
      const h = i.replace('#', '').toLowerCase();

      if (hashtag === h) {
        return `<a class="font-weight-bold text-danger">${i}</a>`;
      }

      return `<a value="/hashtag/${h}">${i}</a>`;
    });
}
