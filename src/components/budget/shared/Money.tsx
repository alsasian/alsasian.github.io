/**
 * A money figure with the currency symbol and cents rendered muted, so the
 * dollars read as the number and the rest recedes. Whole amounts drop ".00".
 */

interface MoneyProps {
  cents: number;
  alwaysCents?: boolean;
}

export default function Money({ cents, alwaysCents = false }: MoneyProps) {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  const showCents = alwaysCents || rem !== 0;
  return (
    <>
      <span className="u">{negative ? '−$' : '$'}</span>
      {dollars.toLocaleString('en-US')}
      {showCents && <span className="u">.{rem.toString().padStart(2, '0')}</span>}
    </>
  );
}
