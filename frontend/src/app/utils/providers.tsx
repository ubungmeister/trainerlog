import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        closeOnClick={true}
        autoClose={3000}
        closeButton={false}
        draggable={true}
        theme="colored"
      />
    </QueryClientProvider>
  );
}
