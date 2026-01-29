import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ExperimentTable from './Adaptation/Visualizer/ExperimentTable';
import { StyledEngineProvider } from '@mui/material/styles';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <StyledEngineProvider injectFirst>
    <ExperimentTable/>
    </StyledEngineProvider>
  </React.StrictMode>
);

reportWebVitals();
