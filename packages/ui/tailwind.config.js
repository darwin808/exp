/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    fontFamily: {
      Regular: ["GolosUiRegular", "sans-serif"],
      Medium: ["GolosUiMedium", "sans-serif"],
      Bold: ["GolosUiBold", "sans-serif"],
      Vf: ["GolosUiVf", "sans-serif"]
    },

    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2560px",
        "6xl": "3840px" // 4K resolution
      }
    },
    extend: {
      colors: {
        neutrals: {
          20: "#f7f7f7",
          25: "#e7e7e7",
          50: "#c7c7c7",
          100: "#939598",
          125: "#a7a7a7",
          150: "#979797",
          175: "#777777",
          200: "#575757",
          225: "#333333",
          250: "#202020",
          "lightest-gray": "#c2c2c2",
          ghostgray: "#f5f2f2"
        },
        red: {
          10: "#FFF2F2",
          25: "#ffc9c9",
          50: "#db3f3f",
          75: "#a52113",
          100: "#931111"
        },
        yellow: {
          25: "#fff9c0",
          50: "#fff065",
          100: "#fed604",
          125: "#ffc801",
          150: "#c7a43e"
        },
        green: {
          10: "#ECFFE5",
          25: "#96cc84",
          50: "#31c251",
          100: "#2ecd7d",
          125: "#098d1f",
          150: "#03751c"
        },
        orange: {
          10: "#FFF2E5",
          25: "#f4841b",
          50: "#f3841b",
          75: "#D96900"
        },
        blue: {
          25: "#f3f6ff",
          30: "#f2fafd",
          50: "#059ed8",
          100: "#001a88",
          125: "#104777",
          150: "#052846",
          classic: "#104777",
          "mb-classic-blue": "#0d395f",
          "mb-alice-blue": "#f2fafd",
          "mb-blue": "#001a88"
        },
        tertiary: {
          "mb-azure": "#059ed8",
          "mb-azure-secondary": "#8537A7"
        },
        disabled: {
          bg: "#d7d7d7"
        },
        tonal: {
          "bg-default": "#F3F6FF"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
