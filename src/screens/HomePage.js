import React, {useEffect} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {init} from 'react-native-altibbi';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
  },
  button: {
    width: '100%',
    borderRadius: 15,
    height: 50,
    backgroundColor: '#10e1d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
const HomePage = props => {
  useEffect(() => {
    init('https://tawuniya.altibb.com', 'en', 'abd');
  }, []);

  const navigate = page => {
    props.navigation.navigate(page);
  };

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => navigate('UserPage')}
        style={styles.button}>
        <Text style={styles.buttonText}>User Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate('ConsultationPage')}
        style={styles.button}>
        <Text style={styles.buttonText}>consultation Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;
