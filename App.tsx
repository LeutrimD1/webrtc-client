import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { PaperProvider, TextInput, IconButton, Card, Text } from 'react-native-paper';
import { useState } from 'react';

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'other';
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How are you?', timestamp: new Date(), sender: 'other' },
    { id: '2', text: 'I\'m doing great, thanks!', timestamp: new Date(), sender: 'user' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date(),
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
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
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
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