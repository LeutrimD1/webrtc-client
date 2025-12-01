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
    //console.log("Message received:", data);
    switch (data.type) {
      case "id":
        dispatch({ type: 'self/setSocketGuid', payload: data.value });
        break;
      case "state":
        dispatch({ type: 'signalServer/updateServerState', payload: { sockets: data.sockets } });
        break;
      case "answer":
        // Handle incoming answer
        if (webRTCRef.current && data.answer) {
          webRTCRef.current.setRemoteDescription(
            new RTCSessionDescription({ type: "answer", sdp: data.answer })
          ).catch(err => console.error("Error setting remote description:", err));
        }
        break;
      default:
        break;
    }
  }
  const { connectionStatus: webSocketConnectionStatus, socketRef } = useWebSocket("ws://localhost:8181", onMessage);
  const { connectionStatus: webRTCConnectionStatus, webRTCRef, dataChannelRef } = useWebRTC(Platform.OS, socketRef);
  // When Lobby or ActiveChat unmounts, its data gets reset.
  return (
    <PaperProvider>
      {webRTCConnectionStatus !== "connected" ?
        (webSocketConnectionStatus === 1 ? 
          <Lobby webRTCRef={webRTCRef} socketRef={socketRef} /> : 
            <View><Text>Connecting...</Text></View>) : 
              <ActiveChat webRTCRef={webRTCRef} dataChannelRef={dataChannelRef} />}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

});