import React, {useRef, useState} from 'react';
import {
  OTPublisher,
  OTSession,
  OTSubscriber,
  OTSubscriberView,
} from 'opentok-react-native';
import {Dimensions} from 'react-native';
const Video = props => {
  const data = props.route.params.event;
  const voip = props.route.params.voip;

  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(!voip);
  const [camera, setCamera] = useState('front');
  const sessionRef = useRef(null);

  const toggleVideo = () => setVideo(prev => !prev);
  const toggleAudio = () => setAudio(prev => !prev);
  const switchCamera = () =>
    setCamera(prev => {
      if (prev === 'front') {
        return 'back';
      } else {
        return 'front';
      }
    });

  const renderSubscribers = subscribers => {
    if (subscribers && subscribers.length > 0) {
      const {width: screenWidth, height: screenHeight} =
        Dimensions.get('window');
      return subscribers.map(streamId => (
        <OTSubscriberView
          streamId={streamId}
          style={{width: screenWidth, height: screenHeight}}
        />
      ));
    }
  };
  console.log('RRRRRRRR', data);
  return (
    <OTSession
      options={{
        androidZOrder: 'onTop',
        androidOnTop: 'publisher',
      }}
      ref={ref => (sessionRef.current = ref)}
      apiKey={data.api_key}
      sessionId={data.call_id}
      token={data.token}
      eventHandlers={{
        streamDestroyed: event => {},
        error: event => {},
        otrnError: event => {},
      }}>
      <OTSubscriber
        eventHandlers={{
          error: event => {},
          otrnError: event => {},
        }}>
        {renderSubscribers}
      </OTSubscriber>
      <OTPublisher
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          top: 0,
          margin: 5,
          right: 0,
        }}
        properties={{
          cameraPosition: camera,
          publishVideo: video,
          publishAudio: audio,
        }}
        eventHandlers={{
          streamDestroyed: event => {},
          error: event => {},
          otrnError: event => {},
        }}
      />
    </OTSession>
  );
};

export default Video;
