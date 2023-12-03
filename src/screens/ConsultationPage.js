import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  createConsultation,
  deleteConsultation,
  getConsultationInfo,
  getConsultationList,
  getLastConsultation,
  getPrescription,
} from 'react-native-altibbi';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadMedia} from 'react-native-altibbi/src/connection';
import {PERMISSIONS, request} from 'react-native-permissions';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#10e1d0',
    flex: 1,
    borderRadius: 15,
    marginTop: 20,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHolder: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    marginVertical: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    textAlign: 'auto',
  },
  input2: {
    marginTop: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'auto',
    paddingLeft: 20,
  },
  input3: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    height: 40,
    marginRight: 20,
    width: 40,
  },
});
const ConsultationPage = props => {
  const [picked, setPicked] = useState('chat');
  const [textBody, setTextBody] = useState('');
  const [id, setId] = useState();
  const [id2, setId2] = useState();
  const [userId, setUserId] = useState();

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log('RRRRRRR here 2');
        let imageUri = response.assets[0].uri;
        console.log('RRRRRRRR', response);
        const source =
          Platform.OS === 'android'
            ? response.assets[0].uri
            : response.assets[0].uri.replace('file://', '');
        const fileName = encodeURI(source.replace(/^.*[\\\/]/, ''));

        uploadMedia(source, response.assets[0].type, fileName).then(res => {
          console.log('RRRRr', res);
        });
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
    console.log('per', permission);
    if (
      permission === 'granted' ||
      permission === 'limited' ||
      ['undetermined', 'authorized'].includes(permission)
    ) {
      openImagePicker();
    }
    return null;
  };

  return (
    <ScrollView style={{backgroundColor: '#F3F3F4'}}>
      <View style={{padding: 20}}>
        <RadioButtons pick={[picked, setPicked]} />
        <TextInput
          keyboardType={'number-pad'}
          style={styles.input2}
          placeholder="userId"
          value={userId}
          onChangeText={text => setUserId(text)}
        />
        <TextInput
          style={styles.input}
          multiline
          placeholder="What's happening?"
          value={textBody}
          onChangeText={text => setTextBody(text)}
        />
        <TouchableOpacity
          onPress={() => {
            if (!textBody || textBody.length < 10 || !userId) {
              return;
            }
            createConsultation({
              question: textBody,
              medium: picked,
              userId,
            }).then(res => {
              console.log('RRRRRRRRR', res);
            });
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Create Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            getConsultationList(1, 39, 20).then(res => {
              console.log(res);
            });
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Consultation List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('RRRRRRRRR 134132');
            getLastConsultation().then(res => {
              if (res.data[0].status !== 'closed') {
                props.navigation.navigate('WaitingRoom', {
                  videoConfig: res?.data[0]?.videoConfig,
                  voipConfig: res?.data[0]?.voipConfig,
                  chatConfig: res?.data[0]?.chatConfig,
                  channel: res.data[0].pusherChannel,
                  pusherKey: res.data[0].pusherAppKey,
                });
              }
            });
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Last Consultation</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={id}
            onChangeText={idText => setId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              if (!id) {
                return;
              }
              deleteConsultation(id).then(res => {
                console.log(res);
              });
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Consultation List</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={id2}
            onChangeText={idText => setId2(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              if (!id2) {
                return;
              }
              getConsultationInfo(id2).then(res => {
                console.log(res);
              });
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Consultation by id</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            getPrescription(230).then(async response => {
              // you have to install RNFetchBlob && Buffer for this code to work
              /* try {
                const {
                  dirs: {DownloadDir, DocumentDir}, // DownloadDir for android  , DocumentDir for ios
                } = RNFetchBlob.fs;
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64String = buffer.toString('base64');
                const filePath = DownloadDir + '/my-document12.pdf';
                await RNFetchBlob.fs.createFile(filePath, base64String, 'base64');
              } catch (e) {
                console.log('RRRRRRRR error ', e);
              }*/
            });
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>download Prescription</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => uploadUsingGallery()}
          style={styles.button}>
          <Text style={styles.buttonText}>uploadImage</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const RadioButtons = props => {
  const [picked, setPicked] = props.pick;
  const array = ['chat', 'gsm', 'voip', 'video'];

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      {array.map(item => {
        return (
          <TouchableOpacity
            key={item}
            style={{marginRight: 20}}
            onPress={() => {
              setPicked(item);
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: item === picked ? '#10e1d0' : '#6b5f5f',
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ConsultationPage;
