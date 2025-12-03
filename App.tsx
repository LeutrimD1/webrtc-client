import { StyleSheet, Platform, View, Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Lobby from './states/Lobby';
import useWebSocket from './hooks/useWebSocket';
import useWebRTC from './hooks/useWebRTC';
import ActiveChat from './states/ActiveChat';
import { useDispatch } from 'react-redux';
import ActiveChatV2 from './states/ActiveChatV2';

export default function App() {
  const dispatch = useDispatch();
  const onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "id":
        dispatch({ type: 'self/setSocketGuid', payload: data.value });
        break;
      case "state":
        dispatch({ type: 'signalServer/updateServerState', payload: { sockets: data.sockets } });
        break;
      case "answer":
        if (webRTCRef.current) {
          handleAnswer(data);
        }
        break;
      case "offer":
        if (webRTCRef.current) {
          handleOffer(data);
        }
        break;
      default:
        console.warn("Unknown message received via WebSocket:", data);
        break;
    }
  }
  const { connectionStatus: webSocketConnectionStatus, socketRef } = useWebSocket("ws://localhost:8181", onMessage);
  const { connectionStatus: webRTCConnectionStatus, webRTCRef, dataChannelRef, handleAnswer, handleOffer } = useWebRTC(Platform.OS, socketRef);
  // When Lobby or ActiveChat unmounts, its data gets reset.
  return (
    <PaperProvider>
      {webRTCConnectionStatus !== "connected" ?
        (webSocketConnectionStatus === 1 ? 
          <Lobby webRTCRef={webRTCRef} dataChannelRef={dataChannelRef} socketRef={socketRef} /> : 
            <View><Text>Connecting...</Text></View>) : 
              <ActiveChat webRTCRef={webRTCRef} dataChannelRef={dataChannelRef} />}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

});