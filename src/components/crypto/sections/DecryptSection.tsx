import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { decryptAES } from '../../../utils/cryptoOperations';

export function DecryptSection() {
  const [data, setData] = useState('');
  const [dataEncoding, setDataEncoding] = useState<Encoding>('base64');
  const [key, setKey] = useState('');
  const [keyEncoding, setKeyEncoding] = useState<Encoding>('hex');
  const [iv, setIv] = useState('');
  const [ivEncoding, setIvEncoding] = useState<Encoding>('hex');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('utf8');

  const { output, loading, execute } = useCryptoOperation();

  const handleDecrypt = () => execute(async () => {
    const encrypted = textToBytes(data, dataEncoding);
    const keyData = textToBytes(key, keyEncoding);
    const ivData = textToBytes(iv, ivEncoding);

    const decrypted = await decryptAES(encrypted, keyData, ivData);
    return bytesToText(decrypted, outputEncoding);
  });

  return (
    <CryptoSection
      number={3}
      title="Decrypt (AES-GCM)"
      description="Decrypt data encrypted with AES-GCM. Paste the encrypted data, key, and IV from the Encrypt section."
    >
      <div className="flex gap-2">
        <EncodingSelect value={dataEncoding} onChange={setDataEncoding} label="Data Encoding" />
        <EncodingSelect value={keyEncoding} onChange={setKeyEncoding} label="Key Encoding" />
        <EncodingSelect value={ivEncoding} onChange={setIvEncoding} label="IV Encoding" />
      </div>

      <TextInput
        label="Encrypted Data"
        value={data}
        onChange={setData}
        placeholder="Paste encrypted data..."
        rows={2}
      />

      <TextInput
        label="Key"
        value={key}
        onChange={setKey}
        placeholder="Paste key..."
        type="text"
      />

      <TextInput
        label="IV"
        value={iv}
        onChange={setIv}
        placeholder="Paste IV..."
        type="text"
      />

      <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Output Encoding" />

      <ActionButton onClick={handleDecrypt} loading={loading} loadingText="Decrypting..." disabled={!data || !key || !iv}>
        Decrypt
      </ActionButton>

      {output && <OutputDisplay label="Decrypted Output" value={output} />}
    </CryptoSection>
  );
}
