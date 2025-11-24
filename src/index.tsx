import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './Redux/store.ts'
import { BrowserRouter } from 'react-router-dom'
// import { StrictMode } from 'react'

createRoot(document.getElementById('root')!).render(
  //  <StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  // </StrictMode>
)
