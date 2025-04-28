import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import {Provider} from 'react-redux'
import store from './Components/redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

let persistor = persistStore(store);
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
   
    </Provider>
   
  </React.StrictMode>,
)
