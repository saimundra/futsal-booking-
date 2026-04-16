import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "./components/animations/Toast";

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;
