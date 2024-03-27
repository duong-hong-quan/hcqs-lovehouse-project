import React from "react";

const CurrencyFormatter = ({ amount }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
     // useGrouping: false,
      maximumFractionDigits: 20,
    }).format(amount);
  };

  return <>{formatCurrency(amount)}</>;
};

export default CurrencyFormatter;
