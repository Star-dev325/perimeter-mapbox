import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import AppContextProvider from './context/AppContext';

function App() {
  return (
    <AppContextProvider>
      <MapComponent/>
    </AppContextProvider>
  );
}

export default App;
