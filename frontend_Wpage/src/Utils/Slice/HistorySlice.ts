import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchData } from "@/services/FetchFromAPI";

export const fetchCart = createAsyncThunk(
  "CartList/fetchCart",
  async (user) => {
    try {
      const response = await FetchData(`users/${user}/cart-products`, "get"); // Replace with your API URL
      console.log(response);
      return response.data.data; // Assuming the API returns a list of cart items
    } catch (err) {
      console.error(err);
      return [];
    }
  }
);
