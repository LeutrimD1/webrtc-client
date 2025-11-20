import { StyleSheet, View } from 'react-native';
import { Chip, PaperProvider, Card, DataTable, Button } from 'react-native-paper';
import { useWebSocket } from './hooks/useWebSocket';

enum ConnectionStatuses {
    Connecting = 0,
    Connected = 1,
    Disconnecting = 2,
    Disconnected = 3
}

export default function Lobby() {
    const { connectionStatus, socketDataBuffer } = useWebSocket('ws://localhost:8181')

    return (
        <PaperProvider>
            <View style={styles.layout}>
                <Button mode='contained' onPress={() => console.log("press")}>Create offer</Button>
                <Chip style={styles.chip}>
                    {ConnectionStatuses[connectionStatus ?? ConnectionStatuses.Disconnected]}
                </Chip>
                <Card>
                    <Card.Title title={`Users (${socketDataBuffer.sockets.length} connected)`} />
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Socket Guid</DataTable.Title>
                                <DataTable.Title>Offer</DataTable.Title>
                                <DataTable.Title> </DataTable.Title>
                            </DataTable.Header>
                            {socketDataBuffer.sockets.map((socket) => (
                                <DataTable.Row key={socket.socketGuid}>
                                    <DataTable.Cell>{socket.socketGuid}</DataTable.Cell>
                                    <DataTable.Cell>{socket.offer}</DataTable.Cell>
                                    <DataTable.Cell><Button mode='contained'>Send answer</Button></DataTable.Cell>
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