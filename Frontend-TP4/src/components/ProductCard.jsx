import { useState } from "react";

import StockForm from "./StockForm";

export default function ProductCard({
  product
}) {

  const [showForm, setShowForm] =
    useState(false);

  return (
    <div className="product-card">

      <h3>
        {product.name}
      </h3>

      <p>
        Cantidad: {product.quantity}
      </p>

      <button
        onClick={() =>
          setShowForm(!showForm)
        }
      >
        Modificar stock
      </button>

      {
        showForm && (
          <StockForm
            product={product}
            onClose={() =>
              setShowForm(false)
            }
          />
        )
      }

    </div>
  );
}