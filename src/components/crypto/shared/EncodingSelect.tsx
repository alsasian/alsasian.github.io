import type { Encoding } from '../../../utils/encoding';

interface EncodingSelectProps {
  value: Encoding;
  onChange: (value: Encoding) => void;
  label: string;
}

export function EncodingSelect({ value, onChange, label }: EncodingSelectProps) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Encoding)}
        className="px-2 py-1 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-900"
      >
        <option value="utf8">UTF-8</option>
        <option value="hex">Hex</option>
        <option value="base64">Base64</option>
      </select>
    </div>
  );
}
