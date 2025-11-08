interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  type?: 'text' | 'textarea' | 'number';
  min?: string;
  max?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  type = 'textarea',
  min,
  max
}: TextInputProps) {
  const baseClassName = "w-full px-2 py-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono";

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-bold mb-1">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={baseClassName}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-bold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={baseClassName}
      />
    </div>
  );
}
