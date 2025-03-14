import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action) => action.payload,
        removeConnections: (state, action) => null,
        removeOneConnection: (state, action) => 
            state.filter(conn => conn._id !== action.payload)
    },
});

export const { addConnections, removeConnections, removeOneConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;