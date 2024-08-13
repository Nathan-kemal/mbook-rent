"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import PageWriapper from "./components/PageWrapper";
import NavSidebar from "./components/sidebar/side-navbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname.includes("sign-in") || pathname.includes("sign-up")) {
    return <div>{children}</div>;
  }
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <NavSidebar />
          <PageWriapper>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </PageWriapper>
        </LocalizationProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Wrapper;
