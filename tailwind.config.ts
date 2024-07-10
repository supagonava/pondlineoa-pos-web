import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    light: "#ffd1b3", // สีส้มอ่อน
                    DEFAULT: "#ff8c00", // สีส้มหลัก
                    dark: "#cc6e00", // สีส้มเข้ม
                },
                secondary: {
                    light: "#3e3e3e", // สีเทาเข้ม
                    DEFAULT: "#2e2e2e", // สีดำ
                    dark: "#1e1e1e", // สีดำเข้ม
                },
                accent: {
                    light: "#ffe4cc", // สีขาวอมส้ม
                    DEFAULT: "#ffebcd", // สีขาวอมเหลือง
                    dark: "#ffdab9", // สีส้มอมชมพูอ่อน
                },
            },
            fontFamily: {
                sans: ["ui-sans-serif", "system-ui"],
                serif: ["ui-serif", "Georgia"],
                mono: ["ui-monospace", "SFMono-Regular"],
                display: ["Oswald"],
                body: ['"Open Sans"'],
            },
        },
    },
    plugins: [],
};
export default config;
