import { StyleSheet } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import Lobby from './Lobby';
import { useEffect, useState, useRef } from 'react';
import ActiveChat from './ActiveChat';
import { RTCPeerConnection } from './WebRTCAdapter'
import { useDispatch } from 'react-redux';
import { setOffer } from './store';

export default function App() {
  const [isChatting, setIsChatting] = useState(false);
  const connectionRef = useRef<RTCPeerConnection | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const connection = new RTCPeerConnection(configuration);
        connectionRef.current = connection;
        const candidates: any[] = [];

        connection.onicecandidate = (event: any) => {
          if (event?.candidate) {
            candidates.push(event.candidate);
          }
        };

        connection.createDataChannel('chat');

        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);

        await new Promise<void>((resolve) => {
          if (connection.iceGatheringState === 'complete') {
            resolve();
          } else {
            const onGatheringComplete = () => {
              if (connection.iceGatheringState === 'complete') {
                connection.removeEventListener('icegatheringstatechange', onGatheringComplete);
                resolve();
              }
            };
            connection.addEventListener('icegatheringstatechange', onGatheringComplete);
            setTimeout(resolve, 5000);
          }
        });

        const finalOffer = {
          type: offer.type || 'offer',
          sdp: connection.localDescription?.sdp || offer.sdp || ''
        };

        dispatch(setOffer(finalOffer));
      } catch (error) {
        console.error('WebRTC error:', error);
      }
    })();
  }, []);
  return (
    <PaperProvider>
      <Button mode='contained' onPressIn={() => setIsChatting(true)} onPressOut={() => setIsChatting(false)}>chatting</Button>
      {isChatting ? <ActiveChat /> : <Lobby />}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

});