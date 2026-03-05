import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { WarehouseProvider } from './context/WarehouseContext.jsx';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <WarehouseProvider>
       <App />
      </WarehouseProvider>
    </BrowserRouter>

)