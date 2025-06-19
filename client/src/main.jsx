import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    

<GoogleOAuthProvider clientId="211503719039-h37d04vddjr0h6q4dno1dvpvia4gdmp8.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>

    </BrowserRouter>
   
  </StrictMode>,
)
