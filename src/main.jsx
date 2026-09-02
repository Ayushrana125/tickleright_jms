import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@xyflow/react/dist/style.css";
import "./styles.css";
import App from "./App.jsx";
import { DataProvider } from "./store/DataContext.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "Arial, sans-serif", color: "#30313d" }}>
          <h1>Tickle Right JMS could not start</h1>
          <p>{this.state.error.message}</p>
          <button onClick={() => { localStorage.removeItem("tickle-right-jms-data-v1"); location.reload(); }}>
            Reset local demo data
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <App />
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
