import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Lobby from './Lobby';
import { useState } from 'react';
import ActiveChat from './ActiveChat';

export default function App() {
  const [isChatting, setIsChatting] = useState(false)
  return (
    <PaperProvider>
      <button onMouseDown={() => setIsChatting(true)} onMouseUp={() => setIsChatting(false)}>chatting</button>
      {isChatting ? <ActiveChat /> : <Lobby />}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

});