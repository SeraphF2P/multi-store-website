import { MyPlugin } from "./MyPlugin";

import type { Config } from "tailwindcss";
import  Forms from "@tailwindcss/forms";

const config = {
  darkMode: ["class"],
  content: [],
  plugins: [MyPlugin,Forms({strategy:"class"})],
} satisfies Config;
export default config;
