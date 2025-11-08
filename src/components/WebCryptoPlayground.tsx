import { useState } from 'react';

type Tab = 'hash' | 'encrypt' | 'sign';

export default function WebCryptoPlayground() {
  const [activeTab, setActiveTab] = useState<Tab>('hash');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [loading, setLoading] = useState(false);

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  const handleHash = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashHex = arrayBufferToHex(hashBuffer);
      setOutput(hashHex);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleEncrypt = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // Generate a random key
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      // Export key for display
      const exportedKey = await crypto.subtle.exportKey('raw', key);

      setOutput(
        `Encrypted (Base64): ${arrayBufferToBase64(encrypted)}\n\n` +
        `Key (Hex): ${arrayBufferToHex(exportedKey)}\n\n` +
        `IV (Hex): ${arrayBufferToHex(iv.buffer)}`
      );
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleSign = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // Generate key pair
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256',
        },
        true,
        ['sign', 'verify']
      );

      // Sign
      const signature = await crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' },
        },
        keyPair.privateKey,
        data
      );

      // Export public key
      const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);

      setOutput(
        `Signature (Hex): ${arrayBufferToHex(signature)}\n\n` +
        `Public Key (Base64): ${arrayBufferToBase64(exportedPublicKey)}`
      );
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleExecute = () => {
    setOutput('');
    switch (activeTab) {
      case 'hash':
        handleHash();
        break;
      case 'encrypt':
        handleEncrypt();
        break;
      case 'sign':
        handleSign();
        break;
    }
  };

  const tabs: { id: Tab; label: string; description: string }[] = [
    { id: 'hash', label: 'Hash', description: 'Generate cryptographic hashes' },
    { id: 'encrypt', label: 'Encrypt', description: 'AES-GCM encryption' },
    { id: 'sign', label: 'Sign', description: 'ECDSA digital signatures' },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b-2 border-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-sans font-bold text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 border-l-4 border-gray-900 pl-3">
        {tabs.find(t => t.id === activeTab)?.description}
      </div>

      {/* Content */}
      <div className="border border-gray-300 p-4 space-y-4">
        {/* Algorithm selection for hashing */}
        {activeTab === 'hash' && (
          <div>
            <label className="block text-sm font-bold mb-1">
              Hash Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900"
            >
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
        )}

        {/* Input */}
        <div>
          <label className="block text-sm font-bold mb-1">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to process..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono focus:outline-none focus:border-gray-900"
          />
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={!input || loading}
          className="w-full px-4 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Execute ${tabs.find(t => t.id === activeTab)?.label}`}
        </button>

        {/* Output */}
        {output && (
          <div>
            <label className="block text-sm font-bold mb-1">
              Output
            </label>
            <div className="relative">
              <pre className="w-full px-3 py-2 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {output}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-2 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-100 border border-gray-300 p-3">
          <p className="text-xs text-gray-700">
            <strong>Note:</strong> All cryptographic operations happen locally in your browser.
            No data is sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
