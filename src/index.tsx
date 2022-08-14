import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from "react-query";
import App from "./App";
import './index.css'
import reactQueryClient from "./queryClient";

const rootElement = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

rootElement.render(
  <QueryClientProvider client={reactQueryClient}>
    <App />
  </QueryClientProvider>
);