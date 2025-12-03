import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export default function useWebRTC(platform: string, webSocketRef: React.RefObject<WebSocket | null>) {
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const webRTCRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const dispatch = useDispatch();

  const handleOffer = async (message: any) => {
    console.log("Handling incoming offer...", message);
    try {
      if (!webRTCRef.current) {
        console.error("WebRTC connection not initialized");
        return;
      }
      
      const remoteDesc = new RTCSessionDescription({ type: "offer", sdp: message.offer });
      await webRTCRef.current.setRemoteDescription(remoteDesc);

      // Create answer
      const answer = await webRTCRef.current.createAnswer();
      await webRTCRef.current.setLocalDescription(answer);

      // Wait for ICE gathering
      await new Promise<void>(resolve => {
        if (webRTCRef.current!.iceGatheringState === "complete") {
          resolve();
        } else {
          webRTCRef.current!.addEventListener("icegatheringstatechange", () => {
            if (webRTCRef.current!.iceGatheringState === "complete") {
              resolve();
            }
          });
        }
      });

      // Send answer back
      webSocketRef.current?.send(JSON.stringify({
        type: "answer",
        answer: webRTCRef.current.localDescription!.sdp,
        to: message.from,
        from: message.to
      }));
      console.log("Answer sent");
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async (message: any) => {
    console.log("Handling incoming answer...", message);
    try {
      if (!webRTCRef.current) {
        console.error("WebRTC connection not initialized");
        return;
      }
      
      const remoteDesc = new RTCSessionDescription({ type: "answer", sdp: message.answer });
      await webRTCRef.current.setRemoteDescription(remoteDesc);
      console.log("Remote description set from answer");
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const connection = new RTCPeerConnection(configuration);
      webRTCRef.current = connection;

      connection.onconnectionstatechange = () => {
        console.log("Connection state changed:", connection.connectionState);
        setConnectionStatus(connection.connectionState);
      };

      // This fires if this peer is the ANSWERING peer meaning the OFFER has been received
      connection.ondatachannel = (event) => {
        console.log("This peer received a datachannel event (answering peer)");
        dataChannelRef.current = event.channel;

        event.channel.onopen = () => {
          console.log("Data channel opened (answering peer)");
        };

        event.channel.onclose = () => {
          console.log("Data channel closed (answering peer)");
        };

        event.channel.onerror = (error) => {
          console.error("Data channel error (answering peer):", error);
        };

        event.channel.onmessage = (msgEvent) => {
          console.log("Received message via data channel (answering peer):", msgEvent.data);
          dispatch({ type: 'chatHistory/addMessage', payload: { text: msgEvent.data, sender: 'other', timestamp: new Date() } });
        };
      };
    })();

    return () => {
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
      }
      if (webRTCRef.current) {
        webRTCRef.current.close();
      }
    };
  }, []);

  return { connectionStatus, webRTCRef, dataChannelRef, handleAnswer, handleOffer };
}