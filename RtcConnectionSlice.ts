import { createSlice } from "@reduxjs/toolkit";

export const RtcConnectionSlice = createSlice({
    name: 'RtcConnectionSlice',
    initialState: {
        RTCPeerConnection: null
    },
    reducers: {

    }
});

export default RtcConnectionSlice.reducer;