import { useEffect, useState, useRef } from "react";

export function useWebSocket(url: string) {
    const webSocketRef = useRef<WebSocket | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<number | null>(webSocketRef.current?.readyState! ?? 3);
    const clearTimers = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
    useEffect(() => {
        const setSocketCallbacks = (webSocket: WebSocket) => {
            webSocket.onopen = () => {
                setConnectionStatus(webSocket.readyState);
            }
            webSocket.onclose = () => {
                setConnectionStatus(webSocket.readyState);
                clearTimers()
            }
            webSocket.onerror = (e) => {
                clearTimers()
                alert("Could not connect to signaling server.")
                console.log("Socket error: " + JSON.stringify(e));
            }
            webSocket.onmessage = (e) => {
                console.log("On message was triggered..." + e.data)
                const message = JSON.parse(e.data);
                if (message.type === "pong") {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                }
            }
        }
        const webSocket = new WebSocket(url);
        webSocketRef.current = webSocket;
        setSocketCallbacks(webSocket);
        intervalRef.current = setInterval(() => {
            webSocket.send(JSON.stringify({ type: "ping" }));
            timeoutRef.current = setTimeout(() => {
                console.log("No PONG, closing Connection...");
                webSocket.close();
                setConnectionStatus(webSocketRef.current?.readyState! ? webSocketRef.current.readyState : 3);
                clearInterval(intervalRef.current!);
            }, 3000);
        }, 6000);

        return clearTimers
    }, []);

    return connectionStatus;
}