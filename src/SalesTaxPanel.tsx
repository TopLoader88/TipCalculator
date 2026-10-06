import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { formatMoney, parseAmount } from './calculator';
import { calculateSalesTax, parseTaxRate, type TaxMode } from './salesTax';
import { countryTaxGuides, findTaxGuide, PRIVATE_CAVEAT, privateVehicleSources, STATE_RATE_DATE, STATE_SOURCE, stateRates, TAX_REVIEWED } from './taxGuidance';

export function SalesTaxPanel({ regionCode, fontsLoaded }: { regionCode: string | null; fontsLoaded: boolean }) {
  const [country, setCountry] = useState(regionCode ?? 'US');
  const [amountText, setAmountText] = useState('');
  const [rateText, setRateText] = useState('');
  const [mode, setMode] = useState<TaxMode>('add');
  const [privateSale, setPrivateSale] = useState(false);
  const [choosingCountry, setChoosingCountry] = useState(false);
  const [search, setSearch] = useState('');
  const [showStates, setShowStates] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [sourceError, setSourceError] = useState('');
  const [currencyText, setCurrencyText] = useState('USD');
  const guide = findTaxGuide(country);
  const currency = country === 'OTHER' ? currencyText.toUpperCase() : guide.currency;
  let currencyValid = /^[A-Z]{3}$/.test(currency);
  let digits = guide.digits;
  try {
    const options = new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions();
    if (country === 'OTHER') digits = options.maximumFractionDigits ?? 2;
  } catch { currencyValid = false; }
  const amount = digits <= 2 ? parseAmount(amountText, digits) : null;
  const rate = parseTaxRate(rateText);
  const result = currencyValid && amount !== null && rate !== null ? calculateSalesTax(amount, rate, mode) : null;
  const money = (value: number) => formatMoney(value, currency, digits);
  const font = { fontFamily: fontsLoaded ? 'Manrope' : undefined };
  const heading = { fontFamily: fontsLoaded ? 'ManropeSemi' : undefined };

  async function openSource(url: string) {
    setSourceError('');
    try { await Linking.openURL(url); }
    catch { setSourceError('Could not open the source. Try again when online.'); }
  }

  return <View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Choose tax country" onPress={() => setChoosingCountry(!choosingCountry)} style={styles.row}>
      <Text style={[styles.text, heading, styles.grow]}>{guide.name} / {currency}</Text>
      <Feather name={choosingCountry ? 'chevron-up' : 'chevron-down'} size={20} color="#146D4D" />
    </Pressable>
    {choosingCountry && <>
      <TextInput accessibilityLabel="Search tax countries" placeholder="Search countries" value={search} onChangeText={setSearch} style={[styles.input, font]} />
      {countryTaxGuides.filter(option => `${option.name} ${option.code}`.toLowerCase().includes(search.toLowerCase())).map(option => (
        <Pressable key={option.code} accessibilityRole="radio" accessibilityLabel={option.name}
          accessibilityState={{ checked: option.code === country }} style={styles.row} onPress={() => {
            if (option.currency !== guide.currency || option.code === 'OTHER') setAmountText('');
            setCountry(option.code); setChoosingCountry(false); setRateText(''); setSearch(''); setShowStates(false);
          }}>
          <Text style={[styles.text, font, styles.grow]}>{option.name}</Text>
          <Feather name={country === option.code ? 'check-circle' : 'circle'} size={20} color="#146D4D" />
        </Pressable>
      ))}
    </>}
    {country === 'OTHER' && <>
      <Text style={[styles.label, heading]}>Currency code</Text>
      <TextInput accessibilityLabel="Tax currency code" value={currencyText} onChangeText={value => { setCurrencyText(value); setAmountText(''); }}
        autoCapitalize="characters" maxLength={3} style={[styles.input, font]} />
      {(!currencyValid || digits > 2) && <Text accessibilityRole="alert" style={styles.error}>Use a valid currency with zero, one or two minor-unit decimals.</Text>}
    </>}
    <View style={styles.row}>
      <Text style={[styles.text, heading, styles.grow]}>Private-party purchase</Text>
      <Switch accessibilityLabel="Private-party purchase" value={privateSale} onValueChange={setPrivateSale}
        trackColor={{ false: '#CBD5CE', true: '#146D4D' }} thumbColor="#FFFFFF" />
    </View>
    {privateSale && <Text style={[styles.note, font]}>{PRIVATE_CAVEAT}</Text>}
    <View style={styles.segment}>
      {([{ value: 'add', label: 'Add tax' }, { value: 'included', label: 'Tax included' }] as const).map(option => (
        <Pressable key={option.value} accessibilityRole="radio" accessibilityLabel={option.label}
          accessibilityState={{ checked: mode === option.value }} onPress={() => setMode(option.value)}
          style={[styles.segmentButton, mode === option.value && styles.selected]}>
          <Text style={[styles.text, heading, mode === option.value && styles.selectedText]}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
    <Text style={[styles.label, heading]}>{mode === 'add' ? 'Taxable price before tax' : 'Tax-inclusive amount'} ({currency})</Text>
    <TextInput accessibilityLabel="Tax purchase amount" value={amountText} onChangeText={setAmountText} keyboardType={digits === 0 ? 'number-pad' : 'decimal-pad'}
      placeholder={digits === 0 ? '0' : '0.00'} maxLength={9} style={[styles.input, font]} />
    <Text style={[styles.label, heading]}>Confirmed applicable rate (%)</Text>
    <TextInput accessibilityLabel="Sales tax rate" value={rateText} onChangeText={setRateText} keyboardType="decimal-pad" maxLength={8}
      placeholder="Enter rate" style={[styles.input, font]} />
    {(amount === null || (rateText !== '' && rate === null)) && <Text accessibilityRole="alert" style={styles.error}>Enter a valid amount and a rate from 0 to 100, with up to four rate decimals.</Text>}
    <Text style={[styles.note, font]}>Estimate for a single taxable amount and rate. No tip is added. For mixed-rate or partially exempt purchases, calculate each taxable portion separately.</Text>
    <View style={styles.result}>
      {[
        ['Before tax', result ? money(result.subtotal) : '--'],
        ['Sales / use tax', result ? money(result.tax) : '--'],
        ['Total with tax', result ? money(result.total) : '--'],
      ].map(([label, value]) => <View key={label} style={styles.resultRow}>
        <Text style={[styles.text, font, styles.grow]}>{label}</Text>
        <Text accessibilityLabel={`${label} ${value}`} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5} style={[styles.value, heading]}>{value}</Text>
      </View>)}
    </View>
    <Text style={[styles.referenceTitle, heading]}>{guide.reference}</Text>
    <Text style={[styles.note, font]}>{guide.note}</Text>
    {country !== 'OTHER' && <Pressable accessibilityRole="link" accessibilityLabel="Tax authority source" style={styles.row} onPress={() => openSource(guide.url)}>
      <Text style={[styles.link, heading, styles.grow]}>{country === 'US' ? 'State rate reference source' : 'Tax authority source'}</Text><Feather name="external-link" size={16} color="#146D4D" />
    </Pressable>}
    {country === 'US' && <>
      <Pressable accessibilityRole="button" accessibilityLabel="US state tax reference" style={styles.row} onPress={() => setShowStates(!showStates)}>
        <Text style={[styles.text, heading, styles.grow]}>US state tax reference</Text><Feather name={showStates ? 'chevron-up' : 'chevron-down'} size={20} color="#146D4D" />
      </Pressable>
      {showStates && <>
        <Text style={[styles.note, font]}>Snapshot as of {STATE_RATE_DATE}. Reference only: these rates are not automatically used in the calculation.</Text>
        <TextInput accessibilityLabel="Search states" placeholder="State name or abbreviation" value={stateSearch} onChangeText={setStateSearch} style={[styles.input, font]} />
        {stateRates.filter(([code, name]) => `${code} ${name}`.toLowerCase().includes(stateSearch.toLowerCase())).map(([code, name, rateValue]) => <View key={code} style={styles.row}>
          <Text style={[styles.text, font, styles.grow]}>{name}</Text><Text style={[styles.text, heading]}>{rateValue}%</Text>
        </View>)}
        <Pressable accessibilityRole="link" accessibilityLabel="State tax reference source" onPress={() => openSource(STATE_SOURCE)} style={styles.row}>
          <Text style={[styles.link, heading]}>Tax Foundation July 2026 table</Text>
        </Pressable>
      </>}
      {privateSale && privateVehicleSources.map(source => <View key={source.url} style={styles.reference}>
        <Text style={[styles.text, heading]}>{source.name}</Text>
        <Text style={[styles.note, font]}>{source.note}</Text>
        <Pressable accessibilityRole="link" accessibilityLabel={source.name} style={styles.row} onPress={() => openSource(source.url)}>
          <Text style={[styles.link, heading]}>Official vehicle tax rules</Text><Feather name="external-link" size={16} color="#146D4D" />
        </Pressable>
      </View>)}
    </>}
    <Text style={[styles.note, font]}>Sources reviewed {TAX_REVIEWED}. Rates and rules may change. Reference coverage is limited to listed countries; this is not a determination of tax liability.</Text>
    {!!sourceError && <Text accessibilityRole="alert" style={styles.error}>{sourceError}</Text>}
  </View>;
}

const styles = StyleSheet.create({
  content: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#DCE4DF' },
  grow: { flex: 1 },
  text: { fontSize: 14, color: '#202624', lineHeight: 22 },
  label: { fontSize: 13, color: '#606B65', marginTop: 6 },
  input: { borderWidth: 1, borderColor: '#DCE4DF', borderRadius: 6, minHeight: 50, fontSize: 18, color: '#202624', paddingHorizontal: 14, paddingVertical: 10 },
  note: { fontSize: 12, lineHeight: 20, color: '#606B65' },
  error: { fontSize: 13, lineHeight: 20, color: '#AD3545' },
  segment: { flexDirection: 'row', borderWidth: 1, borderColor: '#DCE4DF', borderRadius: 6, overflow: 'hidden' },
  segmentButton: { flex: 1, minHeight: 48, paddingHorizontal: 6, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: '#146D4D' },
  selectedText: { color: '#FFFFFF' },
  result: { borderTopWidth: 2, borderBottomWidth: 1, borderColor: '#146D4D', paddingVertical: 10 },
  resultRow: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 44 },
  value: { flex: 1, textAlign: 'right', fontSize: 21, color: '#146D4D', fontVariant: ['tabular-nums'] },
  referenceTitle: { fontSize: 16, color: '#202624', marginTop: 14 },
  link: { fontSize: 13, color: '#146D4D', lineHeight: 20 },
  reference: { gap: 8, marginTop: 12 },
});