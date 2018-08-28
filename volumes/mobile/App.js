import React from 'react';
import {View, WebView} from 'react-native';

export default class App extends React.Component {
    render() {
        return (
            <WebView
                source={{uri: 'http://' + process.env['APP_HOSTNAME'] + '?isApp=1'}}
                style={{marginTop: 24}}
            />
        );
    }

    static renderLoading() {
        return (
            <View>
                Loading
            </View>
        );
    }
}
