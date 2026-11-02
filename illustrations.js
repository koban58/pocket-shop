/* Self-contained miniature vector illustrations. No network and no image API. */
(() => {
  'use strict';
  const ink = '#554477';
  const art = {
    banana: `<path d="M17 30q8 35 39 21 10-5 12-17-13 13-31 9-12-3-18-17z" fill="#F7C953"/><path d="M20 33q14 28 36 17" fill="none" stroke="#F2AD3B" stroke-width="3"/><path d="m17 30-4-6 6-3 5 5M66 36l6-2-2-5-5 2" fill="#9F7953"/>`,
    lotion: `<rect x="27" y="26" width="29" height="41" rx="7" fill="#CEB9FC"/><path d="M29 33h25" stroke="#B297EE"/><rect x="33" y="18" width="17" height="9" rx="2" fill="#FCF9FF"/><path d="M41 18v-6h17" fill="none"/><path d="M58 12v4"/><rect x="33" y="43" width="17" height="15" rx="5" fill="#FFFCFF"/><path d="M39 51h6"/>`,
    milk: `<path d="M28 27h28l-4 40H32z" fill="#EDF7FF"/><path d="m28 27 9-15h14l5 15" fill="#BBDFF8"/><path d="M37 12v15m14-15v15"/><path d="M30 40h25v19H31z" fill="#90C8F7"/><path d="M41 44c-8 8 7 14 9 5-2-6-6-6-9-5z" fill="#FFF" stroke="none"/>`,
    apple: `<path d="M41 25C24 12 14 33 22 52c5 17 17 15 20 12 9 6 17-1 20-14 5-20-8-30-21-25Z" fill="#F68A91"/><path d="M42 26c-5-10 1-14 4-16" fill="none"/><path d="M45 18c8-9 18-5 20-4-4 9-13 10-20 4" fill="#78B990" stroke-width="2"/><path d="M29 35q-4 6-2 13" fill="none" stroke="#FFE4D4" stroke-width="3"/>`,
    eggs: `<path d="M19 46h44l-4 18H23z" fill="#F2CF92"/><path d="M25 48c-9-11 5-29 12-22 7 6 9 16 4 22M40 47c-6-13 4-29 12-24 7 5 11 16 4 25" fill="#FFF7E9"/><path d="M20 48h44"/>`,
    bread: `<path d="M22 33c-5-5-3-17 7-19 7-2 9 2 12 2 10-9 26-1 25 13v35H22z" fill="#D9985C"/><path d="M29 37c-6-8 0-16 8-14 5 1 6 5 9 5 5-7 14-3 14 7v21H29z" fill="#FFE1A3"/><path d="M38 40v8m13-10v8" stroke="#EDB879"/>`,
    rice: `<path d="M21 43c0 18 6 25 20 25s20-7 20-25z" fill="#E6D3FF"/><path d="M21 43h40"/><path d="M23 41c0-11 9-20 18-20s18 8 18 20" fill="#FFFDF9"/><path d="M31 32l3-2m8-2 2-3m5 11 3-2" stroke="#D6D1D0"/>`,
    carrot: `<path d="M37 27 24 64q-4 12 5 6l29-37z" fill="#FFA760"/><path d="m38 29-5-19q10-2 11 15m-6 2 17-16q8 7-12 20" fill="#75BB8B"/><path d="m35 42 8 2m-14 9 7 2" stroke="#E57F46"/>`,
    tomato: `<circle cx="41" cy="44" r="23" fill="#FF867D"/><path d="m41 28 4-10 3 11 11-6-5 11-13-3-11 4-7-10 13 4z" fill="#76B48A"/><path d="M29 46c1 7 6 11 11 12" fill="none" stroke="#FFD2BB" stroke-width="3"/>`,
    fish: `<path d="M19 42c14-19 30-18 43 0-14 21-29 19-43 0z" fill="#A4D7D8"/><path d="m61 42 12-14v28z" fill="#86BFC8"/><circle cx="31" cy="38" r="2" fill="#554477" stroke="none"/><path d="M44 31q2 11 0 22m9-19q3 9 0 16" fill="none" stroke="#73ACB8"/>`,
    meat: `<path d="M23 26c6-13 24-15 37-2 14 15 3 34-11 41-10 6-29-2-32-17-2-9 1-17 6-22z" fill="#F69AA1"/><path d="M30 32c5-8 17-8 25 1 10 11-2 25-10 29" fill="none" stroke="#FFE6D9" stroke-width="6"/>`,
    water: `<rect x="30" y="20" width="22" height="48" rx="7" fill="#AEDDF8"/><rect x="35" y="12" width="12" height="9" rx="2" fill="#D6E7F6"/><rect x="32" y="39" width="18" height="19" rx="2" fill="#EDF8FF"/><path d="M40 44c-7 9 0 13 3 9 3-3-2-6-3-9z" fill="#7EC4F2" stroke="none"/>`,
    coffee: `<path d="M21 31h37v22c0 13-9 17-18 17s-19-6-19-19z" fill="#C8AFE8"/><path d="M58 36h9q8 2 3 12-4 7-12 5" fill="none" stroke-width="5"/><path d="M30 13q-6 7 0 13m11-14q-6 7 0 13m11-12q-5 7 0 13" fill="none" stroke="#BC9C85"/>`,
    snack: `<path d="m26 19 32 0 8 46H18z" fill="#F7D78D"/><path d="M26 19q15 7 32 0m-37 34q18-6 41 0" fill="none"/><circle cx="41" cy="41" r="13" fill="#FEF3D5"/><path d="M36 40q3-8 10 0l-5 9z" fill="#ECA56E"/>`,
    icecream: `<path d="M32 43h19L41 72z" fill="#F0BD87"/><path d="M29 44a13 13 0 0 1 2-22 13 13 0 0 1 26 5 10 10 0 0 1-3 17z" fill="#FFCEE2"/><path d="M36 33q8-7 14 0" fill="none" stroke="#FFF" stroke-width="3"/>`,
    tofu: `<path d="m22 32 29-12 15 10v28L38 69 22 59z" fill="#FEFDF4"/><path d="m22 32 16 10 28-12M38 42v27" fill="none"/><path d="m38 42 28-12" fill="none"/><path d="M23 31 51 20l15 10" fill="none"/>`,
    shampoo: `<rect x="28" y="23" width="28" height="45" rx="8" fill="#8DD9C3"/><rect x="35" y="13" width="14" height="11" rx="2" fill="#E5FFF8"/><path d="M41 13V9h18" fill="none"/><rect x="33" y="40" width="18" height="18" rx="7" fill="#F0FFF9"/><path d="M39 46q6-6 6 2 0 5-6 4-3-2 0-6" fill="#8DD9C3" stroke="none"/>`,
    toothpaste: `<path d="m19 30 35-9 11 34-34 10z" fill="#B7E7FA"/><path d="m19 30 35-9 3 8-35 9z" fill="#F9FDFF"/><path d="m29 55 31-8" stroke="#83BFE5" stroke-width="5"/><path d="m20 30-4-10 38-10 3 11" fill="#D0D9E8"/>`,
    toothbrush: `<path d="M30 12h19v27H30z" fill="#C8F2ED"/><path d="M39 37v33" stroke="#9B83DD" stroke-width="10"/><path d="M30 17v18m6-18v18m7-18v18m6-18v18" stroke="#7ABBC6" stroke-width="2"/>`,
    tissue: `<rect x="16" y="36" width="50" height="28" rx="6" fill="#E8C6FB"/><path d="M27 36q-9-17 4-18 11 0 12 15c1-11 13-17 17-8 2 4-3 10-5 11" fill="#FFFBFF"/><path d="M26 43h30" stroke="#CC9DEE" stroke-width="4"/>`,
    detergent: `<path d="M29 22h27v46H24V32z" fill="#C6E4FA"/><rect x="34" y="12" width="16" height="11" rx="2" fill="#F6F9FF"/><rect x="30" y="39" width="20" height="18" rx="3" fill="#F9FCFF"/><circle cx="40" cy="48" r="6" fill="#B5B0ED"/><circle cx="56" cy="25" r="5" fill="#E8FBFC"/>`,
    soap: `<rect x="16" y="39" width="49" height="24" rx="12" fill="#F6B7C9"/><path d="M28 51q14-7 25 0" fill="none" stroke="#FFECF1" stroke-width="4"/><circle cx="28" cy="26" r="6" fill="#C4E9FC"/><circle cx="44" cy="18" r="4" fill="#C4E9FC"/><circle cx="54" cy="30" r="3" fill="#C4E9FC"/>`,
    sunscreen: `<path d="M29 18h24l-4 49H33z" fill="#F8DAB7"/><path d="M29 18h24l-1 10H30z" fill="#F9FCFF"/><circle cx="41" cy="45" r="10" fill="#FFF3D8"/><path d="M41 37v16m-8-8h16" stroke="#F3BB5A" stroke-width="3"/><rect x="34" y="12" width="14" height="7" rx="2" fill="#F9FCFF"/>`,
    toiletpaper: `<rect x="20" y="22" width="39" height="44" rx="7" fill="#FFFFFF"/><ellipse cx="40" cy="22" rx="19" ry="8" fill="#F4EEF9"/><ellipse cx="40" cy="23" rx="8" ry="4" fill="#D2C8D9"/><path d="M23 32h33" stroke="#E6DCEB"/>`,
    medicine: `<rect x="25" y="21" width="31" height="44" rx="6" fill="#FFFFFF"/><rect x="29" y="14" width="23" height="9" rx="2" fill="#D5C2F5"/><path d="M30 39h21v18H30z" fill="#FFE3E6"/><path d="M41 42v12m-6-6h12" stroke="#EF8B9D" stroke-width="4"/>`,
    battery: `<rect x="26" y="18" width="31" height="48" rx="6" fill="#9D8CEA"/><rect x="35" y="12" width="13" height="7" rx="2" fill="#D1C9E8"/><path d="m44 27-10 17h9l-5 15 15-20h-9z" fill="#FFE49D"/>`,
    pen: `<path d="m28 58 27-39 8 7-27 39-14 6z" fill="#B9B1ED"/><path d="m28 58 8 7-14 6z" fill="#F1C6A8"/><path d="m55 19 8 7 4-6-8-7z" fill="#7A68C1"/><path d="M29 61l4 4" stroke="#9D8CE0"/>`,
    clothing: `<path d="m29 18-15 12 11 15 8-7v30h28V38l8 7 11-15-16-12-10 8H39z" fill="#BBA8ED"/><path d="M39 26q8 11 15 0" fill="none" stroke="#F7F0FF" stroke-width="3"/>`,
    bag: `<path d="M23 30h39l-4 39H27z" fill="#CEB6F5"/><path d="M33 32v-8c0-11 18-11 18 0v8" fill="none" stroke-width="4"/><path d="M29 45h27" stroke="#E9DDFD" stroke-width="3"/>`,
    pet: `<path d="M21 43h41l-5 23H26z" fill="#D8B8A0"/><ellipse cx="41" cy="43" rx="21" ry="8" fill="#F5E7CF"/><path d="M31 40c1-10 20-10 20 0" fill="#AE875D"/><circle cx="35" cy="39" r="2" fill="#8E694C"/><circle cx="47" cy="39" r="2" fill="#8E694C"/>`,
    oil: `<path d="M31 28h23l5 39H27z" fill="#FFE2A1"/><path d="M36 13h14v16H36z" fill="#F0D4AB"/><path d="M36 13h14v8H36z" fill="#FFF2DA"/><path d="M41 41q-10 14 1 18 10 0 2-13z" fill="#EDB757"/>`,
    noodles: `<path d="M19 45h44l-6 20H25z" fill="#ECD2F7"/><path d="M24 41q5-10 11 0t12 0 12 0" fill="none" stroke="#E8B66D" stroke-width="4"/><path d="m30 14 6 26m11-26-3 26" fill="none" stroke="#D4AA81" stroke-width="3"/>`,
    flower: `<path d="M41 38v31" stroke="#69B890" stroke-width="5"/><path d="M41 54q-15-14-18-3 5 11 18 9m0-12q15-15 18-4-2 11-18 10" fill="#8BD5A7"/><g fill="#F8ADCB"><ellipse cx="41" cy="20" rx="10" ry="15"/><ellipse cx="41" cy="20" rx="10" ry="15" transform="rotate(72 41 33)"/><ellipse cx="41" cy="20" rx="10" ry="15" transform="rotate(-72 41 33)"/></g><circle cx="41" cy="33" r="9" fill="#FFE1A1"/>`,
    generic: `<path d="M22 34h40l-5 33H27z" fill="#D7C5FC"/><path d="M32 35V26c0-13 20-13 20 0v9" fill="none" stroke-width="4"/><path d="m35 49 5 5 10-12" fill="none" stroke="#FFFFFF" stroke-width="4"/>`
  };
  const colors = {
    banana:'#fff4d4',lotion:'#f2e9ff',milk:'#e8f4ff',apple:'#fff0ec',eggs:'#fff4df',bread:'#fff0df',rice:'#f1e7ff',carrot:'#fff0df',tomato:'#ffeded',fish:'#e7f7f4',meat:'#ffeced',water:'#e7f5ff',coffee:'#f2e8ff',snack:'#fff2df',icecream:'#ffeff5',tofu:'#f9f6eb',shampoo:'#e3f9ef',toothpaste:'#e6f5ff',toothbrush:'#e8f8f5',tissue:'#f6eaff',detergent:'#e7f3ff',soap:'#fff0f5',sunscreen:'#fff1d8',toiletpaper:'#f4efff',medicine:'#fff0f2',battery:'#f1edff',pen:'#edeaff',clothing:'#f1ebff',bag:'#f2ebff',pet:'#f8f0e6',oil:'#fff4df',noodles:'#f3eaff',flower:'#ffeff6',generic:'#f1ebff'
  };
  const render = (key, className='') => {
    const valid = Object.hasOwn(art,key) ? key : 'generic';
    return `<span class="product-art ${className}" style="--art-bg:${colors[valid]}"><svg viewBox="0 0 82 82" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3">${art[valid]}</svg></span>`;
  };
  window.PocketArt = {render, keys:Object.keys(art)};
})();
