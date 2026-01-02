import {  Finances, QuoteDetailsResponse, OrderItem, QuoteItem, ProformaItem  } from './types';

export interface OrdersResponse {
  status: boolean;
  finances: {
    projectInvoiced: string;
    projectPaid: string;
    projectDue: string;
    projectOverdue: string;
  };
  quotes: Array<{
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
    quoteExpired?: boolean;
    stampExpire?: number;
    dateExpire?: string;
    timeExpire?: string;
  }>;
  proformas: Array<{
    id: number;
    stamp: number;
    date: string;
    time: string;
    totalNet: string;
    sold: boolean;
    quoteType: "Proforma";
    tooltipBackgroundColor: string;
    tooltipFontColor: string;
    itemsCount: number;
    quoteExpired?: boolean;
    stampExpire?: number;
    dateExpire?: string;
    timeExpire?: string;
  }>;
  orders: OrderItem[];
}

export const fetchOrders = async (
  projectID: number,
  contactID: number
): Promise<{ 
  orders: OrderItem[]; 
  proformas: ProformaItem[];
  quotes: QuoteItem[];
  finances: Finances;
}> => {
  try {
    const token = localStorage.getItem("access");
    const response = await fetch("https://api-veen-e.ewipro.com/installer/info/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: "getOrdersList",
        projectID,
        contactID
      })
    });

    const data: OrdersResponse = await response.json();

    const proformas: ProformaItem[] = (data.proformas || []).map(proforma => ({
      ...proforma,
      proforma: true,
      quoteID: proforma.id.toString(),
      stampExpire: proforma.stampExpire || 0,
      dateExpire: proforma.dateExpire || "",
      timeExpire: proforma.timeExpire || "",
      quoteExpired: proforma.quoteExpired || false,
      sellerName: ""
    }));

    const quotes: QuoteItem[] = (data.quotes || [])
      .filter(q => q.quoteType === "Quote")
      .map(quote => ({
        ...quote,
        quoteType: "Quote" as const,
        proforma: false,
        quoteID: quote.id.toString(),
        stampExpire: quote.stampExpire || 0,
        dateExpire: quote.dateExpire || "",
        timeExpire: quote.timeExpire || "",
        quoteExpired: quote.quoteExpired || false,
        sellerName: ""
      }));

    return {
      orders: data.orders || [],
      proformas,
      quotes,
      finances: data.finances
    };
  } catch (error) {
    console.error("API Error (orders):", error);
    return { orders: [], proformas: [], quotes: [], finances: { projectInvoiced: "0.00", projectPaid: "0.00", projectDue: "0.00", projectOverdue: "0.00" } };
  }
};

export const fetchQuoteDetails = async (
  quoteID: number
): Promise<QuoteDetailsResponse> => {
  try {
    const token = localStorage.getItem("access");
    console.log("Fetching quote details for quoteID:", quoteID);

    const response = await fetch("https://api-veen-e.ewipro.com/installer/info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: "getQuoteDetails",
        quoteID: quoteID
      })
    });

    // *** WAŻNE ***
    const data = await response.json();

    console.log("Fetched quote details:", data);

    return data;
  } catch (error) {
    console.error("API Error (quote details):", error);
    throw error;
  }
};
