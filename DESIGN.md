# Design System Theme

This document outlines the core aesthetic and functional parameters of our digital product's user interface.

## Color Palette

Our color scheme is designed for a `light` interface, prioritizing clarity and visual hierarchy.

- **Primary Color**: `#07111E` — The foundational brand color, used for key interactive elements and prominent branding. Token: `--primary` / `bg-primary`
- **Secondary Color**: `#81B9E9` — A supporting accent, suitable for less prominent UI components, chips, and secondary actions. Token: `--secondary` / `bg-secondary`
- **Secondary Foreground**: `#07111E` — Dark text on secondary backgrounds. Token: `--secondary-foreground`

## Typography

All text uses **Manrope** (loaded via `next/font/google`, variable: `--font-manrope`).

- **Headlines**: `manrope` — Token: `--font-heading` → `font-heading`
- **Body Text**: `manrope` — Token: `--font-sans` → `font-sans`
- **Labels**: `manrope` — Same font family, vary weight with `font-medium` or `font-semibold`

### Font Size Scale

Sizes available as `text-{n}` utilities with paired line heights:

| Token | Size | Line Height |
|---|---|---|
| `text-8` | 8px | 12px |
| `text-9` | 9px | 14px |
| `text-10` | 10px | 14px |
| `text-10.5` | 10.5px | 16px |
| `text-11` | 11px | 16px |
| `text-12` | 12px | 16px |
| `text-14` | 14px | 20px |
| `text-16` | 16px | 24px |
| `text-18` | 18px | 28px |
| `text-20` | 20px | 28px |
| `text-24` | 24px | 32px |
| `text-28` | 28px | 36px |
| `text-32` | 32px | 40px |
| `text-36` | 36px | 44px |
| `text-40` | 40px | 48px |
| `text-44` | 44px | 52px |
| `text-48` | 48px | 56px |
| `text-54` | 54px | 64px |
| `text-60` | 60px | 72px |
| `text-64` | 64px | 72px |
| `text-72` | 72px | 80px |
| `text-80` | 80px | 96px |
| `text-96` | 96px | 112px |

### Font Weights

Use Tailwind's built-in weight utilities:

| Utility | Weight |
|---|---|
| `font-light` | 300 |
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-bold` | 700 |

## Button Variants

| Variant | Background | Text | Usage |
|---|---|---|---|
| `default` | `#07111E` (primary) | white | Primary actions on light backgrounds |
| `inverted` | `white` | `#07111E` (primary) | Primary actions on dark backgrounds (hero banners, dark cards) |
| `secondary-inverted` | `white/10` (translucent) | `white` | Secondary actions on dark backgrounds |
| `secondary` | `#81B9E9` (secondary) | `#07111E` | Secondary / supporting actions |
| `outline` | transparent | foreground | Tertiary actions, bordered style |
| `ghost` | transparent | foreground | Subtle actions, no border |
| `destructive` | destructive tint | destructive | Dangerous or irreversible actions |
| `link` | none | primary | Inline text links |

**Font weight**: `font-semibold` for all button labels.

## Shape and Form

- **Roundedness**: `2` (Moderate) — Base radius: `0.5rem` (8px). Token: `--radius`

| Token | Value |
|---|---|
| `--radius-sm` | `0.3rem` |
| `--radius-md` | `0.4rem` |
| `--radius-lg` | `0.5rem` |
| `--radius-xl` | `0.7rem` |
| `--radius-2xl` | `0.9rem` |
| `--radius-3xl` | `1.1rem` |
| `--radius-4xl` | `1.3rem` |

## Spacing

- **Spacing**: `2` (Normal) — Standard spacing scale in px. Token prefix: `--space-{n}`

| Token | Value |
|---|---|
| `--space-4` | 4px |
| `--space-8` | 8px |
| `--space-12` | 12px |
| `--space-16` | 16px |
| `--space-20` | 20px |
| `--space-24` | 24px |
| `--space-28` | 28px |
| `--space-32` | 32px |
| `--space-36` | 36px |
| `--space-40` | 40px |
| `--space-44` | 44px |
| `--space-48` | 48px |
| `--space-56` | 56px |
| `--space-64` | 64px |
| `--space-80` | 80px |
| `--space-96` | 96px |
| `--space-112` | 112px |
| `--space-128` | 128px |
| `--space-144` | 144px |
| `--space-160` | 160px |
| `--space-176` | 176px |
| `--space-192` | 192px |
| `--space-208` | 208px |
| `--space-224` | 224px |
| `--space-240` | 240px |
| `--space-256` | 256px |
| `--space-288` | 288px |
| `--space-320` | 320px |
| `--space-384` | 384px |

Use via arbitrary values: `p-[var(--space-24)]`, `gap-[var(--space-16)]`, or inline styles.
