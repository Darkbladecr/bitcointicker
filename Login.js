import React from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      secret: '',
    };
  }
  render() {
    const { visible, submit } = this.props;
    return (
      <Modal animationType="slide" transparent={false} visible={visible}>
        <View style={styles.container}>
          <View style={styles.separator} />
          <View style={styles.modal}>
            <Text>Login to Bitmex</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Bitmex API Key"
              onChangeText={key => this.setState({ key })}
            />
            <TextInput
              style={{ ...styles.textInput, marginBottom: 40 }}
              placeholder="Bitmex API Secret"
              onChangeText={secret => this.setState({ secret })}
            />
            <Button
              onPress={() => submit(this.state.key, this.state.secret)}
              title="Submit"
            />
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    flex: 1,
  },
  modal: {
    flex: 1,
    width: 300,
    paddingBottom: 200,
  },
  textInput: {
    height: 40,
    fontSize: 20,
  },
});
export default Login;
