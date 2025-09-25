declare interface IUserData {
  projectId: number;
  houseId: number;
  rooms: number[];
  "price[min]": number;
  "price[max]": number;
  minFloor: number;
  "area[min]": number;
  "area[max]": number;
}

declare interface IOrgData {
  value: string;
  unrestricted_value: string;
  data: {
    kpp: string | null;
    kpp_largest: string | null;
    capital: any | null;
    invalid: boolean | null;
    management: IManagement | null;
    founders: any[] | null;
    managers: any[] | null;
    predecessors: any[] | null;
    successors: any[] | null;
    branch_type: string;
    branch_count: number;
    source: string | null;
    qc: string | null;
    hid: string;
    type: "LEGAL" | "INDIVIDUAL";
    state: IState;
    opf: IOpf;
    name: IName;
    inn: string;
    ogrn: string;
    okpo: string | null;
    okato: string | null;
    oktmo: string | null;
    okogu: string | null;
    okfs: string | null;
    okved: string | null;
    okveds: any[] | null;
    authorities: any | null;
    documents: any | null;
    licenses: any | null;
    finance: IFinance | null;
    address: IAddress | null;
    phones: string[] | null;
    emails: string[] | null;
    ogrn_date: number | null;
    okved_type: string | null;
    employee_count: number | null;
  };
}

declare interface IManagement {
  name: string;
  post: string;
  start_date: number;
  disqualified: boolean | null;
}

declare interface IState {
  status: "ACTIVE" | "LIQUIDATED" | string;
  code: string | null;
  actuality_date: number;
  registration_date: number;
  liquidation_date: number | null;
}

declare interface IOpf {
  type: string;
  code: string;
  full: string;
  short: string;
}

declare interface IName {
  full_with_opf: string;
  short_with_opf: string;
  latin: string | null;
  full: string;
  short: string;
}

declare interface IFinance {
  tax_system: string | null;
  income: number | null;
  expense: number | null;
  revenue: number | null;
  debt: number | null;
  penalty: number | null;
  year: number | null;
}

declare interface IAddress {
  value: string;
  unrestricted_value: string;
  invalidity: any | null;
  data: IAddressData;
}

declare interface IAddressData {
  postal_code: string | null;
  country: string;
  country_iso_code: string;
  federal_district: string | null;
  region_fias_id: string | null;
  region_kladr_id: string | null;
  region_iso_code: string | null;
  region_with_type: string | null;
  region_type: string | null;
  region_type_full: string | null;
  region: string | null;
  area_fias_id: string | null;
  area_kladr_id: string | null;
  area_with_type: string | null;
  area_type: string | null;
  area_type_full: string | null;
  area: string | null;
  city_fias_id: string | null;
  city_kladr_id: string | null;
  city_with_type: string | null;
  city_type: string | null;
  city_type_full: string | null;
  city: string | null;
  city_area: string | null;
  city_district_fias_id: string | null;
  city_district_kladr_id: string | null;
  city_district_with_type: string | null;
  city_district_type: string | null;
  city_district_type_full: string | null;
  city_district: string | null;
  settlement_fias_id: string | null;
  settlement_kladr_id: string | null;
  settlement_with_type: string | null;
  settlement_type: string | null;
  settlement_type_full: string | null;
  settlement: string | null;
  street_fias_id: string | null;
  street_kladr_id: string | null;
  street_with_type: string | null;
  street_type: string | null;
  street_type_full: string | null;
  street: string | null;
  stead_fias_id: string | null;
  stead_cadnum: string | null;
  stead_type: string | null;
  stead_type_full: string | null;
  stead: string | null;
  house_fias_id: string | null;
  house_kladr_id: string | null;
  house_cadnum: string | null;
  house_flat_count: string | null;
  house_type: string | null;
  house_type_full: string | null;
  house: string | null;
  block_type: string | null;
  block_type_full: string | null;
  block: string | null;
  entrance: string | null;
  floor: string | null;
  flat_fias_id: string | null;
  flat_cadnum: string | null;
  flat_type: string | null;
  flat_type_full: string | null;
  flat: string | null;
  flat_area: string | null;
  square_meter_price: string | null;
  flat_price: number | null;
  room_fias_id: string | null;
  room_cadnum: string | null;
  room_type: string | null;
  room_type_full: string | null;
  room: string | null;
  postal_box: string | null;
  fias_id: string | null;
  fias_code: string | null;
  fias_level: string | null;
  fias_actuality_state: string | null;
  kladr_id: string | null;
  geoname_id: string | null;
  capital_marker: string | null;
  okato: string | null;
  oktmo: string | null;
  tax_office: string | null;
  tax_office_legal: string | null;
  timezone: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  beltway_hit: string | null;
  beltway_distance: string | null;
  metro: any[] | null;
  divisions: any[] | null;
  qc_geo: string | null;
  qc_complete: string | null;
  qc_house: string | null;
  history_values: any | null;
  unparsed_parts: any | null;
  source: string | null;
  qc: string | null;
}

