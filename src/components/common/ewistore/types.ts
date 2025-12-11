export interface OrderStatus {
  label: string;
  fontColor: string;
  backgroundColor: string;
}

export interface OrderItem {
  orderNumber: number;
  orderType: string;
  stamp: number;
  date: string;
  time: string;
  totalNet: string;
  itemsCount: number;
  status: OrderStatus;
}

export interface OrderStatusStep {
  name: string;
  date: string;
  color: string;
  grayed: boolean;
}

export interface Finances {
  projectInvoiced: string;
  projectPaid: string;
  projectDue: string;
  projectOverdue: string;
}


export interface QuoteDetailsResponse {
  status: boolean;
  quoteDetails: OrderDetails;
}

export interface OrderDetailsItem {
  id: number;
  description: string;
  productCode: string;
  productPhotoURI?: string | null;
  photoURI?: string | null;
  quantityOriginal?: number;
  quantity?: number;
  rate: string;
  percentDiscount?: string;
  rateRRP?: string;
  variationCode?: string;
  variationName?: string | null;
  children?: OrderDetailsItem[];
}

export interface CreditNoteDetail {
  creditNoteNumber: number;
  documentURI: string;
  totalNet: string;
  stamp: number;
  date: string;
  time: string;
}

export interface OrderDetails {
  dateExpire: string;
  date: string;
  time: string;
  totalNet: string;
  items: OrderDetailsItem[];
  documentURI: string;
  invoiceID?: number;
  deliveryAddress: string;
  deliveryCharge: number;
  creditNotes?: CreditNoteDetail[];
  quoteExpired?: boolean;
}

export interface OrderDetailsResponse {
  orderDetails: OrderDetails;
  orderStatusSteps: OrderStatusStep[];
}

export interface QuoteDetailsResponse {
  status: boolean;
  quoteDetails: OrderDetails;
}

export interface OrdersListProps {
  projectID: number;
  contactID: number;
}


export interface BaseQuoteItem {
  id: number;
  stamp: number;
  date: string;
  time: string;
  totalNet: string;
  sold: boolean;
  quoteType: "Quote" | "Proforma";
  tooltipBackgroundColor: string;
  tooltipFontColor: string;
  itemsCount: number;
  quoteExpired: boolean;
  stampExpire?: number;
  dateExpire?: string;
  timeExpire?: string;
}

export interface QuoteItem extends BaseQuoteItem {
  quoteType: "Quote";
}

export interface ProformaItem extends BaseQuoteItem {
  quoteType: "Proforma";
  proforma: boolean; // Dodaję to pole dla zgodności
}

export interface OrderItem {
  orderNumber: number;
  orderType: string;
  stamp: number;
  date: string;
  time: string;
  totalNet: string;
  itemsCount: number;
  status: OrderStatus;
}

// Aktualizuj również QuoteItem w projekcie by używało BaseQuoteItem
export interface ProjectQuoteItem {
  id: number;
  stamp: number;
  date: string;
  time: string;
  totalNet: string;
  sold: boolean;
  quoteType: string;
  quoteExpired: boolean;
  tooltipBackgroundColor: string;
  tooltipFontColor: string;
  itemsCount: number;
}

