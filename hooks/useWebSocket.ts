import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url: string, onMessage?: (event: MessageEvent) => void) {
    const [connectionStatus, selectConnectionStatus] = useState<number>(3); // Disconnected
    const socketRef = useRef<WebSocket | null>(null);
    
    useEffect(() => {

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            selectConnectionStatus(socket.readyState);
        };

        socket.onclose = () => {
            selectConnectionStatus(socket.readyState);
        };

        socket.onmessage = (event: MessageEvent) => {
            if (onMessage) {
                onMessage(event);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    return { connectionStatus, socketRef };
}