declare interface IIndustry {
  id: number;
  name: string;
  parent_id: number;
}

declare interface ICategory {
  id: number;
  name: string;
  parent_id: number | null;
}

declare interface IUserCompany {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  inn: string;
  city: number;
  city_data: ICityResponse;
  industry: number;
  industry_data: IIndustry;
  about_us: string;
  interest_categories: IIndustry[];
  sites: string[];
  image_path: string;
  status: "verify" | "no-verify";
  plan: "premium" | "free";
  user: IUserProfile;
}

declare interface IUserFavorite {
  id: number;
  user_id: number;
  offer_id: number;
  offers?: IUserOfferFront;
  users: IUserProfile;
}

declare interface IUserProfile {
  id: number;
  email: string;
  name: string;
  password: string;
  status: string;
  verification_code: number;
  company: IUserCompany;
}

declare interface IUserOffer {
  type: string;
  vid: string;
  name: string;
  category: ICategory[];
  price: string;
  coordinates: [number, number] | null;
  description: string;
  images: any[];
  videos: string[];
}

declare interface IUserOfferFront {
  id: number;
  type: string;
  vid: string;
  name: string;
  category: ICategory[];
  user: IUserProfile;
  price: string;
  coordinates: [number, number] | null;
  description: string;
  images: string[];
  videos: string[];
  user_id: number;
  state: "active";
}

declare interface IUserStore {
  userInfo: {
    company: IUserCompany | null;
    favorites: IUserFavorite[] | null;
  };
}

declare interface IUserOfferStore {
  userOffer: {
    offer: IUserOffer;
  };
}

declare interface ISearchFilterStore {
  searchFilter: IDataSearchFilter;
}

declare interface IDataSearchFilter {
  type: OfferType;
  vid: OfferVid;
  category: ICategory[] | null;
  price: [number, number] | null;
  countryCompanyId: number | null;
}

declare interface ICityResponse {
  id: number;
  name: string;
  name_alt: string;
  label: string;
  type: string;
  typeShort: string;
  contentType: string;
  okato: string;
  oktmo: string;
  isDualName: boolean;
  isCapital: boolean;
  zip: number;
  population: number;
  yearFounded: string;
  yearCityStatus: number;
  name_en: string;
  namecase: NameCase;
  coords: Coords;
  timezone: Timezone;
  region: Region;
}

declare interface NameCase {
  dative: string;
  ablative: string;
  genitive: string;
  locative: string;
  accusative: string;
  nominative: string;
  prepositional: string;
}

declare interface Coords {
  lat: number;
  lon: number;
}

declare interface Timezone {
  tzid: string;
  mskOffset: string;
  utcOffset: string;
  abbreviation: string;
}

declare interface Region {
  id: string;
  area: number;
  code: number;
  guid: string;
  name: string;
  type: string;
  label: string;
  okato: string;
  oktmo: string;
  capital: Capital;
  name_en: string;
  district: string;
  fullname: string;
  namecase: NameCase;
  typeShort: string;
  "iso_3166-2": string;
  population: number;
  contentType: string;
  yearFounded: number;
}

declare interface Capital {
  id: string;
  name: string;
  label: string;
  okato: string;
  oktmo: string;
  contentType: string;
}

declare interface IChatItems {
  id: number;
  chat_name: string;
  deal_id: number;
  user_id: number;
  deal: {
    id: number;
    owner_id: number;
    owner_offer_id: number;
    client_id: number;
    client_offer_id: number;
    status_client: DealStatusClient;
    statue_owner: DealStatusOwner;
    created_at: string;
    owner_offer: IUserOfferFront;
    client_offer: IUserOfferFront;
    client: IUserProfile;
    owner: IUserProfile;
  };
}

declare interface IMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  file_type: "files" | "images" | null;
  file_paths: any;
  selected_chat_id: number | null;
  created_at: string;
}

declare interface IGroupedMessages {
  date: string;
  messages: IMessage[];
}

type OfferType = "product" | "service";
type OfferVid = "online" | "offline";
type DealStatusClient =
  | "wait-confirm"
  | "wait-doc-confirm"
  | "doc-confirmed"
  | "completed"
  | "send-review"
  | "canceled";

type DealStatusOwner =
  | "wait-confirm"
  | "wait-doc-confirm"
  | "doc-confirmed"
  | "completed"
  | "send-review"
  | "canceled";
