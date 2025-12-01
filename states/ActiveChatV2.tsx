import { View, Text } from "react-native";
import { PaperProvider, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function ActiveChatV2(props: { webRTCRef: React.RefObject<RTCPeerConnection | null>, dataChannelRef: React.RefObject<RTCDataChannel | null> }) {
    const chatHistory = useSelector((state: any) => state.chatHistory.messages);
    const [inputText, setInputText] = useState('');
    const dispatch = useDispatch();
    return (
        <PaperProvider>
            <View>
                {chatHistory.map((msg: any, index: number) => (
                    <View key={index}>
                        <Text>{msg.text}</Text>
                    </View>
                ))}
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    right={
                        <TextInput.Icon
                            icon="send"
                            onPress={() => {
                                console.log("Send button pressed");
                                console.log("DataChannel exists:", !!props.dataChannelRef.current);
                                console.log("DataChannel readyState:", props.dataChannelRef.current?.readyState);

                                if (props.dataChannelRef.current?.readyState === 'open') {
                                    console.log("Sending message:", inputText);
                                    props.dataChannelRef.current.send(inputText);
                                    dispatch({ type: 'chatHistory/addMessage', payload: { text: inputText, sender: 'user', timestamp: new Date() } });
                                } else {
                                    console.log("DataChannel not open!");
                                }

                                setInputText('');
                            }}
                        />
                    }
                />
            </View>
        </PaperProvider>
    );
}