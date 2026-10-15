import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </StrictMode>,
)

