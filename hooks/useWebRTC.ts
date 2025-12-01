// useWebRTC.ts
import { useEffect, useRef, useState } from "react";

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export default function useWebRTC(platform: string, webSocketRef: React.RefObject<WebSocket | null>) {
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const webRTCRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    (async () => {
      const connection = new RTCPeerConnection(configuration);
      webRTCRef.current = connection;

      connection.onconnectionstatechange = () => {
        setConnectionStatus(connection.connectionState);
      };

      // Handle incoming data channel
      connection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onmessage = (e) => {
          console.log("Received message:", e.data);
          // Dispatch to Redux or handle message
        };
      };

      connection.createDataChannel('chat');
      
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await new Promise<void>(resolve => {
        if (connection.iceGatheringState === "complete") resolve();
        connection.addEventListener("icegatheringstatechange", () => {
          if (connection.iceGatheringState === "complete") resolve();
        });
      });

      // Wait for WebSocket to be ready and send offer
      await new Promise<void>(async (resolve) => {
        while (true) {
          if (webSocketRef.current?.readyState === 1) {
            webSocketRef.current.send(JSON.stringify({
              type: "offer",
              offer: connection.localDescription!.sdp
            }));
            resolve();
            break;
          } else {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      });
    })();

    return () => {
      if (webRTCRef.current) {
        webRTCRef.current.close();
      }
    };
  }, []);

  return { connectionStatus, webRTCRef };
}