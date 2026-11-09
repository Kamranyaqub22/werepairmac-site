// ESLint 9 flat config. Next 16 removed `next lint`, so `npm run lint` calls
// ESLint directly. Same rule set as the old .eslintrc.json (core-web-vitals).
import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**', 'photo-library/**'] },
  ...coreWebVitals,
  {
    // New in eslint-config-next 16 (React Compiler rules). It flags reading
    // localStorage / today's date in a mount effect, which is the deliberate
    // hydration-safe pattern in CookieConsent and the admin estimate page.
    // Off to keep the pre-upgrade rule set; revisit if the React Compiler is
    // ever enabled.
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
];

export default config;
