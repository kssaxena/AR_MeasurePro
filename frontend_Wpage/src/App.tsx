import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { FetchData } from "./services/FetchFromAPI";
import { addUser, clearUser } from "./Utils/Slice/UserInfoSlice";
const queryClient = new QueryClient();

const App = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const dispatch = useDispatch();
  useEffect(() => {
    // Check if RefreshToken exists in localStorage
    const RefreshToken = localStorage.getItem("RefreshToken");
    if (!RefreshToken) return; // If no RefreshToken, don't proceed further

    async function reLogin() {
      try {
        const user = await FetchData("users/refresh-tokens", "post", {
          RefreshToken,
        });

        // Clear localStorage and set new tokens
        localStorage.clear(); // will clear all the data from localStorage
        localStorage.setItem("AccessToken", user.data.data.tokens.AccessToken);
        localStorage.setItem(
          "RefreshToken",
          user.data.data.tokens.RefreshToken
        );

        // Storing data inside redux store
        dispatch(clearUser());
        dispatch(addUser(user.data.data.user));
        return user;
      } catch (error) {
        console.log(error);
      }
    }

    reLogin();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
