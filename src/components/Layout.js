import React, { createContext, useContext, useState } from 'react';
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { CartContext } from '../components/CartContext'

// Create provider tat use in intier page
function LayoutProvider({ children }) {
  if(!sessionStorage.getItem("cart")) sessionStorage.setItem("cart", JSON.stringify([]));
  const [cartQuantity, setCartQuantity] = useState(JSON.parse(sessionStorage.getItem("cart")).length);


  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity}}>
      {children}
    </CartContext.Provider>
  );
}

const Layout = () => {
  return (
    <LayoutProvider>
      <Header />
      <Outlet />
      <Footer />
    </LayoutProvider>
  );
};

export default Layout;
