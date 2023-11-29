import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Constants} from 'react-native-altibbi';
import usePusher from '../hooks/usePusher';

const WaitingRoom = props => {
  const {channel, pusherKey} = props?.route?.params;
  const {connect, disconnect} = usePusher();

  const log = line => {
    console.log(line);
  };

  const onConnectionStateChange = (currentState, previousState) => {
    log(
      `onConnectionStateChange. previousState=${previousState} newState=${currentState}`,
    );
  };

  const onError = (message, code, error) => {
    log(`onError: ${message} code: ${code} exception: ${error}`);
  };

  const onEvent = event => {
    console.log('RRRRRRRR event', event);
    if (event != null && event.eventName === 'call-status') {
      log(`call-status: ${event}`);
    } else if (event != null && event.eventName === 'video-conference-ready') {
      props.navigation.navigate('Video', {
        event: JSON.parse(event.data),
      });
    } else if (event != null && event.eventName === 'voip-conference-ready') {
      console.log('RRRRRRRR voip-conference-ready', event);
      props.navigation.navigate('Video', {
        event: JSON.parse(event.data),
        voip: true,
      });
    } else if (event != null && event.eventName === 'chat-conference-ready') {
      props.navigation.navigate('ChatRoom', {
        event: JSON.parse(event.data),
      });
    }
  };

  const onSubscriptionSucceeded = (channelName, data) => {
    log(
      `onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(data)}`,
    );
  };

  const onSubscriptionCount = (channelName, subscriptionCount) => {
    log(
      `onSubscriptionCount: ${subscriptionCount}, channelName: ${channelName}`,
    );
  };

  const onSubscriptionError = (channelName, message, e) => {
    log(`onSubscriptionError: ${message}, channelName: ${channelName} e: ${e}`);
  };

  const onDecryptionFailure = (eventName, reason) => {
    log(`onDecryptionFailure: ${eventName} reason: ${reason}`);
  };

  const onMemberAdded = (channelName, member) => {
    log(`onMemberAdded: ${channelName} user: ${member}`);
  };

  const onMemberRemoved = (channelName, member) => {
    log(`onMemberRemoved: ${channelName} user: ${member}`);
  };

  const connectFunction = async () => {
    try {
      await connect({
        cluster: 'eu',
        key: pusherKey,
        token: Constants.token,
        onError,
        onEvent,
        channelName: channel,
        onConnectionStateChange,
        onSubscriptionSucceeded,
        onSubscriptionError,
        onDecryptionFailure,
        onMemberAdded,
        onMemberRemoved,
        onSubscriptionCount,
      });
    } catch (e) {
      log('ERROR: ' + e);
    }
  };

  useEffect(() => {
    if (props?.route?.params?.chatConfig) {
      props.navigation.navigate('ChatRoom', {
        event: props.route.params.chatConfig,
      });
    } else if (props?.route?.params.videoConfig) {
      props.navigation.navigate('Video', {
        event: props.route.params.videoConfig,
      });
    } else if (props?.route?.params.voipConfig) {
      props.navigation.navigate('Video', {
        event: props.route.params.voipConfig,
        voip: true,
      });
    } else {
      connectFunction().then();
    }
  }, []);

  return (
    <View>
      <Text style={{marginVertical: 20, fontSize: 20}}>Waiting For Doctor</Text>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default WaitingRoom;
