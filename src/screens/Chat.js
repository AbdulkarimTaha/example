import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

//sendBird

import {PERMISSIONS, request} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  AltibbiChat,
  ConnectionHandler,
  GroupChannelHandler,
  GroupChannelModule,
} from 'react-native-altibbi';

//   onUserJoined,
//   onUserLeft,
//   onUserReceivedInvitation,
//   onUserDeclinedInvitation,
//   onChannelHidden,
//   onUnreadMemberStatusUpdated,
//   onUndeliveredMemberStatusUpdated,
//   onTypingStatusUpdated,
//   onPollUpdated,
//   onPollVoted,
//   onPollDeleted,
//   onPinnedMessageUpdated,
//   onUserMuted,
//   onUserUnmuted,
//   onUserBanned,
//   onUserUnbanned,
//   onChannelChanged,
//   onChannelDeleted,
//   onChannelFrozen,
//   onChannelUnfrozen,
//   onOperatorUpdated,
//   onChannelMemberCountChanged,
//   onMetaDataCreated,
//   onMetaDataUpdated,
//   onMetaDataDeleted,
//   onMetaCounterCreated,
//   onMetaCounterUpdated,
//   onMetaCounterDeleted,
//   onMessageReceived,
//   onMessageUpdated,
//   onMessageDeleted,
//   onMentionReceived,
//   onReactionUpdated,
//   onThreadInfoUpdated

