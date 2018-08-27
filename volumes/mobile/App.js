import React from 'react';
import { WebView } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
        <WebView
            source={{uri: 'http://192.168.1.21'}}
            style={{marginTop: 20}}
        />
    );
  }
}
