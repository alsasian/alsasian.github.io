import type { Encoding } from '../../../utils/encoding';

interface EncodingSelectProps {
  value: Encoding;
  onChange: (value: Encoding) => void;
  label: string;
}

export function EncodingSelect({ value, onChange, label }: EncodingSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Encoding)}
        className="border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-gray-400"
      >
        <option value="utf8">UTF-8</option>
        <option value="hex">Hex</option>
        <option value="base64">Base64</option>
      </select>
    </div>
  );
}
