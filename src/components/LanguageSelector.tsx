import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
];

export function LanguageSelector() {
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setShowLanguages(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowLanguages(!showLanguages)}
        className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
      >
        <Globe className="w-4 h-4" />
        Language
      </button>

      {showLanguages && (
        <>
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1 max-h-[60vh] overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedLanguage.code === language.code
                      ? 'bg-gray-800 text-white'
                      : 'text-white/70 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowLanguages(false)}
          />
        </>
      )}
    </div>
  );
}
