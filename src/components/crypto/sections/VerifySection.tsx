import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, type Encoding } from '../../../utils/encoding';
import { verifySignature } from '../../../utils/cryptoOperations';

export function VerifySection() {
  const [data, setData] = useState('');
  const [dataEncoding, setDataEncoding] = useState<Encoding>('utf8');
  const [signature, setSignature] = useState('');
  const [signatureEncoding, setSignatureEncoding] = useState<Encoding>('hex');
  const [publicKey, setPublicKey] = useState('');
  const [publicKeyEncoding, setPublicKeyEncoding] = useState<Encoding>('base64');

  const { output, loading, execute } = useCryptoOperation();

  const handleVerify = () =>
    execute(async () => {
      const dataBytes = textToBytes(data, dataEncoding);
      const signatureBytes = textToBytes(signature, signatureEncoding);
      const publicKeyBytes = textToBytes(publicKey, publicKeyEncoding);

      const valid = await verifySignature(dataBytes, signatureBytes, publicKeyBytes);
      return valid ? '✓ Signature is VALID' : '✗ Signature is INVALID';
    });

  const isValid = output.includes('VALID');
  const isInvalid = output.includes('INVALID');

  return (
    <CryptoSection
      number={5}
      title="Verify Signature (ECDSA)"
      description="Verify a digital signature. You need the original data, signature, and public key from the Sign section."
    >
      <div className="flex gap-2">
        <EncodingSelect value={dataEncoding} onChange={setDataEncoding} label="Data Encoding" />
        <EncodingSelect
          value={signatureEncoding}
          onChange={setSignatureEncoding}
          label="Signature Encoding"
        />
        <EncodingSelect
          value={publicKeyEncoding}
          onChange={setPublicKeyEncoding}
          label="Public Key Encoding"
        />
      </div>

      <TextInput
        label="Original Data"
        value={data}
        onChange={setData}
        placeholder="Enter original data..."
        rows={2}
      />

      <TextInput
        label="Signature"
        value={signature}
        onChange={setSignature}
        placeholder="Paste signature..."
        rows={2}
      />

      <TextInput
        label="Public Key"
        value={publicKey}
        onChange={setPublicKey}
        placeholder="Paste public key..."
        rows={2}
      />

      <ActionButton
        onClick={handleVerify}
        loading={loading}
        loadingText="Verifying..."
        disabled={!data || !signature || !publicKey}
      >
        Verify
      </ActionButton>

      {output && <OutputDisplay label="" value={output} success={isValid} error={isInvalid} />}
    </CryptoSection>
  );
}
