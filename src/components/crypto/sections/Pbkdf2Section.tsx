import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { textToBytes, bytesToText, type Encoding } from '../../../utils/encoding';
import { derivePBKDF2 } from '../../../utils/cryptoOperations';

export function Pbkdf2Section() {
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [saltEncoding, setSaltEncoding] = useState<Encoding>('utf8');
  const [iterations, setIterations] = useState('100000');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('hex');

  const { output, loading, execute } = useCryptoOperation();

  const handlePbkdf2 = () =>
    execute(async () => {
      const saltBytes = textToBytes(salt, saltEncoding);
      const iterationsNum = parseInt(iterations);

      const derived = await derivePBKDF2(password, saltBytes, iterationsNum);
      return bytesToText(derived, outputEncoding);
    });

  const handleExample = () => {
    setPassword('mypassword');
    setSalt('randomsalt123');
  };

  return (
    <CryptoSection
      number={7}
      title="PBKDF2 (Password-Based Key Derivation)"
      description="Derive a cryptographic key from a password. Use high iteration counts (100,000+) for security."
      warning="Use case: Convert passwords into encryption keys, password hashing, key stretching."
    >
      <TextInput
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter password..."
        type="text"
      />

      <EncodingSelect value={saltEncoding} onChange={setSaltEncoding} label="Salt Encoding" />

      <TextInput
        label="Salt"
        value={salt}
        onChange={setSalt}
        placeholder="Enter salt (random string)..."
        type="text"
      />

      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Iterations" value={iterations} onChange={setIterations} type="number" />
        <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Output" />
      </div>

      <button onClick={handleExample} className="text-xs underline">
        Example
      </button>

      <ActionButton
        onClick={handlePbkdf2}
        loading={loading}
        loadingText="Deriving..."
        disabled={!password || !salt}
      >
        Derive Key
      </ActionButton>

      {output && <OutputDisplay label="Derived Key (256 bits)" value={output} />}
    </CryptoSection>
  );
}
