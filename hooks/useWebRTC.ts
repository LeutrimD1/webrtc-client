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
  //const socketGuid = useSelector((state: { self: { socketGuid: string } }) => state.self.socketGuid);

  let handleAnswer = async (message: any) => { console.log("test 1"); };

  let handleOffer = async (message: any) => { console.log("test 2"); };

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

      handleOffer = async (message: any) => {
        console.log("Handling incoming offer...");
        const remoteDesc = new RTCSessionDescription(message.offer);
        await webRTCRef.current!.setRemoteDescription(remoteDesc);
      }

      handleAnswer = async (message: any) => {
        console.log("Handling incoming answer...");
        const remoteDesc = new RTCSessionDescription(message.answer);
        await webRTCRef.current!.setRemoteDescription(remoteDesc);
      }

      // This is for the OFFERING peer - create datachannel before making offer
      // const dataChannel = connection.createDataChannel('chat');
      // dataChannelRef.current = dataChannel;
      // console.log("Creating a datachannel (offering peer)...");

      // // Set up handlers for the offering peer's datachannel
      // dataChannel.onopen = () => {
      //   console.log("Data channel opened (offering peer)");
      // };

      // dataChannel.onclose = () => {
      //   console.log("Data channel closed (offering peer)");
      // };

      // dataChannel.onerror = (error) => {
      //   console.error("Data channel error (offering peer):", error);
      // };

      // dataChannel.onmessage = (event) => {
      //   console.log("Received message via data channel (offering peer):", event.data);
      //   dispatch({ type: 'chatHistory/addMessage', payload: { text: event.data, sender: 'other', timestamp: new Date() } });
      // };

      // const offer = await connection.createOffer();
      // await connection.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      // await new Promise<void>(resolve => {
      //   if (connection.iceGatheringState === "complete") {
      //     resolve();
      //   } else {
      //     connection.addEventListener("icegatheringstatechange", () => {
      //       if (connection.iceGatheringState === "complete") {
      //         resolve();
      //       }
      //     });
      //   }
      // });

      // Wait for WebSocket to be ready and send offer
      // await new Promise<void>(async (resolve) => {
      //   const checkInterval = setInterval(() => {
      //     if (webSocketRef.current?.readyState === 1) {
      //       webSocketRef.current.send(JSON.stringify({
      //         type: "offer",
      //         offer: connection.localDescription!.sdp
      //       }));
      //       console.log("Offer sent via WebSocket");
      //       clearInterval(checkInterval);
      //       resolve();
      //     }
      //   }, 100);
      // });
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