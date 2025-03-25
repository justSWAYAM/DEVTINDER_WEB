import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action) => action.payload,
        removeOneConnection: (state, action) => 
            state ? state.filter(conn => conn._id !== action.payload) : [],
        addOneConnection: (state, action) => {
            if (!state) return [action.payload];
            // Check if connection already exists
            const exists = state.some(conn => conn._id === action.payload._id);
            if (!exists) {
                return [...state, action.payload];
            }
            return state;
        }
    },
});

export const { addConnections, removeOneConnection, addOneConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;