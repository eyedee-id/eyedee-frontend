export function findAndReplaceHashTag(text: string) {
  return text
    .replace(/#[\p{L}]+/ugi, i => {
      return `<a href="/hashtag/${i.replace('#', '')}">${i}</a>`;
    });
}
