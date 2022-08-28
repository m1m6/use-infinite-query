import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from "react-query";
import App from "./App";
import CreateUser from './CreateUser';
import './index.css'
import reactQueryClient from "./queryClient";

const rootElement = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

rootElement.render(
  <QueryClientProvider client={reactQueryClient}>
    <CreateUser />
    <App />
  </QueryClientProvider>
);