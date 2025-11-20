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
                <Chip style={styles.chip}>
                    {ConnectionStatuses[connectionStatus ?? ConnectionStatuses.Disconnected]}
                </Chip>
                <Card>
                    <Card.Title title={`Offers (${socketDataBuffer?.count ?? 0} connected)`} />
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Socket Guid</DataTable.Title>
                            </DataTable.Header>
                            {socketDataBuffer?.connectedIds?.map((socketId) => (
                                <DataTable.Row key={socketId}>
                                    <DataTable.Cell>{socketId}</DataTable.Cell>
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