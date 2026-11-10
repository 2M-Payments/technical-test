import type { Region } from '../../types/user';

interface RegionSelectorProps {
  regions: Region[];
  value: string[];
  onChange(codes: string[]): void;
  label?: string;
  error?: string;
}

/** Seleção múltipla de regiões: um usuário pode estar em várias (ex.: Brasil e Reino Unido). */
export function RegionSelector({
  regions,
  value,
  onChange,
  label = 'Regiões',
  error,
}: RegionSelectorProps) {
  const toggle = (code: string) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);

  return (
    <fieldset className={`field ${error ? 'field--invalid' : ''}`.trim()}>
      <legend>{label}</legend>
      <div className="chips">
        {regions.map((region) => {
          const selected = value.includes(region.code);
          return (
            <label key={region.code} className={`chip ${selected ? 'chip--selected' : ''}`.trim()}>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggle(region.code)}
              />
              {region.name}
            </label>
          );
        })}
      </div>
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}
