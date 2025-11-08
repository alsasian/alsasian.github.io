import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { encryptAES } from '../../../utils/cryptoOperations';

export function EncryptSection() {
  const [input, setInput] = useState('');
  const [inputEncoding, setInputEncoding] = useState<Encoding>('utf8');
  const [key, setKey] = useState('');
  const [keyEncoding, setKeyEncoding] = useState<Encoding>('hex');
  const [iv, setIv] = useState('');
  const [ivEncoding, setIvEncoding] = useState<Encoding>('hex');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('base64');
  const [keyOutputEncoding, setKeyOutputEncoding] = useState<Encoding>('hex');
  const [ivOutputEncoding, setIvOutputEncoding] = useState<Encoding>('hex');

  const { output, loading, execute } = useCryptoOperation();

  const handleEncrypt = () =>
    execute(async () => {
      const data = textToBytes(input, inputEncoding);
      const keyBytes = key ? textToBytes(key, keyEncoding) : undefined;
      const ivBytes = iv ? textToBytes(iv, ivEncoding) : undefined;

      const result = await encryptAES(data, keyBytes, ivBytes);

      return (
        `Encrypted: ${bytesToText(result.encrypted, outputEncoding)}\n\n` +
        `Key: ${bytesToText(result.key, keyOutputEncoding)}\n\n` +
        `IV: ${bytesToText(result.iv, ivOutputEncoding)}`
      );
    });

  return (
    <CryptoSection
      number={2}
      title="Encrypt (AES-GCM)"
      description="Encrypt data using AES-GCM. Optionally provide your own 256-bit key and IV, or leave blank to generate random values."
      warning="Note: If key/IV fields are empty, random values will be generated."
    >
      <EncodingSelect value={inputEncoding} onChange={setInputEncoding} label="Input Encoding" />

      <TextInput
        label="Input"
        value={input}
        onChange={setInput}
        placeholder="Enter text to encrypt..."
        rows={3}
      />

      <div className="flex gap-2">
        <EncodingSelect value={keyEncoding} onChange={setKeyEncoding} label="Key Input Encoding" />
        <EncodingSelect value={ivEncoding} onChange={setIvEncoding} label="IV Input Encoding" />
      </div>

      <TextInput
        label="Key (optional - 32 bytes for AES-256)"
        value={key}
        onChange={setKey}
        placeholder="Leave blank to generate random..."
        type="text"
      />

      <TextInput
        label="IV (optional - 12 bytes for AES-GCM)"
        value={iv}
        onChange={setIv}
        placeholder="Leave blank to generate random..."
        type="text"
      />

      <div className="flex gap-2">
        <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Data Output" />
        <EncodingSelect
          value={keyOutputEncoding}
          onChange={setKeyOutputEncoding}
          label="Key Output"
        />
        <EncodingSelect value={ivOutputEncoding} onChange={setIvOutputEncoding} label="IV Output" />
      </div>

      <button onClick={() => setInput('secret message')} className="text-xs underline">
        Example: "secret message"
      </button>

      <ActionButton
        onClick={handleEncrypt}
        loading={loading}
        loadingText="Encrypting..."
        disabled={!input}
      >
        Encrypt
      </ActionButton>

      {output && <OutputDisplay label="Output" value={output} />}
    </CryptoSection>
  );
}
