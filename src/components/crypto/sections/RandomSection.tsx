import { useState } from 'react';
import { CryptoSection } from '../shared/CryptoSection';
import { EncodingSelect } from '../shared/EncodingSelect';
import { TextInput } from '../shared/TextInput';
import { OutputDisplay } from '../shared/OutputDisplay';
import { ActionButton } from '../shared/ActionButton';
import { useCryptoOperation } from '../../../hooks/useCryptoOperation';
import { bytesToText, type Encoding } from '../../../utils/encoding';
import { generateRandomBytes } from '../../../utils/cryptoOperations';

export function RandomSection() {
  const [length, setLength] = useState('32');
  const [outputEncoding, setOutputEncoding] = useState<Encoding>('hex');

  const { output, setOutput } = useCryptoOperation();

  const handleRandom = () => {
    try {
      const lengthNum = parseInt(length);
      const bytes = generateRandomBytes(lengthNum);
      setOutput(bytesToText(bytes, outputEncoding));
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <CryptoSection
      number={8}
      title="Random Bytes Generator"
      description="Generate cryptographically secure random bytes. Use for keys, IVs, salts, or tokens."
    >
      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Length (bytes)"
          value={length}
          onChange={setLength}
          type="number"
          min="1"
          max="65536"
        />
        <EncodingSelect value={outputEncoding} onChange={setOutputEncoding} label="Output" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setLength('16')} className="text-xs underline">
          16 bytes (IV)
        </button>
        <button onClick={() => setLength('32')} className="text-xs underline">
          32 bytes (key)
        </button>
        <button onClick={() => setLength('64')} className="text-xs underline">
          64 bytes
        </button>
      </div>

      <ActionButton onClick={handleRandom}>Generate Random Bytes</ActionButton>

      {output && <OutputDisplay label="Random Output" value={output} />}
    </CryptoSection>
  );
}
