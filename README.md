# Tip, please.

Android-first tip calculator built with Expo and TypeScript. The opening screen shows the bill, percentage, receipt tip and total. First launch selects 15%; subsequent launches restore the last selected percentage, including custom values and zero.

## Try it

Run `npm ci`, then `npm run web -- --port 8086` for the browser preview. The VS Code task **Tip calculator: tax preview** starts the same preview. Android is the distribution target; browser preview does not support automatic country lookup.

Open **Split bill & tax** for equal shares and receipt-tax exclusion. Each person's bill and tip are divided in integer minor units, with remainders assigned explicitly.

Open **Sales tax & private purchases** within that panel to calculate sales/use tax on a separately entered purchase. Choose **Add tax** for a before-tax price or **Tax included** to extract existing tax. Enter a confirmed applicable rate; blank means unknown, not zero. No tip is added by this tool, and it does not alter the restaurant bill or saved tip percentage.

Private-party purchase mode shows jurisdiction and item-type warnings. It does not determine exemptions or legal tax liability. Vehicles can use special taxable values, use taxes and registration rules. Enter the confirmed taxable amount, not necessarily the cash price. Fees, credits, mixed-rate items and special valuation rules are not calculated automatically.

## Tax reference coverage

- All 50 US states plus DC: general statewide reference snapshot as of July 1, 2026, not address-level combined or restaurant-specific rates.
- All 27 EU members: standard VAT table last checked by Your Europe July 13, 2026. Reduced, product-specific and special-territory rates are not inferred.
- UK, Japan, Australia, Canada, New Zealand and Singapore: sourced standard-rate and exception guidance.
- Canada guidance does not replace a province-specific taxability determination.
- Other locations: manually entered rate and currency, with no invented guidance. The calculator supports currencies with zero, one or two minor-unit decimals; it does not convert exchange rates.

Every reference shows sources and the app's review date, October 6, 2026. References never automatically fill the rate field. Consult the receipt or applicable tax authority for the exact rate. Full research links and limitations are in [docs/tax-research.md](docs/tax-research.md).

Location is optional and requested only from its panel. Only the country choice is saved, never coordinates. Native reverse geocoding may use platform location services and require network access. No background tracking. Location never changes the tip percentage. Country changes that change currency clear the old bill and tax amounts.

## Install on Android through GitHub

The **Android APK** GitHub Actions workflow runs on pushes to `main` and can be started manually. It installs dependencies, runs checks, generates native Android files, builds a bundled release APK with test signing, and uploads an artifact named `tip-please-android`.

Push a version tag such as `v0.1.0` to create a prerelease with a directly downloadable `tip-please-android.apk`. In a private repository, sign in to the permitted GitHub account on your phone, open **Releases**, and download the APK. Allow installation from that browser when Android asks. Core calculations work without Expo Go or a computer after installation. Device lookup and external source links may need internet.

Builds include ARM64 phone and x86_64 emulator support. Android 7+ is required by this React Native version. This is a preview APK, not a Play Store production release. The generated debug signing key is for testing only; protect a dedicated production key for store distribution. Preview data/signing continuity must be planned before moving to production.

## Emulator

An existing Pixel 5 AVD named `pw` was found on this machine. Its Android SDK and Java executables were not available on the current terminal path. With Android Studio, SDK and Java configured, `npm run android` builds and launches the app. A downloaded APK can also be installed with `adb install path/to/tip-please-android.apk`. Do not modify generated native directories; change Expo configuration instead.

## Checks

```sh
npm test
npm run typecheck
npm run check:build
npx expo export --platform android --output-dir dist-android
```

`npm run assets` regenerates the PNG app icons. `npm run build:android` generates the Android project but does not compile an APK on its own.

Expo SDK 54 was selected because the initially generated SDK 58 dependency set referenced an unpublished font package. Expo doctor passed on SDK 54. npm audit still reports transitive toolchain advisories after non-breaking fixes. Review and upgrade the SDK/dependencies before production; do not force an incompatible React Native upgrade merely to clear an audit report.

## Google Play later

Choose and reserve the final package ID (currently `com.tipplease.calculator`), set up an Expo/EAS project and a Play Console developer account, configure production signing and versioning, then build an AAB with the `production` profile in [eas.json](eas.json). Complete privacy/data-safety disclosures, location-permission rationale, testing requirements, store assets and current target-SDK checks. GitHub preview signing must not be used as the production signing strategy. iOS publication is a separate future validation and signing effort.