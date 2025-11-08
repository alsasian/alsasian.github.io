import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { signData } from '../../../utils/cryptoOperations';

export function SignSection() {
  const [input, setInput] = useState('');
  const [inputEncoding, setInputEncoding] = useState<Encoding>('utf8');
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyEncoding, setPrivateKeyEncoding] = useState<Encoding>('base64');

  const { output, loading, execute } = useCryptoOperation();

  const handleSign = () =>
    execute(async () => {
      const data = textToBytes(input, inputEncoding);
      const privateKeyBytes = privateKey ? textToBytes(privateKey, privateKeyEncoding) : undefined;

      const result = await signData(data, privateKeyBytes);

      if (privateKey) {
        return (
          `Signature: ${bytesToText(result.signature, 'hex')}\n\n` +
          `Note: Using imported private key. Public key not exported.`
        );
      } else {
        return (
          `Signature: ${bytesToText(result.signature, 'hex')}\n\n` +
          `Public Key: ${bytesToText(result.publicKey!, 'base64')}`
        );
      }
    });

  return (
    <CryptoSection
      number={4}
      title="Sign (ECDSA)"
      description="Create a digital signature using ECDSA with P-256 curve. Optionally provide your own private key (PKCS#8 format), or leave blank to generate a new key pair."
      warning="Note: If private key field is empty, a new key pair will be generated."
    >
      <EncodingSelect value={inputEncoding} onChange={setInputEncoding} label="Input Encoding" />

      <TextInput
        label="Input"
        value={input}
        onChange={setInput}
        placeholder="Enter text to sign..."
        rows={3}
      />

      <EncodingSelect
        value={privateKeyEncoding}
        onChange={setPrivateKeyEncoding}
        label="Private Key Encoding"
      />

      <TextInput
        label="Private Key (optional - PKCS#8 format)"
        value={privateKey}
        onChange={setPrivateKey}
        placeholder="Leave blank to generate new key pair..."
        rows={3}
      />

      <button onClick={() => setInput('message to sign')} className="text-xs underline">
        Example: "message to sign"
      </button>

      <ActionButton
        onClick={handleSign}
        loading={loading}
        loadingText="Signing..."
        disabled={!input}
      >
        Sign
      </ActionButton>

      {output && <OutputDisplay label="Output" value={output} />}
    </CryptoSection>
  );
}
