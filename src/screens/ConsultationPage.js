import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  createConsultation,
  deleteConsultation,
  getConsultationInfo,
  getConsultationList,
  getLastConsultation,
} from 'react-native-altibbi';

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
