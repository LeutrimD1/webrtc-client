import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WebRTCState {
    connectionRef: RTCPeerConnection | null;
    offer: RTCSessionDescriptionInit | null;
};

const initialState: WebRTCState = {
    connectionRef: null,
    offer: null
}

const rtcConnectionSlice = createSlice({
    name: "rtcConnection",
    initialState,
    reducers: {
        setOffer(state, action: PayloadAction<RTCSessionDescriptionInit | null>) {
            state.offer = action.payload;
        },
    }
});

export const { setOffer } = rtcConnectionSlice.actions;

export const store = configureStore({
    reducer: {
        rtcConnection: rtcConnectionSlice.reducer
    }
});