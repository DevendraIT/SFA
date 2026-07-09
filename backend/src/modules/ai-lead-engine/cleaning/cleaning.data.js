/**
 * Geo lookup maps for country, state, and city normalization.
 * Deterministic — no AI, no network calls.
 */

// ISO-3166 country aliases → canonical name
export const COUNTRY_MAP = {
  us: 'United States', usa: 'United States', 'united states': 'United States', 'united states of america': 'United States',
  uk: 'United Kingdom', gb: 'United Kingdom', 'great britain': 'United Kingdom', 'united kingdom': 'United Kingdom',
  in: 'India', india: 'India',
  ca: 'Canada', canada: 'Canada',
  au: 'Australia', australia: 'Australia',
  de: 'Germany', germany: 'Germany', deutschland: 'Germany',
  fr: 'France', france: 'France',
  sg: 'Singapore', singapore: 'Singapore',
  ae: 'United Arab Emirates', uae: 'United Arab Emirates', 'united arab emirates': 'United Arab Emirates',
  jp: 'Japan', japan: 'Japan',
  cn: 'China', china: 'China',
  br: 'Brazil', brazil: 'Brazil',
  mx: 'Mexico', mexico: 'Mexico',
  za: 'South Africa', 'south africa': 'South Africa',
  nl: 'Netherlands', netherlands: 'Netherlands', 'the netherlands': 'Netherlands',
  nz: 'New Zealand', 'new zealand': 'New Zealand',
  ng: 'Nigeria', nigeria: 'Nigeria',
};

// US state aliases → canonical name
export const US_STATE_MAP = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas',
  ca: 'California', co: 'Colorado', ct: 'Connecticut', de: 'Delaware',
  fl: 'Florida', ga: 'Georgia', hi: 'Hawaii', id: 'Idaho',
  il: 'Illinois', in: 'Indiana', ia: 'Iowa', ks: 'Kansas',
  ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi',
  mo: 'Missouri', mt: 'Montana', ne: 'Nebraska', nv: 'Nevada',
  nh: 'New Hampshire', nj: 'New Jersey', nm: 'New Mexico', ny: 'New York',
  nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio', ok: 'Oklahoma',
  or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah',
  vt: 'Vermont', va: 'Virginia', wa: 'Washington', wv: 'West Virginia',
  wi: 'Wisconsin', wy: 'Wyoming', dc: 'Washington D.C.',
  // Full name → canonical (for the case someone types "new york" etc.)
  alabama: 'Alabama', alaska: 'Alaska', arizona: 'Arizona', arkansas: 'Arkansas',
  california: 'California', colorado: 'Colorado', florida: 'Florida', georgia: 'Georgia',
  illinois: 'Illinois', indiana: 'Indiana', iowa: 'Iowa', kansas: 'Kansas',
  kentucky: 'Kentucky', louisiana: 'Louisiana', maine: 'Maine', maryland: 'Maryland',
  massachusetts: 'Massachusetts', michigan: 'Michigan', minnesota: 'Minnesota',
  mississippi: 'Mississippi', missouri: 'Missouri', montana: 'Montana', nebraska: 'Nebraska',
  nevada: 'Nevada', ohio: 'Ohio', oklahoma: 'Oklahoma', oregon: 'Oregon',
  pennsylvania: 'Pennsylvania', tennessee: 'Tennessee', texas: 'Texas', utah: 'Utah',
  virginia: 'Virginia', washington: 'Washington', wisconsin: 'Wisconsin', wyoming: 'Wyoming',
  'new york': 'New York', 'new jersey': 'New Jersey', 'new mexico': 'New Mexico',
  'north carolina': 'North Carolina', 'north dakota': 'North Dakota',
  'south carolina': 'South Carolina', 'south dakota': 'South Dakota',
  'west virginia': 'West Virginia', 'rhode island': 'Rhode Island',
  'new hampshire': 'New Hampshire',
};

// Indian state aliases → canonical name
export const IN_STATE_MAP = {
  mh: 'Maharashtra', maharashtra: 'Maharashtra',
  dl: 'Delhi', delhi: 'Delhi',
  ka: 'Karnataka', karnataka: 'Karnataka',
  tn: 'Tamil Nadu', 'tamil nadu': 'Tamil Nadu',
  ts: 'Telangana', telangana: 'Telangana',
  gj: 'Gujarat', gujarat: 'Gujarat',
  rj: 'Rajasthan', rajasthan: 'Rajasthan',
  up: 'Uttar Pradesh', 'uttar pradesh': 'Uttar Pradesh',
  wb: 'West Bengal', 'west bengal': 'West Bengal',
  pb: 'Punjab', punjab: 'Punjab',
  hr: 'Haryana', haryana: 'Haryana',
  br: 'Bihar', bihar: 'Bihar',
  mp: 'Madhya Pradesh', 'madhya pradesh': 'Madhya Pradesh',
  ap: 'Andhra Pradesh', 'andhra pradesh': 'Andhra Pradesh',
  kl: 'Kerala', kerala: 'Kerala',
  as: 'Assam', assam: 'Assam',
  jh: 'Jharkhand', jharkhand: 'Jharkhand',
  uk: 'Uttarakhand', uttarakhand: 'Uttarakhand',
  hp: 'Himachal Pradesh', 'himachal pradesh': 'Himachal Pradesh',
  ga: 'Goa', goa: 'Goa',
  mn: 'Manipur', manipur: 'Manipur',
};

// Well-known global cities → their canonical form (title-case)
export const KNOWN_CITIES = new Set([
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata',
  'pune', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
  'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
  'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
  'san francisco', 'seattle', 'denver', 'boston', 'nashville', 'las vegas',
  'london', 'manchester', 'birmingham', 'glasgow', 'edinburgh', 'liverpool',
  'paris', 'berlin', 'munich', 'frankfurt', 'hamburg',
  'toronto', 'vancouver', 'montreal', 'calgary', 'ottawa',
  'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide',
  'singapore', 'dubai', 'abu dhabi', 'riyadh', 'doha',
  'tokyo', 'osaka', 'seoul', 'beijing', 'shanghai', 'shenzhen', 'hong kong',
  'johannesburg', 'cape town', 'nairobi', 'lagos', 'cairo',
  'amsterdam', 'brussels', 'zurich', 'stockholm', 'oslo', 'copenhagen',
  'sao paulo', 'mexico city', 'buenos aires', 'bogota', 'lima',
]);

// Disposable/free email domains that indicate low-quality prospects
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'throwaway.email', 'yopmail.com',
  'trashmail.com', 'tempmail.com', 'sharklasers.com', 'guerrillamailblock.com',
  'grr.la', 'guerrillamail.info', 'spam4.me', 'test.com', 'example.com',
]);

// Company suffix normalization
export const COMPANY_SUFFIXES = /,?\s*(Inc|Incorporated|LLC|L\.L\.C|Ltd|Limited|Corp|Corporation|Co\.|Company|GmbH|Pvt|Private|S\.A\.?|PLC|LLP)\.?$/i;
