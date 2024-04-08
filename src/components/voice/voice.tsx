import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Voice from 'react-native-voice';

const VoiceNote = () => {
  const [messages, setMessages]: any = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const sendMessage = () => {
    if (recognizedText) {
      setMessages([...messages, {text: recognizedText, sender: 'user'}]);
      setRecognizedText('');
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = stopListening;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (error: any) => console.log('onSpeechError: ', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (event: any) => {
    console.log('Recording started ... ', event);
  };

  const onSpeechResults = (event: any) => {
    console.log('onSpeechResults error - ', event);
    const text = event.value[0];
    setRecognizedText(text);
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start('en-GB');
    } catch (error) {
      console.log('start listening error - ', error);
    }
  };

  const stopListening = async () => {
    try {
      Voice.removeAllListeners();
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.log('stop listening error - ', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.map((message: any, index: any) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              {
                alignSelf:
                  message.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor:
                  message.sender === 'user' ? '#BB2525' : '#141E46',
              },
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder='Type your message...'
          value={recognizedText}
          onChangeText={(text) => setRecognizedText(text)}
        /> */}
        <TouchableOpacity
          onPress={() => (isListening ? stopListening() : startListening())}
          style={styles.voiceButton}
        >
          {isListening ? (
            <Text style={styles.voiceButtonText}>•••</Text>
          ) : (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/4980/4980251.png',
              }}
              style={{width: 45, height: 45}}
            />
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#000000',
    position: 'absolute',
    bottom: 0,
    right: 50,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#000000',
    //marginLeft: 'auto',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
  },
  voiceButton: {
    fontSize: 24,
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    marginLeft: 'auto',
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6969',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VoiceNote;
