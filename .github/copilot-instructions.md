# Tip, Please

- Android-first Expo React Native TypeScript app. Web is a preview, not the distribution target.
- Keep the opening screen limited to bill total, tip presets/custom percentage, receipt tip, and total.
- First-launch percentage is 15%. Persist the last selected percentage, including custom and zero values.
- Split, tax exclusion, and location guidance belong in optional panels. Never request location at launch.
- Location must never override the saved percentage. Save only the selected country, never coordinates.
- State-tax lookup is opt-in within the sales-tax panel. Browser state lookup uses offline US boundaries; never persist detected states or coordinates or apply reference rates automatically.
- Calculate in integer minor currency units. Split receipt and tip exactly, assigning remainders explicitly.
- Do not infer receipt tax or included service charges from location.
- Sales/use tax estimates are separate from tip calculations. Require an explicit applicable rate; never infer private-sale exemptions.
- Tax reference tables are dated guidance, not combined address-level rates. Do not automatically apply standard VAT to restaurant receipts.
- Regional guidance requires sources and review dates. Unsupported countries must not receive invented guidance.
- Run `npm test`, `npm run typecheck`, and `npm run check:build` after changes.
- Native directories are generated. GitHub builds a bundled test-signed APK; production uses separate signing.

## Setup Progress

- [x] Requirements clarified: Android first, GitHub APK download, eventual Google Play.
- [x] Expo project scaffolded with stable compatible dependencies.
- [x] Calculator, saved preferences, and hidden extras implemented.
- [x] Required extensions: none.
- [x] Complete final compilation and interaction checks.
- [x] Create and run preview task.
- [x] Complete launch and distribution documentation.