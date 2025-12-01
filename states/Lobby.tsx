import { StyleSheet, View } from 'react-native';
import { Chip, PaperProvider, Card, DataTable, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RefObject } from 'react';

export default function Lobby(props: { webRTCRef: RefObject<RTCPeerConnection | null>, socketRef: RefObject<WebSocket | null> }) {
    const serverState = useSelector((state: { signalServer: { sockets: any[] } }) => state.signalServer);
    const socketId = useSelector((state: { self: { socketGuid: string } }) => state.self.socketGuid);
    
    const handleCreateOffer = async (targetSocketGuid: string) => {
        if (!props.webRTCRef.current) {
            console.error("WebRTC connection not initialized");
            return;
        }

        try {
            // Create data channel for offering peer
            const dataChannel = props.webRTCRef.current.createDataChannel('chat');
            dataChannel.onopen = () => {
                console.log("Data channel opened (offering peer)");
            };
            dataChannel.onclose = () => {
                console.log("Data channel closed");
            };
            dataChannel.onerror = (error) => {
                console.error("Data channel error:", error);
            };
            
            // Create and send offer
            const offer = await props.webRTCRef.current.createOffer();
            await props.webRTCRef.current.setLocalDescription(offer);
            
            console.log("Sending offer to:", targetSocketGuid);
            props.socketRef.current?.send(JSON.stringify({
                type: "offer",
                offer: offer.sdp,
                targetSocketGuid: targetSocketGuid
            }));
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    };

    const handleAnswerOffer = async (socket: any) => {
        if (!props.webRTCRef.current) {
            console.error("WebRTC connection not initialized");
            return;
        }

        try {
            console.log("Setting remote description with offer from:", socket.socketGuid);
            await props.webRTCRef.current.setRemoteDescription(
                new RTCSessionDescription({ type: "offer", sdp: socket.offer })
            );
            
            const answer = await props.webRTCRef.current.createAnswer();
            await props.webRTCRef.current.setLocalDescription(answer);
            
            console.log("Sending answer to:", socket.socketGuid);
            props.socketRef.current?.send(JSON.stringify({
                type: "answer",
                answer: answer.sdp,
                targetSocketGuid: socket.socketGuid 
            }));
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    };

    return (
        <PaperProvider>
            <View style={styles.layout}>
                <Card>
                    <Card.Title title={`Users (${serverState.sockets.length} connected)`} />
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Socket Guid</DataTable.Title>
                                <DataTable.Title>Offer</DataTable.Title>
                                <DataTable.Title> </DataTable.Title>
                            </DataTable.Header>
                            {serverState.sockets.map((socket: any) => (
                                socket.socketGuid !== socketId &&
                                <DataTable.Row key={socket.socketGuid}>
                                    <DataTable.Cell>{socket.socketGuid}</DataTable.Cell>
                                    <DataTable.Cell>{socket.offer ? "Yes" : "No"}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {socket.offer ? (
                                            <Button mode='contained' onPress={() => handleAnswerOffer(socket)}>
                                                Answer
                                            </Button>
                                        ) : (
                                            <Button mode='contained' onPress={() => handleCreateOffer(socket.socketGuid)}>
                                                Create Offer
                                            </Button>
                                        )}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )) ?? null}
                        </DataTable>
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    layout: {
        display: 'flex'
    },
    chip: {
        alignSelf: 'center'
    }
});