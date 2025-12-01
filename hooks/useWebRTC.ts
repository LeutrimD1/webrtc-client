// useWebRTC.ts
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selfActions, signalServerActions } from '../store';
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
export default function useWebRTC(platform: string, webSocketRef: React.RefObject<WebSocket | null>) {
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected'); // Disconnected
  const webRTCRef = useRef<RTCPeerConnection | null>(null);
  useEffect(() => {
    (async () => {
      const connection = new RTCPeerConnection(configuration);
      webRTCRef.current = connection;
      connection.onconnectionstatechange = () => {
        setConnectionStatus(connection.connectionState);
      }
      connection.createDataChannel('chat');
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      await new Promise<void>(resolve => {
        if (connection.iceGatheringState === "complete") resolve();
        connection.addEventListener("icegatheringstatechange", () => {
          if (connection.iceGatheringState === "complete") resolve();
        });
      });

      //console.log(connection.localDescription!.sdp);
      await new Promise<void>(async (resolve) => {
        while (true) {
          if (webSocketRef.current?.send) {
            webSocketRef.current.send(JSON.stringify({
              type: "offer",
              offer: connection.localDescription!.sdp
            }));
            resolve();
            break;
          } else {
            console.log("waiting for websocket...");
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      });
    })();
    return () => {
    };
  }, []);
  return { connectionStatus , webRTCRef };
}