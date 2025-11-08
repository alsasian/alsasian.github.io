export type Encoding = 'utf8' | 'hex' | 'base64';

/**
 * Convert a string to bytes based on the specified encoding
 */
export function textToBytes(text: string, encoding: Encoding): Uint8Array {
  if (encoding === 'utf8') {
    return new TextEncoder().encode(text);
  } else if (encoding === 'hex') {
    const matches = text.replace(/\s/g, '').match(/.{1,2}/g);
    if (!matches) throw new Error('Invalid hex string');
    const arr = new Uint8Array(matches.length);
    matches.forEach((byte, i) => arr[i] = parseInt(byte, 16));
    return arr;
  } else { // base64
    const binary = atob(text);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      arr[i] = binary.charCodeAt(i);
    }
    return arr;
  }
}

/**
 * Convert bytes to a string based on the specified encoding
 */
export function bytesToText(bytes: Uint8Array, encoding: Encoding): string {
  if (encoding === 'utf8') {
    return new TextDecoder().decode(bytes);
  } else if (encoding === 'hex') {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  } else { // base64
    return btoa(String.fromCharCode(...bytes));
  }
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
