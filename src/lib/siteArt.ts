const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const createClinicArt = (
  title: string,
  accent: string,
  secondary: string,
  detail: string,
) =>
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.88)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" rx="44" fill="url(#bg)" />
      <circle cx="960" cy="170" r="220" fill="url(#glow)" />
      <circle cx="230" cy="760" r="260" fill="rgba(255,255,255,0.12)" />
      <path d="M90 650C250 540 420 540 610 620C790 700 930 690 1110 560V900H90Z" fill="rgba(255,255,255,0.16)" />
      <rect x="110" y="120" width="340" height="340" rx="44" fill="rgba(255,255,255,0.14)" />
      <rect x="750" y="500" width="260" height="190" rx="30" fill="rgba(13,24,22,0.14)" />
      <path d="M302 205C350 230 386 277 386 338C386 405 330 463 260 463C205 463 154 425 136 368C121 320 137 267 178 228C209 198 256 186 302 205Z" fill="rgba(255,255,255,0.85)" />
      <path d="M273 239C297 253 314 278 314 309C314 347 283 377 245 377C221 377 198 364 185 344C165 313 173 271 205 249C225 234 251 229 273 239Z" fill="rgba(13,24,22,0.12)" />
      <path d="M797 559C869 520 954 539 1003 605C1048 663 1048 742 1003 800H770C744 764 730 723 730 679C730 630 754 587 797 559Z" fill="rgba(255,255,255,0.86)" />
      <text x="110" y="770" fill="white" font-family="Georgia, serif" font-size="78" font-weight="700">${title}</text>
      <text x="112" y="828" fill="rgba(255,255,255,0.86)" font-family="Arial, sans-serif" font-size="30" letter-spacing="4">${detail}</text>
    </svg>
  `);
