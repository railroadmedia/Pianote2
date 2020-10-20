import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    toggleLoading(isLoading) {
        this.setState(state => {
            isLoading = isLoading === undefined ? !state.isLoading : isLoading;
            return {isLoading};
        });
    }

    render() {
        let {backgroundColor, activityColor} = this.props;
        return (
            <View
                style={[
                    styles.loadingContainer,
                    {backgroundColor: backgroundColor || 'rgba(0,0,0,.5)'},
                    this.state.isLoading ? {width: '100%'} : {width: 0},
                ]}
            >
                <ActivityIndicator
                    size={'large'}
                    color={activityColor || 'white'}
                    animating={this.state.isLoading}
                    style={{marginTop: 10, marginBottom: 10}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        overflow: 'hidden',
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        zIndex: 2,
    },
});
