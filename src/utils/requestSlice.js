import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: [],  // Initialize as empty array instead of null
    reducers: {
        addRequest: (state, action) => {
            return Array.isArray(action.payload) ? action.payload : []; // Ensure we always return an array
        },
        removeRequest: (state, action) => {
            return state.filter(req => req._id !== action.payload) ;
        }
    },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;