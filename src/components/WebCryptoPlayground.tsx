import { useState } from 'react';

type Encoding = 'utf8' | 'hex' | 'base64';

export default function WebCryptoPlayground() {
  // Helper functions for encoding/decoding
  const textToBytes = (text: string, encoding: Encoding): Uint8Array => {
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
  };

  const bytesToText = (bytes: Uint8Array, encoding: Encoding): string => {
    if (encoding === 'utf8') {
      return new TextDecoder().decode(bytes);
    } else if (encoding === 'hex') {
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    } else { // base64
      return btoa(String.fromCharCode(...bytes));
    }
  };

  // Section 1: Hash
  const [hashInput, setHashInput] = useState('');
  const [hashInputEncoding, setHashInputEncoding] = useState<Encoding>('utf8');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256');
  const [hashOutputEncoding, setHashOutputEncoding] = useState<Encoding>('hex');
  const [hashOutput, setHashOutput] = useState('');
  const [hashLoading, setHashLoading] = useState(false);

  const handleHash = async () => {
    if (!hashInput) return;
    setHashLoading(true);
    try {
      const data = textToBytes(hashInput, hashInputEncoding);
      const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data as BufferSource);
      setHashOutput(bytesToText(new Uint8Array(hashBuffer), hashOutputEncoding));
    } catch (error) {
      setHashOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setHashLoading(false);
  };

  // Section 2: Encrypt
  const [encryptInput, setEncryptInput] = useState('');
  const [encryptInputEncoding, setEncryptInputEncoding] = useState<Encoding>('utf8');
  const [encryptOutput, setEncryptOutput] = useState('');
  const [encryptLoading, setEncryptLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!encryptInput) return;
    setEncryptLoading(true);
    try {
      const data = textToBytes(encryptInput, encryptInputEncoding);
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data as BufferSource);
      const exportedKey = await crypto.subtle.exportKey('raw', key);

      setEncryptOutput(
        `Encrypted: ${bytesToText(new Uint8Array(encrypted), 'base64')}\n\n` +
        `Key: ${bytesToText(new Uint8Array(exportedKey), 'hex')}\n\n` +
        `IV: ${bytesToText(iv, 'hex')}`
      );
    } catch (error) {
      setEncryptOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setEncryptLoading(false);
  };

  // Section 3: Decrypt
  const [decryptData, setDecryptData] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptIv, setDecryptIv] = useState('');
  const [decryptOutputEncoding, setDecryptOutputEncoding] = useState<Encoding>('utf8');
  const [decryptOutput, setDecryptOutput] = useState('');
  const [decryptLoading, setDecryptLoading] = useState(false);

  const handleDecrypt = async () => {
    if (!decryptData || !decryptKey || !decryptIv) return;
    setDecryptLoading(true);
    try {
      const encrypted = textToBytes(decryptData, 'base64');
      const keyData = textToBytes(decryptKey, 'hex');
      const iv = textToBytes(decryptIv, 'hex');

      const key = await crypto.subtle.importKey(
        'raw',
        keyData as BufferSource,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, encrypted as BufferSource);
      setDecryptOutput(bytesToText(new Uint8Array(decrypted), decryptOutputEncoding));
    } catch (error) {
      setDecryptOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setDecryptLoading(false);
  };

  // Section 4: Sign
  const [signInput, setSignInput] = useState('');
  const [signInputEncoding, setSignInputEncoding] = useState<Encoding>('utf8');
  const [signOutput, setSignOutput] = useState('');
  const [signLoading, setSignLoading] = useState(false);

  const handleSign = async () => {
    if (!signInput) return;
    setSignLoading(true);
    try {
      const data = textToBytes(signInput, signInputEncoding);
      const keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign', 'verify']
      );
      const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        keyPair.privateKey,
        data as BufferSource
      );
      const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);

      setSignOutput(
        `Signature: ${bytesToText(new Uint8Array(signature), 'hex')}\n\n` +
        `Public Key: ${bytesToText(new Uint8Array(exportedPublicKey), 'base64')}`
      );
    } catch (error) {
      setSignOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setSignLoading(false);
  };

  // Section 5: Verify
  const [verifyData, setVerifyData] = useState('');
  const [verifyDataEncoding, setVerifyDataEncoding] = useState<Encoding>('utf8');
  const [verifySignature, setVerifySignature] = useState('');
  const [verifyPublicKey, setVerifyPublicKey] = useState('');
  const [verifyOutput, setVerifyOutput] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleVerify = async () => {
    if (!verifyData || !verifySignature || !verifyPublicKey) return;
    setVerifyLoading(true);
    try {
      const data = textToBytes(verifyData, verifyDataEncoding);
      const signature = textToBytes(verifySignature, 'hex');
      const publicKeyData = textToBytes(verifyPublicKey, 'base64');

      const publicKey = await crypto.subtle.importKey(
        'spki',
        publicKeyData as BufferSource,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );
      const valid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        publicKey,
        signature as BufferSource,
        data as BufferSource
      );
      setVerifyOutput(valid ? '✓ Signature is VALID' : '✗ Signature is INVALID');
    } catch (error) {
      setVerifyOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setVerifyLoading(false);
  };

  // Section 6: HMAC
  const [hmacInput, setHmacInput] = useState('');
  const [hmacInputEncoding, setHmacInputEncoding] = useState<Encoding>('utf8');
  const [hmacKey, setHmacKey] = useState('');
  const [hmacKeyEncoding, setHmacKeyEncoding] = useState<Encoding>('utf8');
  const [hmacOutputEncoding, setHmacOutputEncoding] = useState<Encoding>('hex');
  const [hmacOutput, setHmacOutput] = useState('');
  const [hmacLoading, setHmacLoading] = useState(false);

  const handleHmac = async () => {
    if (!hmacInput || !hmacKey) return;
    setHmacLoading(true);
    try {
      const data = textToBytes(hmacInput, hmacInputEncoding);
      const keyData = textToBytes(hmacKey, hmacKeyEncoding);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData as BufferSource,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );
      const signature = await crypto.subtle.sign('HMAC', key, data as BufferSource);
      setHmacOutput(bytesToText(new Uint8Array(signature), hmacOutputEncoding));
    } catch (error) {
      setHmacOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setHmacLoading(false);
  };

  // Section 7: PBKDF2
  const [pbkdf2Password, setPbkdf2Password] = useState('');
  const [pbkdf2Salt, setPbkdf2Salt] = useState('');
  const [pbkdf2Iterations, setPbkdf2Iterations] = useState('100000');
  const [pbkdf2OutputEncoding, setPbkdf2OutputEncoding] = useState<Encoding>('hex');
  const [pbkdf2Output, setPbkdf2Output] = useState('');
  const [pbkdf2Loading, setPbkdf2Loading] = useState(false);

  const handlePbkdf2 = async () => {
    if (!pbkdf2Password || !pbkdf2Salt) return;
    setPbkdf2Loading(true);
    try {
      const passwordData = new TextEncoder().encode(pbkdf2Password);
      const saltData = new TextEncoder().encode(pbkdf2Salt);

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
          salt: saltData,
          iterations: parseInt(pbkdf2Iterations),
          hash: 'SHA-256'
        },
        baseKey,
        256
      );
      setPbkdf2Output(bytesToText(new Uint8Array(derivedBits), pbkdf2OutputEncoding));
    } catch (error) {
      setPbkdf2Output(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setPbkdf2Loading(false);
  };

  // Section 8: Random Bytes
  const [randomLength, setRandomLength] = useState('32');
  const [randomOutputEncoding, setRandomOutputEncoding] = useState<Encoding>('hex');
  const [randomOutput, setRandomOutput] = useState('');

  const handleRandom = () => {
    const length = parseInt(randomLength);
    if (length < 1 || length > 65536) {
      setRandomOutput('Error: Length must be between 1 and 65536');
      return;
    }
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    setRandomOutput(bytesToText(bytes, randomOutputEncoding));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const EncodingSelect = ({ value, onChange, label }: { value: Encoding; onChange: (e: Encoding) => void; label: string }) => (
    <div className="inline-block">
      <label className="block text-xs font-bold mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Encoding)}
        className="px-2 py-1 border border-gray-300 bg-white text-gray-900 text-xs focus:outline-none focus:border-gray-900"
      >
        <option value="utf8">UTF-8</option>
        <option value="hex">Hex</option>
        <option value="base64">Base64</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Hash */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">1. Hash</h2>
        <p className="text-sm text-gray-700 mb-3">
          Generate cryptographic hashes. Use SHA-256 for general purposes, SHA-512 for higher security.
          <span className="block mt-1 text-xs text-gray-600">Warning: SHA-1 is deprecated and should not be used for security-critical applications.</span>
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold mb-1">Algorithm</label>
              <select
                value={hashAlgorithm}
                onChange={(e) => setHashAlgorithm(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 text-sm"
              >
                <option value="SHA-1">SHA-1 (deprecated)</option>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
              </select>
            </div>
            <div className="flex gap-2">
              <EncodingSelect value={hashInputEncoding} onChange={setHashInputEncoding} label="Input" />
              <EncodingSelect value={hashOutputEncoding} onChange={setHashOutputEncoding} label="Output" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Input</label>
            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={3}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
            <div className="mt-1 flex gap-2">
              <button onClick={() => setHashInput('hello world')} className="text-xs underline">Example: "hello world"</button>
              <button onClick={() => setHashInput('abc')} className="text-xs underline">Test Vector: "abc"</button>
            </div>
          </div>

          <button
            onClick={handleHash}
            disabled={!hashInput || hashLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {hashLoading ? 'Hashing...' : 'Hash'}
          </button>

          {hashOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Output</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {hashOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(hashOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Encrypt */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">2. Encrypt (AES-GCM)</h2>
        <p className="text-sm text-gray-700 mb-3">
          Encrypt data using AES-GCM with a randomly generated 256-bit key. Save the key and IV to decrypt later.
          <span className="block mt-1 text-xs text-gray-600">Note: Each encryption generates a new random key and IV.</span>
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <EncodingSelect value={encryptInputEncoding} onChange={setEncryptInputEncoding} label="Input Encoding" />

          <div>
            <label className="block text-sm font-bold mb-1">Input</label>
            <textarea
              value={encryptInput}
              onChange={(e) => setEncryptInput(e.target.value)}
              placeholder="Enter text to encrypt..."
              rows={3}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
            <button onClick={() => setEncryptInput('secret message')} className="mt-1 text-xs underline">Example: "secret message"</button>
          </div>

          <button
            onClick={handleEncrypt}
            disabled={!encryptInput || encryptLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {encryptLoading ? 'Encrypting...' : 'Encrypt'}
          </button>

          {encryptOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Output (save all three values)</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {encryptOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(encryptOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Decrypt */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">3. Decrypt (AES-GCM)</h2>
        <p className="text-sm text-gray-700 mb-3">
          Decrypt data encrypted with AES-GCM. You need the encrypted data (Base64), key (Hex), and IV (Hex).
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Encrypted Data (Base64)</label>
            <textarea
              value={decryptData}
              onChange={(e) => setDecryptData(e.target.value)}
              placeholder="Paste encrypted data..."
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Key (Hex)</label>
            <input
              type="text"
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
              placeholder="Paste key..."
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">IV (Hex)</label>
            <input
              type="text"
              value={decryptIv}
              onChange={(e) => setDecryptIv(e.target.value)}
              placeholder="Paste IV..."
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <EncodingSelect value={decryptOutputEncoding} onChange={setDecryptOutputEncoding} label="Output Encoding" />

          <button
            onClick={handleDecrypt}
            disabled={!decryptData || !decryptKey || !decryptIv || decryptLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {decryptLoading ? 'Decrypting...' : 'Decrypt'}
          </button>

          {decryptOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Decrypted Output</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {decryptOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(decryptOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Sign */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">4. Sign (ECDSA)</h2>
        <p className="text-sm text-gray-700 mb-3">
          Create a digital signature using ECDSA with P-256 curve. Generates a new key pair each time.
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <EncodingSelect value={signInputEncoding} onChange={setSignInputEncoding} label="Input Encoding" />

          <div>
            <label className="block text-sm font-bold mb-1">Input</label>
            <textarea
              value={signInput}
              onChange={(e) => setSignInput(e.target.value)}
              placeholder="Enter text to sign..."
              rows={3}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
            <button onClick={() => setSignInput('message to sign')} className="mt-1 text-xs underline">Example: "message to sign"</button>
          </div>

          <button
            onClick={handleSign}
            disabled={!signInput || signLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {signLoading ? 'Signing...' : 'Sign'}
          </button>

          {signOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Output</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {signOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(signOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Verify */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">5. Verify Signature (ECDSA)</h2>
        <p className="text-sm text-gray-700 mb-3">
          Verify a digital signature. You need the original data, signature (Hex), and public key (Base64).
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <EncodingSelect value={verifyDataEncoding} onChange={setVerifyDataEncoding} label="Data Encoding" />

          <div>
            <label className="block text-sm font-bold mb-1">Original Data</label>
            <textarea
              value={verifyData}
              onChange={(e) => setVerifyData(e.target.value)}
              placeholder="Enter original data..."
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Signature (Hex)</label>
            <textarea
              value={verifySignature}
              onChange={(e) => setVerifySignature(e.target.value)}
              placeholder="Paste signature..."
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Public Key (Base64)</label>
            <textarea
              value={verifyPublicKey}
              onChange={(e) => setVerifyPublicKey(e.target.value)}
              placeholder="Paste public key..."
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={!verifyData || !verifySignature || !verifyPublicKey || verifyLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {verifyLoading ? 'Verifying...' : 'Verify'}
          </button>

          {verifyOutput && (
            <div className={`p-2 border ${verifyOutput.includes('VALID') ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <p className="text-sm font-bold">{verifyOutput}</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: HMAC */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">6. HMAC</h2>
        <p className="text-sm text-gray-700 mb-3">
          Hash-based Message Authentication Code. Use a secret key to create an authenticated hash.
          <span className="block mt-1 text-xs text-gray-600">Use case: Verify message integrity and authenticity, API signatures, session tokens.</span>
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <div className="flex gap-2">
            <EncodingSelect value={hmacInputEncoding} onChange={setHmacInputEncoding} label="Message" />
            <EncodingSelect value={hmacKeyEncoding} onChange={setHmacKeyEncoding} label="Key" />
            <EncodingSelect value={hmacOutputEncoding} onChange={setHmacOutputEncoding} label="Output" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Message</label>
            <textarea
              value={hmacInput}
              onChange={(e) => setHmacInput(e.target.value)}
              placeholder="Enter message..."
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Secret Key</label>
            <input
              type="text"
              value={hmacKey}
              onChange={(e) => setHmacKey(e.target.value)}
              placeholder="Enter secret key..."
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
            <button onClick={() => { setHmacInput('message'); setHmacKey('secret'); }} className="mt-1 text-xs underline">Example</button>
          </div>

          <button
            onClick={handleHmac}
            disabled={!hmacInput || !hmacKey || hmacLoading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {hmacLoading ? 'Computing...' : 'Compute HMAC'}
          </button>

          {hmacOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">HMAC Output</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {hmacOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(hmacOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 7: PBKDF2 */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">7. PBKDF2 (Password-Based Key Derivation)</h2>
        <p className="text-sm text-gray-700 mb-3">
          Derive a cryptographic key from a password. Use high iteration counts (100,000+) for security.
          <span className="block mt-1 text-xs text-gray-600">Use case: Convert passwords into encryption keys, password hashing, key stretching.</span>
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="text"
              value={pbkdf2Password}
              onChange={(e) => setPbkdf2Password(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Salt</label>
            <input
              type="text"
              value={pbkdf2Salt}
              onChange={(e) => setPbkdf2Salt(e.target.value)}
              placeholder="Enter salt (random string)..."
              className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold mb-1">Iterations</label>
              <input
                type="number"
                value={pbkdf2Iterations}
                onChange={(e) => setPbkdf2Iterations(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 text-sm font-mono"
              />
            </div>
            <EncodingSelect value={pbkdf2OutputEncoding} onChange={setPbkdf2OutputEncoding} label="Output" />
          </div>

          <button onClick={() => { setPbkdf2Password('mypassword'); setPbkdf2Salt('randomsalt123'); }} className="text-xs underline">Example</button>

          <button
            onClick={handlePbkdf2}
            disabled={!pbkdf2Password || !pbkdf2Salt || pbkdf2Loading}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {pbkdf2Loading ? 'Deriving...' : 'Derive Key'}
          </button>

          {pbkdf2Output && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Derived Key (256 bits)</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {pbkdf2Output}
              </pre>
              <button
                onClick={() => copyToClipboard(pbkdf2Output)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 8: Random Bytes */}
      <section className="border-l-4 border-gray-900 pl-4">
        <h2 className="text-2xl font-bold mb-2">8. Random Bytes Generator</h2>
        <p className="text-sm text-gray-700 mb-3">
          Generate cryptographically secure random bytes. Use for keys, IVs, salts, or tokens.
        </p>

        <div className="border border-gray-300 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold mb-1">Length (bytes)</label>
              <input
                type="number"
                value={randomLength}
                onChange={(e) => setRandomLength(e.target.value)}
                min="1"
                max="65536"
                className="w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 text-sm font-mono"
              />
            </div>
            <EncodingSelect value={randomOutputEncoding} onChange={setRandomOutputEncoding} label="Output" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setRandomLength('16')} className="text-xs underline">16 bytes (IV)</button>
            <button onClick={() => setRandomLength('32')} className="text-xs underline">32 bytes (key)</button>
            <button onClick={() => setRandomLength('64')} className="text-xs underline">64 bytes</button>
          </div>

          <button
            onClick={handleRandom}
            className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700"
          >
            Generate Random Bytes
          </button>

          {randomOutput && (
            <div className="relative">
              <label className="block text-sm font-bold mb-1">Random Output</label>
              <pre className="w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {randomOutput}
              </pre>
              <button
                onClick={() => copyToClipboard(randomOutput)}
                className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info */}
      <div className="bg-gray-100 border border-gray-300 p-3">
        <p className="text-xs text-gray-700">
          <strong>Note:</strong> All cryptographic operations happen locally in your browser using the Web Cryptography API.
          No data is sent to any server.
        </p>
      </div>
    </div>
  );
}
