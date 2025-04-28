import { createSlice } from "@reduxjs/toolkit";

const suggestedUserSlice = createSlice({
    name : "suggestedUser",
    initialState : {
        suggestedUser : [],
    },
    reducers : {
        setSuggestedUser :(state,action) => {
            state.suggestedUser = action.payload;
        }
    }
});

export const {setSuggestedUser} = suggestedUserSlice.actions;

export default suggestedUserSlice.reducer;