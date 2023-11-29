import {Pusher} from '@pusher/pusher-websocket-react-native';
import {
  PusherEvent,
  PusherMember,
} from '@pusher/pusher-websocket-react-native/src';

import {Constants} from 'react-native-altibbi';

interface PusherObject {
  key: string;
  token: string;
  channelName: string;
  onError?: (message: string, code: Number, e: any) => void;
  onEvent?: (event: PusherEvent) => void;
  onConnectionStateChange?: (
    currentState: string,
    previousState: string,
  ) => void;
  onSubscriptionSucceeded?: (channelName: string, data: any) => void;
  onSubscriptionError?: (channelName: string, message: string, e: any) => void;
  onDecryptionFailure?: (eventName: string, reason: string) => void;
  onMemberAdded?: (channelName: string, member: PusherMember) => void;
  onMemberRemoved?: (channelName: string, member: PusherMember) => void;
  onSubscriptionCount?: (
    channelName: string,
    subscriptionCount: Number,
  ) => void;
}

const usePusher = () => {
  const pusherInstance = Pusher.getInstance();
  const disconnect = () => pusherInstance?.disconnect();
  const connect = async ({
    key,
    token,
    onError,
    onEvent,
    channelName,
    onConnectionStateChange,
    onSubscriptionSucceeded,
    onSubscriptionError,
    onDecryptionFailure,
    onMemberAdded,
    onMemberRemoved,
    onSubscriptionCount,
  }: PusherObject) => {
    if (!Constants.domain) {
      throw new Error(
        'You Should add your domain to the constant object : Constants.domain = YOUR_DOMAIN',
      );
    }
    if (!token) {
      throw new Error(
        'You Should provide the user token for pusher connection ',
      );
    }
    if (!channelName) {
      throw new Error(
        'You Should provide the channel Name for pusher to subscribe to event ',
      );
    }

    try {
      await pusherInstance.init({
        apiKey: key,
        cluster: 'eu',
        authEndpoint: `https://${Constants.domain}/v1/auth/pusher?access-token=${token}`,
        onConnectionStateChange,
        onError,
        onEvent,
        onSubscriptionSucceeded,
        onSubscriptionError,
        onDecryptionFailure,
        onMemberAdded,
        onMemberRemoved,
        onSubscriptionCount,
      });
      await pusherInstance.subscribe({channelName});
      await pusherInstance.connect();
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  return {
    connect,
    disconnect,
  };
};

export default usePusher;
