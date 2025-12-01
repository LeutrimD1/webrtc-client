import { configureStore, createSlice } from "@reduxjs/toolkit";

const self = createSlice({
    name: "self",
    initialState: {
        socketGuid: ""
    },
    reducers: {
        setSocketGuid(state, action) {
            return ({
                ...state,
                socketGuid: action.payload
            })
        }
    }
});

const signalServer = createSlice({
    name: "signalServer",
    initialState: {
        sockets: []
    },
    reducers: {
        updateServerState(state, action) {
            return ({
                ...state,
                ...action.payload
            })
        }
    }
});


export const selectSocketId = (state: {localData: {socketConnectionGuid: string}}) => state.localData.socketConnectionGuid;
export const selectConnectionStatus = (state: {signalServer: {connectionStatus: number}}) => state.signalServer.connectionStatus;

export const signalServerActions = signalServer.actions;
export const selfActions = self.actions;

export const store = configureStore({
    reducer: {
        signalServer: signalServer.reducer,
        self: self.reducer
    }
});