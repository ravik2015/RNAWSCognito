import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  ActivityIndicator
} from "react-native";
import Amplify, { Auth } from "aws-amplify";
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);
Amplify.Logger.LOG_LEVEL = "DEBUG";

global.isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      openConfirmationModal: false,
      code: null,
      loading: false
    };
  }

  signup = (username, password) => {
    this.setState({ loading: true });
    Auth.signUp({
      username,
      password,
      attributes: {
        email: username
      },
      validationData: [] //optional
    })
      .then(data => {
        console.log(data, "signup successfull");
        this.setState({
          openConfirmationModal: !this.state.openConfirmationModal,
          loading: false
        });
      })
      .catch(err => console.log(err, "signup error"));
  };

  confirmCode = code => {
    this.setState({ loading: true });

    // After retrieveing the confirmation code from the user
    Auth.confirmSignUp(this.state.email, code, {
      //Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true
    })
      .then(data => {
        console.log(data, "confirm code successfull");
        this.setState({
          openConfirmationModal: !this.state.openConfirmationModal,
          loading: false
        });
      })
      .catch(err => console.log(err, "confirm code error"));
  };

  resendConfirmationCode = () => {
    Auth.resendSignUp(username)
      .then(() => {
        console.log("code resent successfully");
      })
      .catch(e => {
        console.log(e);
      });
  };

  signin = (username, password) => {
    Auth.signIn({
      username, // Required, the username
      password, // Optional, the password
      validationData // Optional, a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication
    })
      .then(user => console.log(user))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Username :</Text>
        <TextInput
          value={this.state.email}
          underlineColorAndroid={"transparent"}
          style={{ borderBottomColor: "#dadada", borderBottomWidth: 1 }}
          autoCapitalize={"none"}
          autoCorrect={false}
          onChangeText={email => this.setState({ email })}
        />
        <Text style={{ marginTop: 20 }}>Password :</Text>
        <TextInput
          value={this.state.password}
          underlineColorAndroid={"transparent"}
          autoCapitalize={"none"}
          autoCorrect={false}
          style={{ borderBottomColor: "#dadada", borderBottomWidth: 1 }}
          onChangeText={password => this.setState({ password })}
        />

        {this.state.loading ? (
          <ActivityIndicator color="dodgerblue" size="large" />
        ) : (
          <Button
            style={{ marginTop: 40 }}
            title={"Signup"}
            onPress={() => {
              this.signup(this.state.email, this.state.password);
            }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.openConfirmationModal}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginHorizontal: 30
            }}
          >
            <Text>Enter confirmation code :</Text>
            <TextInput
              value={this.state.code}
              underlineColorAndroid={"transparent"}
              autoCapitalize={"none"}
              autoCorrect={false}
              style={{
                borderBottomColor: "#dadada",
                borderBottomWidth: 1,
                marginTop: 10
              }}
              onChangeText={code => this.setState({ code })}
            />
            {this.state.loading ? (
              <ActivityIndicator color="dodgerblue" size="large" />
            ) : (
              <Button
                style={{ marginTop: 40 }}
                title={"Confirm code"}
                onPress={() => {
                  this.confirmCode(this.state.code);
                }}
              />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
    marginHorizontal: 30,
    paddingVertical: 30
  }
});
