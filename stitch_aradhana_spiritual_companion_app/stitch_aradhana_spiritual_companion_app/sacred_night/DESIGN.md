---
name: Sacred Night
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353435'
  on-surface: '#e5e2e2'
  on-surface-variant: '#c7c6cc'
  inverse-surface: '#e5e2e2'
  inverse-on-surface: '#313031'
  outline: '#909096'
  outline-variant: '#46464c'
  surface-tint: '#c3c6d6'
  primary: '#c3c6d6'
  on-primary: '#2c303c'
  primary-container: '#0b0f1a'
  on-primary-container: '#787b8a'
  inverse-primary: '#5a5e6c'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#ffb95a'
  on-tertiary: '#462a00'
  tertiary-container: '#1a0d00'
  on-tertiary-container: '#ac6f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dfe2f2'
  primary-fixed-dim: '#c3c6d6'
  on-primary-fixed: '#171b27'
  on-primary-fixed-variant: '#434653'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#ffb95a'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#131314'
  on-background: '#e5e2e2'
  surface-variant: '#353435'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

The design system is built upon the philosophy of **Sacred Minimalism**. It aims to evoke the emotional response of entering a quiet temple at midnight—a space of profound stillness, introspection, and celestial guidance. The target audience seeks a spiritual refuge from the digital noise, requiring an interface that feels intentional and rhythmic rather than transactional.

The aesthetic leans heavily into **Glassmorphism**, utilizing translucent layers and backdrop filters to mimic the quality of light passing through thin silk or frosted glass. Depth is achieved not through physical shadows, but through luminous glows and varying levels of opacity, creating a sense of "ethereal weightlessness." This approach avoids the "tech dashboard" feel by prioritizing atmosphere, soft transitions, and a focus on cosmic symbolism.

## Colors

The palette is anchored in the **Deep Midnight Navy** (#0B0F1A), which serves as the infinite canvas of the night sky. 

- **Primary (Background):** Midnight Navy (#0B0F1A) is used for all base surfaces.
- **Accents (Celestial):** Soft Gold (#D4AF37) and Amber (#FFB347) represent candlelight and starlight. These are used sparingly for calls to action and critical focus points.
- **Secondary (Ethereal):** Muted Lavender (#967BB6) and Dusty Rose (#E0B0FF) provide soft gradients and subtle differentiation for decorative elements or secondary navigation categories.
- **Surface:** All "glass" containers utilize white at 4-8% opacity with a heavy backdrop blur.

## Typography

Typography establishes the balance between the ancient and the modern. 

**Playfair Display** is used for headlines to convey authority, elegance, and a literary quality. Its high contrast strokes mirror the flickering light of a candle. 

**Inter** is the functional workhorse for body text and chat interfaces. It should be typeset with generous line heights and slightly reduced weights (Light 300 or Regular 400) to maintain the airy, minimalist feel. Labels and small metadata should use Inter with increased letter spacing and uppercase styling to evoke a sense of organized ritual.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy centered on symmetry and "the golden mean." 

- **Desktop:** 12-column grid with wide 32px gutters to allow the background depth to breathe.
- **Mobile:** 4-column grid with 24px side margins. 
- **Rhythm:** A strict 8px spatial scale is used, but with a preference for larger gaps (32px, 48px, 64px) between major sections to prevent visual clutter. 

Content should be vertically centered where possible to emphasize a "meditative focus" on the current task or message.

## Elevation & Depth

Depth is conveyed through **Tonal Luminosity** rather than shadows. 

1. **Base Layer:** The solid Midnight Navy background.
2. **Glass Layer:** 5% White opacity background, 20px Backdrop Blur, and a 1px solid white border at 10% opacity. This layer "floats" above the base.
3. **Active Layer:** Elements that require focus (like active chat bubbles or selected cards) utilize a soft **Outer Glow**. This glow uses the Accent Gold (#D4AF37) at 15% opacity with a 30px blur radius, creating a "halo" effect.
4. **Interaction:** Hovering or tapping an element should increase the backdrop blur intensity rather than increasing shadow darkness.

## Shapes

The shape language is organic and soft. Standard containers use a 16px (1rem) radius to feel approachable and safe. Avoid sharp 90-degree corners entirely. 

Interactive elements like buttons or chat input fields may use the "Pill" style (rounded-full) to further the "Soft Minimalism" aesthetic, suggesting a pebble-like, tactile quality.

## Components

### Buttons
Primary buttons use a solid Gold-to-Amber gradient with dark Navy text. Secondary buttons are "Ghost" style with a 1px Gold border and transparent center.

### Chat Interface
The chat bubbles should not have tails. The user's messages are simple text against the navy background; the agent's messages are housed in a "Glass" container. The typing indicator should be a subtle pulsing glow.

### Cards & Modules
Cards used for daily horoscopes or meditation sessions should feature a subtle gradient overlay (Lavender to Rose at 5% opacity) to distinguish them from standard UI containers.

### Inputs
Search and text inputs are bottom-border only (1px white at 20% opacity) to maintain a minimalist, "writing on a scroll" feel. When focused, the border transitions to Gold with a soft bottom glow.

### Indicators (Progress/Status)
Use circular "Luna" phases or simple glowing dots instead of standard linear bars to track progress through a spiritual exercise.