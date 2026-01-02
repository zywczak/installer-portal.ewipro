import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Pagination,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Finances, OrderItem, OrdersListProps, ProformaItem, QuoteItem } from "./ewistore/types";
import { fetchOrders } from "./ewistore/api";
import { OrderCard } from "./ewistore/OrderCard";
import { OrderDetailsDialog } from "./ewistore/OrderDetailsDialog";
import { QuoteDetailsDialog } from "./ewistore/QuoteDetailsDialog";
import EWIStore from "../../assets/ewistore_render_specialists.svg";
import QuotesAndDraftsSection from "./QuotesAndDraftsSection";

const ITEMS_PER_PAGE = 12;

interface OrdersHeaderProps {
  onAddOrder: () => void;
  finances: Finances;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onAddOrder, finances }) => {
  const summaryCards = [
    { title: "Project invoiced", amount: `£${finances.projectInvoiced}`, color: "textPrimary" },
    { title: "Due", amount: `£${finances.projectDue}`, color: "error" },
    { title: "Overdue", amount: `£${finances.projectOverdue}`, color: "error" },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <img src={EWIStore} alt="EWI Store" style={{ height: "50px", marginBottom: "4px" }} />
        </Box>

        <Button
  variant="contained"
  color="primary"
  onClick={onAddOrder}
  sx={{
    bgcolor: "#54A852",
    "&:hover": { bgcolor: "#397838" },
    minWidth: "40px",
    width: "40px",
    height: "40px",
    padding: 0,
    borderRadius: "50%",
  }}
>
  <AddIcon />
</Button>

      </Box>

      <Box display="flex" gap={2} mb={3}>
        {summaryCards.map((card, index) => (
          <Card key={index} sx={{ flex: 1, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography fontWeight="bold" color={card.color} sx={{ fontSize: 20, mb: 0.5 }}>
                {card.amount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

    </Box>
  );
};

interface EmptyStateProps {
  onAddOrder: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddOrder }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    p={5}
    borderRadius={3}
    textAlign="center"
  >
   <img src={EWIStore} alt="EWI Store" style={{ height: "72px", marginBottom: "16px" }} />
    
    <Typography variant="body1" color="textSecondary" sx={{ mb: 5 }}>
      Place your first order for project materials at EWI Store.
    </Typography>
    
    <Button
      variant="outlined"
      sx={{
        borderColor: "#54A852",
        color: "#54A852",
        borderRadius: "50px",
        padding: "10px 40px",
        fontSize: "1rem",
        fontWeight: "bold",
        "&:hover": {
          borderColor: "#397838",
          backgroundColor: "rgba(84, 168, 82, 0.04)",
        },
      }}
      onClick={() => {
  console.log("START ORDERING clicked");
        onAddOrder();
      }}
    >
      START ORDERING
    </Button>
  </Box>
);

export const Orders: React.FC<OrdersListProps> = ({ projectID, contactID }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [proformas, setProformas] = useState<ProformaItem[]>([]);
  const [page, setPage] = useState(1);
  const [quotesPage, setQuotesPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | ProformaItem | null>(null);

  const [finances, setFinances] = useState<Finances>({
  projectInvoiced: "0.00",
  projectPaid: "0.00",
  projectDue: "0.00",
  projectOverdue: "0.00"
});

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetchOrders(projectID, contactID).then((data) => {
      setOrders(data.orders);
      setProformas(data.proformas);
      setQuotes(data.quotes);
       setFinances(data.finances); 
    });
  }, [projectID, contactID]);

  const unsoldQuotes = quotes.filter(quote => !quote.sold);

  const allOrders = [...orders, ...proformas.map(p => ({
    orderNumber: p.id,
    orderType: "proforma",
    stamp: p.stamp,
    date: p.date,
    time: p.time,
    totalNet: p.totalNet,
    itemsCount: p.itemsCount,
    status: {
      label: "Proforma",
      fontColor: "#673ab7",
      backgroundColor: "#ede7f6"
    }
  } as OrderItem))];

  const isListEmpty = allOrders.length === 0 && unsoldQuotes.length === 0;

  const handleAddOrder = () => {
    globalThis.location.hash = `createOrder/${projectID}/${contactID}`;
  };

  if (isListEmpty) {
    return (
      <Box p={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
        <EmptyState onAddOrder={handleAddOrder} />
      </Box>
    );
  }

  const pageCount = Math.ceil(allOrders.length / ITEMS_PER_PAGE);
  const ordersToShow = allOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const quotesPageCount = Math.ceil(unsoldQuotes.length / ITEMS_PER_PAGE);
  const quotesToShow = unsoldQuotes.slice((quotesPage - 1) * ITEMS_PER_PAGE, quotesPage * ITEMS_PER_PAGE);

  return (
    <Box p={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
      <OrdersHeader onAddOrder={handleAddOrder} finances={finances} />

      <Box display="flex" alignItems="center" mt={3} mb={2}>
        <Typography fontWeight="bold" variant="h6">
          Zamówienia i Proformy ({allOrders.length})
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {allOrders.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Brak zamówień i proform dla tego projektu.
        </Typography>
      ) : (
        <>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {ordersToShow.map((order) => {
              if (order.orderType === "proforma") {
                const proforma = proformas.find(p => p.id === order.orderNumber);
                return (
                  <OrderCard 
                    key={order.orderNumber} 
                    order={order} 
                    onClick={(item) => {
                      if (proforma) setSelectedQuote(proforma);
                    }} 
                  />
                );
              }
              return (
                <OrderCard 
                  key={order.orderNumber} 
                  order={order} 
                  onClick={(item) => setSelectedOrder(item as OrderItem)} 
                />
              );
            })}
          </Box>

          {pageCount > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#54A852",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#397838ff" }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {unsoldQuotes.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <QuotesAndDraftsSection unsoldQuotesLength={unsoldQuotes.length} />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {quotesToShow.map((quote) => (
              <OrderCard key={quote.id} quote={quote} onClick={(item) => setSelectedQuote(item as QuoteItem)} />
            ))}
          </Box>

          {quotesPageCount > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={quotesPageCount}
                page={quotesPage}
                onChange={(_, value) => setQuotesPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#54A852",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#397838ff" }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      <OrderDetailsDialog 
        order={selectedOrder} 
        projectID={projectID}
        contactID={contactID}
        onClose={() => setSelectedOrder(null)} 
      />
      
      <QuoteDetailsDialog 
        quote={selectedQuote}
        projectID={projectID}
        contactID={contactID}
        onClose={() => setSelectedQuote(null)} 
      />
    </Box>
  );
};