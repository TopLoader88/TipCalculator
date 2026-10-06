# Tax Research

App research reviewed October 6, 2026. These are references, not legal determinations or automatic rate estimates. Retrieval/review dates do not make every rate effective on that date.

## United States

[Tax Foundation, State and Local Sales Tax Rates, Midyear 2026](https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/) provides the July 1, 2026 statewide table. Additional local and special taxes can apply. Zero general statewide tax does not establish exemption; Alaska local taxes and category-specific taxes elsewhere can still apply. California's 7.25% includes the mandatory local minimum. Virginia's 5.3% and Utah's 6.1% include mandatory local components. Hawaii and New Mexico tax structures differ from conventional retail sales tax.

Exact precision cross-checks: [Minnesota statute](https://www.revisor.mn.gov/statutes/cite/297A.62) (6.875%), [Missouri DOR](https://dor.mo.gov/taxation/business/tax-types/sales-use/) (4.225%), [New Jersey Division of Taxation](https://www.nj.gov/treasury/taxation/sales_use_tax_FAQ.shtml) (6.625%). Tax Foundation's narrative specifies New Mexico at 4.875%, despite rounded table display.

[California CDTFA vehicle purchaser guide](https://www.cdtfa.ca.gov/industry/vehicles-vessels-aircraft/vehicles.htm): private-party vehicles for use in California generally incur use tax unless an exemption/exclusion applies. Registration address determines the applicable sales/use tax rate including district taxes. Gifts and qualifying family transfers have documented exceptions; private-party status alone is not an exemption.

[Texas Comptroller private-party vehicle guide](https://comptroller.texas.gov/taxes/motor-vehicle/private-party-spv.php): motor vehicle tax generally uses 6.25% and, in many private used-vehicle transactions, the greater of price or 80% of standard presumptive value. Exceptions and appraisals apply. The app does not calculate SPV, registration fees, credits or exemptions.

## International

- [Your Europe EU VAT table](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm): all 27 member standard rates; page last checked July 13, 2026. Restaurant/product reduced rates and special regions such as the Azores and Canary Islands are outside the standard table. Consult national authorities or the [Taxes in Europe database](https://ec.europa.eu/taxation_customs/tedb/#/vat-search).
- [UK GOV.UK VAT rates](https://www.gov.uk/vat-rates): standard 20%, reduced 5%, zero and exempt categories. Not every meal/item receives the standard rate.
- [Japan National Tax Agency](https://www.nta.go.jp/english/taxes/consumption_tax/01.htm): standard combined consumption tax 10%, reduced 8% for qualifying food/drink excluding alcohol and dining out. Taxable sales have business-purpose conditions.
- [Australian Taxation Office](https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/how-gst-works): GST generally 10%; GST-free supplies exist. GST-registered businesses generally include GST in taxable prices. Source last updated September 14, 2026.
- [Canada Revenue Agency](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html): GST/HST depends on place and type of supply; separate provincial taxes may apply. Ontario HST 13%, Nova Scotia 14%, New Brunswick/Newfoundland and Labrador/PEI 15%. Other GST regions 5% with applicable provincial taxes. Source modified April 8, 2026.
- [New Zealand Inland Revenue](https://www.ird.govt.nz/gst): GST 15%, with zero-rated, exempt and special supplies.
- [Singapore IRAS](https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/basics-of-gst/current-gst-rates): GST 9% on taxable supplies by registered businesses, with zero-rated and exempt supplies. Source last updated June 13, 2025.

Coverage is not worldwide tax certification. Other countries use manual rates with an explicit unsupported-guide state. Country choice and private-sale choice do not determine taxability. A single-rate estimate cannot allocate mixed-rate baskets, non-taxable items, special assessments or compounding taxes.

## Calculation Rules

All amounts use integer minor currency units. Add-tax mode rounds `amount * rate / 100` to the nearest minor unit. Included-tax mode rounds `amount * rate / (100 + rate)` and subtracts it from the entered total. Reference rates are never selected automatically. Invoice-level and line-level rounding can differ, so actual invoices take precedence.