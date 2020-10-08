/**
 * ResetIcon
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class ResetIcon extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <View
                style={[
                    styles.centerContent,
                    {
                        position: 'absolute',
                        top: this.props.pxFromTop,
                        left: this.props.pxFromLeft,
                        borderRadius: fullWidth * 0.1,
                        width: this.props.buttonWidth,
                        height: this.props.buttonHeight,
                        backgroundColor: '#fb1b2f',
                        flexDirection: 'row',
                        elevation: 5,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.props.pressed();
                    }}
                    style={[
                        styles.centerContent,
                        {
                            flex: 1,
                            flexDirection: 'row',
                        },
                    ]}
                >
                    <View style={{flex: 1}} />
                    <MaterialIcon
                        name={'replay'}
                        size={25 * factorRatio}
                        color={'white'}
                    />
                    <View style={{flex: 0.1}} />
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: 'RobotoCondensed-Bold',
                            fontSize: 14 * factorRatio,
                        }}
                    >
                        RESET
                    </Text>
                    <View style={{flex: 1}} />
                </TouchableOpacity>
            </View>
        );
    };
}

export default withNavigation(ResetIcon);
