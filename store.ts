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

type ChatMessage = {
    // Define the shape of your chat message here, for example:
    text: string;
    sender: string;
    timestamp: number;
};

const chatHistory = createSlice ({
    name: "chatHistory",
    initialState: {
        messages: [] as ChatMessage[]
    },
    reducers: {
        addMessage(state, action: { payload: ChatMessage }) {
            state.messages.push(action.payload);
        }
    }
})

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


export const selectSocketId = (state: {self: {socketGuid: string}}) => state.self.socketGuid;
export const selectConnectionStatus = (state: {signalServer: {connectionStatus: number}}) => state.signalServer.connectionStatus;

export const signalServerActions = signalServer.actions;
export const selfActions = self.actions;
export const chatHistoryActions = chatHistory.actions;

export const store = configureStore({
    reducer: {
        signalServer: signalServer.reducer,
        self: self.reducer,
        chatHistory: chatHistory.reducer
    }
});