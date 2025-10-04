import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base: reglas recomendadas de Next.js
  ...compat.extends("next/core-web-vitals"),

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react: require("eslint-plugin-react"),
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // ⚡️ Validaciones clave
      "no-undef": "error", // Variables no definidas
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Variables no usadas
      "no-console": "off",

      // ⚙️ Reglas de React
      "react/jsx-uses-react": "off", // Desactiva si usas React 17+ (no necesita import)
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-uses-vars": "error",
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;