import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export const MyPlugin = plugin(
  ({ addBase, addUtilities }) => {
    addBase({
      ".dark": {
        "--theme": "23,25,48",
        "--revert-theme": "241,245,249",
        "--text": "241,245,249",
        "--revert-text": "23,25,48",
        "--theme-shadow": "245,245,245",
        "--primary": "81,83,121",
        "--card": "23,25,48",
        "--alert": "200,50,50",
        "--success": "50,200,50",
      },
      ".light": {
        "--theme": "226,232,240",
        "--revert-theme": "30,41,59",
        "--text": "23,25,48",
        "--revert-text": "241,245,249",
        "--theme-shadow": "0,0,0",
        "--primary": "120,120,250",
        "--card": "241,245,249",
        "--alert": "200,50,50",
        "--success": "50,200,50",
      },
    });
    addBase({
      "*": {
        " @apply border-border ": {},
      },
      // "* > *": {
      //   "transition-property": "background-color, border-color, text-decoration-color, fill, stroke",
      //   "transition-timing-function": "linear",
      //   "transition-duration": "400ms"
      // },
      body: {
        "@apply bg-theme text-revert-theme": {},
        "font-feature-settings": '"rlig" 1, "calt" 1',

      },
      h1: { "@apply capitalize text-2xl": {} },
      h2: { "@apply capitalize text-xl": {} },
      h3: { "@apply capitalize text-lg": {} },
      h4: { "@apply capitalize text-base": {} },
      p: { "@apply text-sm": {} },
      li: { "@apply list-none": {} },
      a: { "@apply !text-current": {} },
    });
    addUtilities({
      ".remove-scroll-bar": {
        "scroll-behavior": "smooth",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
      ".remove-scroll-bar::-webkit-scrollbar": {
        display: "none",
      },
      ".text-border": {
        "text-shadow":
          `-1px -1px 0 rgb(var(--theme)),
            1px -1px 0 rgb(var(--theme)),
           -1px 1px 0 rgb(var(--theme)),
            1px 1px 0 rgb(var(--theme))`
      },
      ".variant-alert": {
        "--variant": "200,0,0 !important"
      },
      ".variant-success": {
        "--variant": "0,200,0 !important"
      },
      ".variant-info": {
        "--variant": "0,0,200 !important"
      }
    });
  },
  {
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          theme: "rgb(var(--theme),<alpha-value>)",
          "revert-theme": "rgb(var(--revert-theme),<alpha-value>)",
          text: "rgb(var(--text),<alpha-value>)",
          "revert-text": "rgb(var(--revert-text),<alpha-value>)",
          primary: "rgb(var(--primary),<alpha-value>)",
          card: "rgb(var(--card),<alpha-value>)",
          variant: "rgb(var(--variant,0,0,0),<alpha-value>)",
          alert: "rgb(var(--alert),<alpha-value>)",
          success: "rgb(var(--success),<alpha-value>)",
        },

        boxShadow: {
          overlay: "inset 0 0 200px 0 rgba(255,255,255,0)",
        },
        boxShadowColor: {
          dynamic: "rgb(var(--theme-shadow),<alpha-value>)",
        },
        screens: {
          mn: "420px",
          xs: "576px",
        },
        gridAutoColumns: {
          fluid: "repeat(auto-fit,minmax(0,1fr))",
        },
        gridAutoRows: {
          fluid: "repeat(auto-fit,minmax(0,1fr))",
        },
        aspectRatio: {
          square: "1",
          "golden-w": "16/9",
          "golden-h": "9/16",
        },
        animation: {
          reset: "reset var(--reset-duration) infinite var(--reset-delay)",
          fadein:
            "fadein var(--fadein-duration,0.3s) forwards  var(--fadein-delay,0s)",
          fadeout:
            "fadeout var(--fadeout-duration,0.3s) forwards var(--fadeout-delay,0s)",
          buzz: "buzz 2s infinite linear  ",
          slideDown: "slideDown 0.3s forwards linear  ",
          slideUp: "slideUp 0.3s forwards linear  ",
        },
        keyframes: {
          reset: {
            "50%": {
              transform:
                "translate(0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);",
            },
            "0%,100%": {
              transform:
                "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));",
            },
          },
          fadein: {
            to: {
              opacity: "var(--fadein-opacity,1)",
              transform:
                "translate(var(--fade-translate-x,0) , var(--fade-translate-y,0)) rotate(var(--fade-rotate)) skewX(var(--fade-skew-x,0)) skewY(var(--fade-skew-y,0)) scaleX(var(--fade-scale-x,1)) scaleY(var(--fade-scale-y,1));",
            },
          },
          fadeout: {
            from: {
              opacity: "var(--fadeout-opacity,1)",
              transform:
                "translate(var(--fade-translate-x,0) , var(--fade-translate-y,0)) rotate(var(--fade-rotate)) skewX(var(--fade-skew-x,0)) skewY(var(--fade-skew-y,0)) scaleX(var(--fade-scale-x,1)) scaleY(var(--fade-scale-y,1));",
            },
          },
          buzz: {
            "0%,20%,40%,60%,80%,100%": {
              transform:
                "rotate(0deg) ",
            },
            "10%,50%": {
              transform:
                "rotate(-12.5deg) ",
            },
            "30%,70%": {
              transform:
                "rotate(12.5deg)",
            },
          },
          slideDown: {
            from: {
              height: "0"
            },
            to: {
              height: "var(--radix-collapsible-content-height)"
            }
          }
          , slideUp: {
            from: {
              height: "var(--radix-collapsible-content-height)"
            },
            to: {
              height: "0"
            }
          }
        },
      },
    },
  });
export default MyPlugin;
