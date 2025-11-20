import { StyleSheet } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import Lobby from './Lobby';
import { useEffect, useState } from 'react';
import ActiveChat from './ActiveChat';
import { RTCPeerConnection } from 'react-native-webrtc';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    (async () => {
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const peerConnection = new RTCPeerConnection(configuration) as any;
      const iceCandidates: any[] = [];
      const waitForIce = new Promise<void>((resolve) => {
        peerConnection.onicecandidate = (event: any) => {
          if (event.candidate) {
            iceCandidates.push(event.candidate);
          } else {
            resolve();
          }
        };
      });
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      await waitForIce;
      const finalOffer = { ...peerConnection.localDescription };
      finalOffer.sdp += "\n" + iceCandidates.map((c) => `a=${c.candidate}`).join("\n");
      console.log("Final offer with all ICE candidates:", finalOffer);
    })();
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider>
        <Button mode='contained' onPressIn={() => setIsChatting(true)} onPressOut={() => setIsChatting(false)}>chatting</Button>
        {isChatting ? <ActiveChat /> : <Lobby />}
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({

});