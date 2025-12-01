import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { PaperProvider, TextInput, Card, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'other';
};

export default function ActiveChat(props: { webRTCRef: React.RefObject<RTCPeerConnection | null>, dataChannelRef: React.RefObject<RTCDataChannel | null> }) {
  const dispatch = useDispatch();
  const chatHistory = useSelector((state: any) => state.chatHistory.messages);
  const [inputText, setInputText] = useState('');

  // Set up message handler when datachannel is available
  useEffect(() => {
    if (props.dataChannelRef.current) {
      console.log("Setting up message handler");
      props.dataChannelRef.current.onmessage = (event) => {
        console.log("Received message via data channel:", event.data);
        dispatch({ 
          type: 'chatHistory/addMessage', 
          payload: { 
            text: event.data, 
            sender: 'other', 
            timestamp: new Date() 
          } 
        });
      };
    }
  }, [props.dataChannelRef.current, dispatch]);

  const handleSend = () => {
    if (inputText.trim()) {
      console.log("Send button pressed");
      console.log("DataChannel exists:", !!props.dataChannelRef.current);
      console.log("DataChannel readyState:", props.dataChannelRef.current?.readyState);

      if (props.dataChannelRef.current?.readyState === 'open') {
        console.log("Sending message:", inputText);
        props.dataChannelRef.current.send(inputText.trim());
        dispatch({ 
          type: 'chatHistory/addMessage', 
          payload: { 
            text: inputText.trim(), 
            sender: 'user', 
            timestamp: new Date() 
          } 
        });
        setInputText('');
      } else {
        console.log("DataChannel not open!");
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.otherMessage,
      ]}
    >
      <Card style={[
        styles.messageCard,
        item.sender === 'user' ? styles.userCard : styles.otherCard,
      ]}>
        <Card.Content>
          <Text style={item.sender === 'user' ? styles.userText : styles.otherText}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar style="auto" />

        {/* Chat Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerText}>Chat</Text>
        </View>

        {/* Messages List */}
        <FlatList
          data={chatHistory}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || index.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSend}
                disabled={!inputText.trim()}
              />
            }
            onSubmitEditing={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    elevation: 2,
  },
  userCard: {
    backgroundColor: '#6200ee',
  },
  otherCard: {
    backgroundColor: '#fff',
  },
  userText: {
    color: '#fff',
  },
  otherText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
  },
});