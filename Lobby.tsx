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
    const connectionStatus = useWebSocket('ws://localhost:8181')

    return (
        <PaperProvider>
            <View style={styles.layout}>
                <Chip style={styles.chip}>
                    {ConnectionStatuses[connectionStatus ?? ConnectionStatuses.Disconnected]}
                </Chip>
                <Card>
                    <Card.Title title="Offers" />
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Name</DataTable.Title>
                                <DataTable.Title>Price</DataTable.Title>
                                <DataTable.Title numeric>Quantity</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                                <DataTable.Cell>Item 1</DataTable.Cell>
                                <DataTable.Cell>$10</DataTable.Cell>
                                <DataTable.Cell numeric>5</DataTable.Cell>
                            </DataTable.Row>
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