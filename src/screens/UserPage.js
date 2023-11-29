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
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
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
    marginTop: 10,
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
});
const UserPage = props => {
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState();
  const [insuranceId, setInsuranceId] = useState();
  const [policyNumber, setPolicyNumber] = useState();
  const [nationalityNumber, setNationalityNumber] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [bloodType, setBloodType] = useState();
  const [smoker, setSmoker] = useState();
  const [alcoholic, setAlcoholic] = useState();
  const [maritalStatus, setMaritalStatus] = useState();
  const [id, setID] = useState();
  const [id2, setID2] = useState();

  return (
    <ScrollView style={{backgroundColor: '#F3F3F4'}}>
      <View style={{padding: 20}}>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setName(text)}
            value={name}
            placeholder="Name"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setDateOfBirth(text)}
            value={dateOfBirth}
            placeholder="date of birth"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder="email"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setPhoneNumber(text)}
            value={phoneNumber}
            placeholder="phoneNumber"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setGender(text)}
            value={gender}
            placeholder="gender"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setInsuranceId(text)}
            value={insuranceId}
            placeholder="insuranceId"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setHeight(text)}
            value={height}
            placeholder="height"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setWeight(text)}
            value={weight}
            placeholder="weight"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setPolicyNumber(text)}
            value={policyNumber}
            placeholder="policyNumber"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setNationalityNumber(text)}
            value={nationalityNumber}
            placeholder="nationalityNumber"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setSmoker(text)}
            value={smoker}
            placeholder="smoker"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setBloodType(text)}
            value={bloodType}
            placeholder="bloodType"
          />
        </View>
        <View style={styles.viewHolder}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setAlcoholic(text)}
            value={alcoholic}
            placeholder="alcoholic"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => setMaritalStatus(text)}
            value={maritalStatus}
            placeholder="maritalStatus"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            createUser({
              name,
              phoneNumber,
              email,
              dateOfBirth,
              gender,
              insuranceId,
              policyNumber,
              nationalityNumber,
              height,
              weight,
              bloodType,
              smoker,
              alcoholic,
              maritalStatus,
            }).then(res => {
              console.log(res);
            });
          }}>
          <Text style={styles.buttonText}>Create Phr</Text>
        </TouchableOpacity>
        <View style={styles.viewHolder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!id || id.length === 0) {
                console.log(id);
                return;
              }
              getUser(id).then(res => {
                console.log('response', res);
              });
            }}>
            <Text style={styles.buttonText}>get user by id</Text>
          </TouchableOpacity>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.textInput}
            onChangeText={text => setID(text)}
            value={id}
            placeholder="user Id"
          />
        </View>
        <View style={styles.viewHolder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              deleteUser(id2).then(res => {
                console.log(res);
              });
            }}>
            <Text style={styles.buttonText}>delete user</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setID2(text)}
            value={id2}
            placeholder="userDeleteId"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            getUsers(1).then(res => {
              console.log(res);
            });
          }}>
          <Text style={styles.buttonText}>get all users</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserPage;
