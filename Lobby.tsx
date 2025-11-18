import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, PaperProvider, Card, DataTable } from 'react-native-paper';


export default function Lobby() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8080');
        
    }, []);
    return (
        <PaperProvider>
            <View style={styles.layout}>
                <Chip style={styles.chip}>
                    {isConnected ? 'Connected' : 'Connecting...'}
                </Chip>
                <Card>
                    <Card.Title title="Offers"/>
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