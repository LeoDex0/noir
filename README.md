# NOIR

Concept website for a fictional fine dining restaurant in Lyon. Project 03 of the LeoDex portfolio.

Live: https://noir-lyon.vercel.app

NOIR, its chef, menu, address and reservations are invented. The reservation form runs in the browser only and sends nothing.

## Stack

Next.js 16, React 19, TypeScript, CSS Modules, GSAP with ScrollTrigger and SplitText, Lenis (mouse and trackpad only).

## Run

```
npm install
npm run dev
```

Production build: `npm run build` then `npm start`.

## Structure

- `src/app` page, layout, metadata, 404
- `src/components` one component per section, each with its own CSS module
- `src/content` copy for the menu, philosophy, gallery and opening hours, plus the photo list
- `src/photos` graded photographs

## Photography

Photos from Unsplash, used under the Unsplash License. They were colour graded to one warm, low key look.
