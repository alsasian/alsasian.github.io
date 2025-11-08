import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { hashData } from '../../../utils/cryptoOperations';

export function HashSection() {
  const [input, setInput] = useState('');
  const [inputEncoding, setInputEncoding] = useState<Encoding>('utf8');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('hex');

  const { output, loading, execute } = useCryptoOperation();

  const handleHash = () =>
    execute(async () => {
      const data = textToBytes(input, inputEncoding);
      const hash = await hashData(data, algorithm);
      return bytesToText(hash, outputEncoding);
    });

  return (
    <CryptoSection
      number={1}
      title="Hash"
      description="Generate cryptographic hashes. Use SHA-256 for general purposes, SHA-512 for higher security."
      warning="Warning: SHA-1 is deprecated and should not be used for security-critical applications."
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-sm font-bold">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
          >
            <option value="SHA-1">SHA-1 (deprecated)</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
        <div className="flex gap-2">
          <EncodingSelect value={inputEncoding} onChange={setInputEncoding} label="Input" />
          <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Output" />
        </div>
      </div>

      <TextInput
        label="Input"
        value={input}
        onChange={setInput}
        placeholder="Enter text to hash..."
        rows={3}
      />

      <div className="flex gap-2">
        <button onClick={() => setInput('hello world')} className="text-xs underline">
          Example: "hello world"
        </button>
        <button onClick={() => setInput('abc')} className="text-xs underline">
          Test Vector: "abc"
        </button>
      </div>

      <ActionButton
        onClick={handleHash}
        loading={loading}
        loadingText="Hashing..."
        disabled={!input}
      >
        Hash
      </ActionButton>

      {output && <OutputDisplay label="Output" value={output} />}
    </CryptoSection>
  );
}
