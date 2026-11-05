/** Opens the floating mortgage calculator from anywhere on the page, optionally priced for one listing. */
export const MORTGAGE_EVENT = 'afikey:mortgage';
export type MortgageDetail = { price?: number; title?: string };
export const openMortgage = (detail: MortgageDetail = {}) => window.dispatchEvent(new CustomEvent<MortgageDetail>(MORTGAGE_EVENT, { detail }));
