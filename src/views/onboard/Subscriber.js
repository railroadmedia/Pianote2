/**
 * Subscriber
 */
import React from 'react';
import { View } from 'react-native';

export default class Subscriber extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: true
        }
    }

    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}/>
        )
    }
}