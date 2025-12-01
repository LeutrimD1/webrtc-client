import { StyleSheet, View } from 'react-native';
import { Chip, PaperProvider, Card, DataTable, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RefObject } from 'react';

export default function Lobby(props: { webRTCRef: RefObject<RTCPeerConnection | null>, socketRef: RefObject<WebSocket | null> }) {
    const serverState = useSelector((state: { signalServer: { sockets: any[] } }) => state.signalServer);
    const socketId = useSelector((state: { self: { socketGuid: string } }) => state.self.socketGuid);
    return (
        <PaperProvider>
            <View style={styles.layout}>
                <Button mode='contained' onPress={() => console.log("press")}>Create offer</Button>
                <Chip style={styles.chip}>
                    {"test"}
                </Chip>
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
                                    <DataTable.Cell>{socket.offer}</DataTable.Cell>
                                    <DataTable.Cell><Button mode='contained' onPress={() => {
                                        props.webRTCRef.current?.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: socket.offer })).then(async () => {
                                            const answer = await props.webRTCRef.current!.createAnswer();
                                            await props.webRTCRef.current!.setLocalDescription(answer);
                                            props.socketRef.current?.send(JSON.stringify({
                                                type: "answer",
                                                answer: answer.sdp,
                                                targetSocketGuid: socket.socketGuid 
                                            }));
                                        });
                                    }}>Send answer</Button></DataTable.Cell>
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