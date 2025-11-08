import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { computeHMAC } from '../../../utils/cryptoOperations';

export function HmacSection() {
  const [input, setInput] = useState('');
  const [inputEncoding, setInputEncoding] = useState<Encoding>('utf8');
  const [key, setKey] = useState('');
  const [keyEncoding, setKeyEncoding] = useState<Encoding>('utf8');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('hex');

  const { output, loading, execute } = useCryptoOperation();

  const handleHmac = () => execute(async () => {
    const data = textToBytes(input, inputEncoding);
    const keyData = textToBytes(key, keyEncoding);

    const hmac = await computeHMAC(data, keyData);
    return bytesToText(hmac, outputEncoding);
  });

  const handleExample = () => {
    setInput('message');
    setKey('secret');
  };

  return (
    <CryptoSection
      number={6}
      title="HMAC"
      description="Hash-based Message Authentication Code. Use a secret key to create an authenticated hash."
      warning="Use case: Verify message integrity and authenticity, API signatures, session tokens."
    >
      <div className="flex gap-2">
        <EncodingSelect value={inputEncoding} onChange={setInputEncoding} label="Message" />
        <EncodingSelect value={keyEncoding} onChange={setKeyEncoding} label="Key" />
        <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Output" />
      </div>

      <TextInput
        label="Message"
        value={input}
        onChange={setInput}
        placeholder="Enter message..."
        rows={2}
      />

      <div>
        <TextInput
          label="Secret Key"
          value={key}
          onChange={setKey}
          placeholder="Enter secret key..."
          type="text"
        />
        <button onClick={handleExample} className="mt-1 text-xs underline">Example</button>
      </div>

      <ActionButton onClick={handleHmac} loading={loading} loadingText="Computing..." disabled={!input || !key}>
        Compute HMAC
      </ActionButton>

      {output && <OutputDisplay label="HMAC Output" value={output} />}
    </CryptoSection>
  );
}
