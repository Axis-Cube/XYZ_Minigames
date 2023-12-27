export function magicIt(string) {
  var hash = 0,
    i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  if (hash.length >= 10) {return hash.substr(0,7)}
  return hash;
}

//function createSell(price,id) { function magicIt(string) { var hash = 0, i, chr; if (string.length === 0) return hash; for (i = 0; i < string.length; i++) { chr = string.charCodeAt(i); hash = ((hash << 5) - hash) + chr; hash |= 0; }; if (hash.length >= 10) {return hash.substr(0,7)}; return hash; }; return magicIt(`${id}${price*Math.E}`).toString(16)}