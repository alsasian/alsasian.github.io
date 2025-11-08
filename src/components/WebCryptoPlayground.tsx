import { HashSection } from './crypto/sections/HashSection';
import { EncryptSection } from './crypto/sections/EncryptSection';
import { DecryptSection } from './crypto/sections/DecryptSection';
import { SignSection } from './crypto/sections/SignSection';
import { VerifySection } from './crypto/sections/VerifySection';
import { HmacSection } from './crypto/sections/HmacSection';
import { Pbkdf2Section } from './crypto/sections/Pbkdf2Section';
import { RandomSection } from './crypto/sections/RandomSection';

export default function WebCryptoPlayground() {
  return (
    <div className="space-y-8">
      <HashSection />
      <EncryptSection />
      <DecryptSection />
      <SignSection />
      <VerifySection />
      <HmacSection />
      <Pbkdf2Section />
      <RandomSection />

      {/* Info */}
      <div className="border border-gray-300 bg-gray-100 p-3">
        <p className="text-xs text-gray-700">
          <strong>Note:</strong> All cryptographic operations happen locally in your browser using
          the Web Cryptography API. No data is sent to any server.
        </p>
      </div>
    </div>
  );
}
