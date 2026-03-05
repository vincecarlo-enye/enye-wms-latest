import { createContext, useContext, useState } from "react";

const WarehouseContext = createContext();

export function WarehouseProvider({ children }) {
  const [currentWarehouse, setCurrentWarehouse] = useState(
    () => localStorage.getItem("activeWarehouse") ?? "main"
  );

  const toggleWarehouse = () => {
    setCurrentWarehouse((prev) => {
      const next = prev === "main" ? "cebu" : "main";
      localStorage.setItem("activeWarehouse", next);
      return next;
    });
  };

  const switchWarehouse = (warehouse) => {
    localStorage.setItem("activeWarehouse", warehouse);
    setCurrentWarehouse(warehouse);
  };

  return (
    <WarehouseContext.Provider
      value={{ currentWarehouse, setCurrentWarehouse: switchWarehouse, toggleWarehouse }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  return useContext(WarehouseContext);
}