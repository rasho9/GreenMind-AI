type StoredEnvelope = {
  iv: number[];
  payload: number[];
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const keyStorageName = 'greenmind:session-crypto-key';
let encryptionKey: CryptoKey | null = null;

async function getKey() {
  if (encryptionKey) return encryptionKey;
  const storedKey = sessionStorage.getItem(keyStorageName);
  if (storedKey) {
    encryptionKey = await crypto.subtle.importKey(
      'jwk',
      JSON.parse(storedKey) as JsonWebKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    );
    return encryptionKey;
  }
  encryptionKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
  const exportedKey = await crypto.subtle.exportKey('jwk', encryptionKey);
  sessionStorage.setItem(keyStorageName, JSON.stringify(exportedKey));
  return encryptionKey;
}

/**
 * Encrypted, session-scoped storage for non-credential UI data. It deliberately
 * never uses localStorage and must not be used for access or refresh tokens.
 * The per-tab key permits an encrypted preference envelope to survive refreshes;
 * browser storage is never a substitute for server-managed credentials.
 */
export const secureStorage = {
  async set<T>(key: string, value: T) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      await getKey(),
      encoder.encode(JSON.stringify(value)),
    );
    const envelope: StoredEnvelope = {
      iv: Array.from(iv),
      payload: Array.from(new Uint8Array(encrypted)),
    };
    sessionStorage.setItem(key, JSON.stringify(envelope));
  },
  async get<T>(key: string): Promise<T | null> {
    const rawValue = sessionStorage.getItem(key);
    if (!rawValue) return null;
    try {
      const envelope = JSON.parse(rawValue) as StoredEnvelope;
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(envelope.iv) },
        await getKey(),
        new Uint8Array(envelope.payload),
      );
      return JSON.parse(decoder.decode(decrypted)) as T;
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key);
  },
  clearNamespace(prefix: string) {
    Array.from({ length: sessionStorage.length }, (_, index) =>
      sessionStorage.key(index),
    )
      .filter((key): key is string => Boolean(key?.startsWith(prefix)))
      .forEach((key) => sessionStorage.removeItem(key));
  },
};
