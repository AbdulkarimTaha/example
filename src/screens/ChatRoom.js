import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import {TBChat} from 'react-native-altibbi';
import {PERMISSIONS, request} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';


//
// <TBChat
//   ref={refChat}
//   onConnected={userId => {
//     console.log('RRRRRRRRRRRRRR onConnected');
//   }}
//   onDisconnected={userId => {
//     console.log('RRRRRRRRRRRRRR onDisconnected');
//   }}
//   onUserLeft={(channel, user) => {
//     console.log('RRRRRRRRRRRRRR onUserLeft');
//   }}
//   onTypingStatusUpdated={channel => {
//     console.log('RRRRRRRRRRRRRR onTypingStatusUpdated');
//   }}
//   onMessageReceived={(channel, message) => {
//     const newMessage = {
//       createdAt: message.createdAt,
//       message: message.message,
//       messageId: message.messageId,
//       sender: message.sender.userId,
//     };
//     setMessage(newMessage);
//   }}
// />
const ChatRoom = props => {
  const refChat = useRef(null);
  const data = props?.route?.params?.event;
  const firstTime = useRef(true);
  const [list, setList] = useState([]);
  const [message, setMessage] = useState();
  const [input, setInput] = useState('');

  useEffect(() => {
    refChat.current.init(data.app_id, 'CHA_HAN_1');
    async function fetchData() {
      await refChat.current.connect(data.chat_user_id, data.chat_user_token);
    }
    fetchData().then(() => {
      loadAllMessage().then();
    });
  }, []);
  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
    } else {
      if (message) {
        const newArray = [...list];
        newArray.push(message);
        setList([...newArray]);
      }
    }
  }, [message]);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      console.log('RRRRRRRRR response', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log('RRRRRRRRR image uri', imageUri);
      }
    });
  };
  const uploadUsingGallery = async () => {
    let permission = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : parseFloat(Platform.Version + '') > 32
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );

    console.log('RRRRRRRRR here1 ');
    if (
      permission == 'granted' ||
      permission == 'limited' ||
      ['undetermined', 'authorized'].includes(permission)
    ) {
      openImagePicker();
    }
    return null;
  };
  const loadAllMessage = async () => {
    const allMessages = await refChat?.current?.loadAllMessage(
      `channel_${data.group_id}`,
    );
    const array = allMessages.map(oldMessage => {
      return {
        createdAt: oldMessage.createdAt,
        message: oldMessage.message,
        messageId: oldMessage.messageId,
        sender: oldMessage.sender.userId,
      };
    });
    const messageList = list.map(item => item.messageId);
    const newArray = array.filter(
      item => !messageList.includes(item.messageId),
    );
    setList([...list, ...newArray]);
  };
  const renderMessage = ({item}) => (
    <View
      style={
        item.sender === data.chat_user_id
          ? styles.userMessage
          : styles.otherMessage
      }>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );
  const disconnect = () => {
    refChat?.current?.disconnect();
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={list}
          keyExtractor={(item, index) => `${item.messageId}_${index}`}
          renderItem={renderMessage}
        />
      </View>
      <View style={{flexDirection: 'row', width: '100%', padding: 10}}>
        <Button title={'image'} onPress={() => uploadUsingGallery()} />

        <TextInput
          style={styles.input}
          onChangeText={txt => setInput(txt)}
          value={input}
          placeholder="type"
        />
        <Button
          title={'send'}
          onPress={async () => {
            const i = refChat?.current?.sendMessage({
              message: input,
            });
            i.onSucceeded(message1 => {
              console.log('onSucceeded');
              const newMessage = {
                createdAt: message1.createdAt,
                message: message1.message,
                messageId: message1.messageId,
                sender: message1.sender.userId,
              };
              setMessage(newMessage);
            });
            i.onFailed(err => {
              console.log('onFailed', err);
            });
            i.onPending(message2 => {
              console.log('onPending');
            });
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // to show the latest messages at the bottom
    padding: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#10e1d0', // blue color for user messages
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#a1a1a1', // light gray color for other messages
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  messageText: {
    color: '#fff', // text color for user messages
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
    borderWidth: 1,
  },
});

export default ChatRoom;
