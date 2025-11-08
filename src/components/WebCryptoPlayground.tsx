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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            WebCrypto API Playground
          </h1>
          <p className="text-purple-100">
            Experiment with browser-native cryptography
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border-b-2 border-purple-400'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              <div className="text-sm md:text-base">{tab.label}</div>
              <div className="text-xs text-purple-300 mt-1 hidden md:block">
                {tab.description}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Algorithm selection for hashing */}
          {activeTab === 'hash' && (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Hash Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to process..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={!input || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Execute ${tabs.find(t => t.id === activeTab)?.label}`}
          </button>

          {/* Output */}
          {output && (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Output
              </label>
              <div className="relative">
                <pre className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-green-300 font-mono text-xs md:text-sm overflow-x-auto whitespace-pre-wrap break-all">
                  {output}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="absolute top-2 right-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded border border-white/20 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>ℹ️ Note:</strong> All cryptographic operations happen locally in your browser.
              No data is sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
