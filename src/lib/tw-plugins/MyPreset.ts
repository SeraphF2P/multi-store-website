import { MyPlugin } from "./MyPlugin";

import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [],
  plugins: [MyPlugin],
} satisfies Config;
export default config;