const Chat = props => {
  const data = props?.route?.params?.event;

  const ref = useRef(null);
  const channelRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const init = () => {
    ref.current = AltibbiChat.init({
      appId: data.app_id,
      modules: [new GroupChannelModule()],
    });
  };

  const connect = async () => {
    await ref?.current?.connect(data.chat_user_id, data.chat_user_token);
  };
  const disconnect = () => {
    ref?.current?.disconnect().then(r => {
      console.log('RRRRRRR disconnect ', r);
    });
  };

  const reconnect = () => {
    ref?.current?.reconnect();
  };
  const getChannel = async channelURL => {
    const channel = await ref?.current?.groupChannel
      .getChannel(channelURL)
      .catch(e => {
        console.log('RRRRRRRRRR cccc', e);
        return e;
      });
    channelRef.current = channel;
    return channel;
  };
  const sendMessage = msg => {
    const send = channelRef.current.sendUserMessage(msg);
    send.onSucceeded(message1 => {
      console.log('onSucceeded');
      const newMessage = {
        createdAt: message1.createdAt,
        message: message1.message,
        messageId: message1.messageId,
        sender: {
          userId: message1.sender.userId,
        },
      };
      setMessage(newMessage);
    });
    send.onFailed(err => {
      console.log('onFailed', err);
    });
    send.onPending(message2 => {
      console.log('onPending');
    });
  };

  const loadAllMessage = async channelURL => {
    const channel = await getChannel(channelURL);
    const previousMessageList = await channel.createPreviousMessageListQuery();
    let allMessages = [];

    while (previousMessageList.hasNext) {
      let newMsgArr = await previousMessageList.load();
      allMessages = [...allMessages, ...newMsgArr];
    }
    return allMessages;
  };

  const renderMessage = ({item}) => (
    <View
      style={
        item.sender.userId == data.chat_user_id
          ? styles.userMessage
          : styles.otherMessage
      }>
      {item?.message?.includes('attachment') ? (
        <Image source={{uri: item.message}} style={{width: 150, height: 150}} />
      ) : (
        <Text style={styles.messageText}>{item.message}</Text>
      )}
    </View>
  );

  const onUserJoined = () => {};
  const onUserLeft = () => {};
  const onTypingStatusUpdated = () => {};
  const onMessageReceived = (channel, message) => {
    console.log('RRRRRRRr rec', message);
    const newMessage = {
      createdAt: message.createdAt,
      message: message.message,
      messageId: message.messageId,
      sender: message.sender.userId,
    };
    const newArray = [...messageList];
    newArray.push(newMessage);
    setMessageList(newArray);
  };

  const onConnected = userId => {
    console.log('RRRRR', userId);
  };
  const onReconnectStarted = () => {};
  const onReconnectSucceeded = () => {};
  const onReconnectFailed = () => {};
  const onDisconnected = () => {};

  const addHandler = () => {
    let groupChannelHandler = new GroupChannelHandler({
      onUserJoined,
      onUserLeft,
      onTypingStatusUpdated,
      onMessageReceived,
    });

    let connectionHandler = new ConnectionHandler({
      onConnected,
      onReconnectStarted,
      onReconnectSucceeded,
      onReconnectFailed,
      onDisconnected,
    });
    ref?.current?.groupChannel?.addGroupChannelHandler(
      'CHA_HAN_1',
      groupChannelHandler,
    );
    ref?.current?.addConnectionHandler('CHA_HAN_1', connectionHandler);
  };

  const removeConnectionHandler = appChannel => {
    ref.current.removeConnectionHandler(appChannel);
  };
  const removeGroupChannelHandler = appChannel => {
    ref.current.groupChannel.removeGroupChannelHandler(appChannel);
  };

  const setPushTriggerOption = pushTriggerOption => {
    ref.current.setPushTriggerOption(pushTriggerOption);
  };

  // for ios
  const registerAPNSPushTokenForCurrentUser = token => {
    ref.current.registerAPNSPushTokenForCurrentUser(token);
  };
  // for android
  const registerFCMPushTokenForCurrentUser = token => {
    ref.current.registerFCMPushTokenForCurrentUser(token);
  };

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
        let imageUri = response.assets[0].originalPath;

        const params = {
          fileUrl: response.assets[0].originalPath, // Or .fileUrl = FILE_URL (You can also send a file message with a file URL.)
          fileName: response.assets[0].fileName,
          thumbnailSizes: [
            {maxWidth: 100, maxHeight: 100},
            {maxWidth: 200, maxHeight: 200},
          ],
          fileSize: response.assets[0].fileSize,
        };
        channelRef.current
          .sendFileMessage(params)
          .onSucceeded(message => {
            console.log('RRRR FileMessage', message);
            // A file message with detailed configuration is successfully sent to the channel.
            // By using fileMessage.messageId, fileMessage.fileName, fileMessage.customType, and so on,
            // you can access the result object from the Sendbird server to check your FileMessageCreateParams configuration.
            // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
            const messageId = message.messageId;
          })
          .onFailed(e => {
            console.log('onFailed', e);
          });
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
      permission === 'granted' ||
      permission === 'limited' ||
      ['undetermined', 'authorized'].includes(permission)
    ) {
      openImagePicker();
    }
    return null;
  };

  useEffect(() => {
    if (message !== '') {
      const newArray = [...messageList];
      newArray.push(message);
      setMessageList([...newArray]);
    }
  }, [message]);

  useEffect(() => {
    const chatStart = async () => {
      init();
      addHandler();
      connect().then(() => {
        loadAllMessage(`channel_${data.group_id}`).then(res => {
          setMessageList(res);
          setLoading(false);
        });
      });
    };
    chatStart();
    console.log('RRRRRRR', messageList);
    console.log('RRRRRRR 2 data.chat_user_id', data.chat_user_id);
  }, []);
  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={messageList}
          keyExtractor={(item, index) => `${item.messageId}_${index}`}
          renderItem={renderMessage}
        />
      </View>
      <View style={{flexDirection: 'row', width: '100%', padding: 10}}>
        <Button title={'image'} onPress={() => uploadUsingGallery()} />
        <TextInput
          style={styles.input}
          onChangeText={txt => setTextInput(txt)}
          value={textInput}
          placeholder="type .."
        />
        <Button
          title={'send'}
          onPress={() =>
            sendMessage({
              message: textInput,
            })
          }
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
export default Chat;
