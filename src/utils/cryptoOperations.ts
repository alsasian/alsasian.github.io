/**
 * Hash data using the specified algorithm
 */
export async function hashData(
  data: Uint8Array,
  algorithm: string
): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data as BufferSource);
  return new Uint8Array(hashBuffer);
}

export interface EncryptResult {
  encrypted: Uint8Array;
  key: Uint8Array;
  iv: Uint8Array;
}

/**
 * Encrypt data using AES-GCM
 * If key or iv are not provided, they will be generated randomly
 */
export async function encryptAES(
  data: Uint8Array,
  key?: Uint8Array,
  iv?: Uint8Array
): Promise<EncryptResult> {
  let cryptoKey: CryptoKey;
  let keyBytes: Uint8Array;

  if (key) {
    if (key.length !== 32) {
      throw new Error('Key must be 32 bytes (256 bits) for AES-256');
    }
    keyBytes = key;
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes as BufferSource,
      { name: 'AES-GCM' },
      true,
      ['encrypt']
    );
  } else {
    cryptoKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exportedKey = await crypto.subtle.exportKey('raw', cryptoKey);
    keyBytes = new Uint8Array(exportedKey);
  }

  let ivBytes: Uint8Array;
  if (iv) {
    if (iv.length !== 12) {
      throw new Error('IV must be 12 bytes for AES-GCM');
    }
    ivBytes = iv;
  } else {
    ivBytes = crypto.getRandomValues(new Uint8Array(12));
  }

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes as BufferSource },
    cryptoKey,
    data as BufferSource
  );

  return {
    encrypted: new Uint8Array(encrypted),
    key: keyBytes,
    iv: ivBytes
  };
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptAES(
  encrypted: Uint8Array,
  key: Uint8Array,
  iv: Uint8Array
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    cryptoKey,
    encrypted as BufferSource
  );

  return new Uint8Array(decrypted);
}

export interface SignResult {
  signature: Uint8Array;
  publicKey?: Uint8Array;
}

/**
 * Sign data using ECDSA
 * If privateKey is not provided, a new key pair will be generated
 */
export async function signData(
  data: Uint8Array,
  privateKey?: Uint8Array
): Promise<SignResult> {
  let cryptoPrivateKey: CryptoKey;
  let publicKeyBytes: Uint8Array | undefined;

  if (privateKey) {
    cryptoPrivateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKey as BufferSource,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign']
    );
    // For imported private key, we don't export public key
    publicKeyBytes = undefined;
  } else {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
    cryptoPrivateKey = keyPair.privateKey;
    const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    publicKeyBytes = new Uint8Array(exportedPublicKey);
  }

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    cryptoPrivateKey,
    data as BufferSource
  );

  return {
    signature: new Uint8Array(signature),
    publicKey: publicKeyBytes
  };
}

/**
 * Verify a signature using ECDSA
 */
export async function verifySignature(
  data: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
): Promise<boolean> {
  const cryptoPublicKey = await crypto.subtle.importKey(
    'spki',
    publicKey as BufferSource,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );

  return await crypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    cryptoPublicKey,
    signature as BufferSource,
    data as BufferSource
  );
}

/**
 * Compute HMAC
 */
export async function computeHMAC(
  data: Uint8Array,
  key: Uint8Array
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data as BufferSource);
  return new Uint8Array(signature);
}

/**
 * Derive a key from a password using PBKDF2
 */
export async function derivePBKDF2(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const passwordData = new TextEncoder().encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256'
    },
    baseKey,
    256
  );

  return new Uint8Array(derivedBits);
}

/**
 * Generate cryptographically secure random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  if (length < 1 || length > 65536) {
    throw new Error('Length must be between 1 and 65536');
  }
  return crypto.getRandomValues(new Uint8Array(length));
}
