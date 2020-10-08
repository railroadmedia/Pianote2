/**
 * DisplayName
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';

class DisplayName extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <View
                key={'container'}
                style={{
                    height: fullHeight,
                    width: fullWidth,
                    backgroundColor: 'transparent',
                }}
            >
                <View key={'buffTop'} style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => this.props.hideDisplayName()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </View>
                <View
                    key={'content'}
                    style={{
                        height: fullWidth * 0.65,
                        width: '100%',
                        flexDirection: 'row',
                    }}
                >
                    <View key={'buffLeft'} style={{width: '5%'}}>
                        <TouchableOpacity
                            onPress={() => this.props.hideDisplayName()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </View>
                    <View
                        key={'content'}
                        style={{
                            height: '100%',
                            width: '90%',
                            backgroundColor: 'white',
                            borderRadius: 15 * factorRatio,
                        }}
                    >
                        <View style={{height: fullHeight * 0.035}} />
                        <View key={'emailTaken'} style={styles.centerContent}>
                            <Text
                                style={{
                                    fontSize: 22 * factorRatio,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                This display name {'\n'} is already in use.
                            </Text>
                        </View>
                        <View style={{height: fullHeight * 0.035}} />
                        <View key={'toUseThis'}>
                            <View style={{flex: 1}} />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans',
                                    fontSize: 16 * factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Please try again.
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: fullHeight * 0.035}} />
                        <View key={'buttons'} style={{flex: 0.45}}>
                            <View
                                key={'SIGNUP'}
                                style={{
                                    height: '100%',
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{width: '15%'}} />
                                <View
                                    style={{
                                        height: '100%',
                                        width: '70%',
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View
                                        style={{
                                            height: '80%',
                                            width: '100%',
                                            borderRadius: 45 * factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.hideDisplayName();
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontSize: 17 * factorRatio,
                                                    fontWeight: 'bold',
                                                    color: '#fb1b2f',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                TRY AGAIN
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{width: '15%'}} />
                            </View>
                        </View>
                    </View>
                    <View key={'buffRight'} style={{width: '5%'}}>
                        <TouchableOpacity
                            onPress={() => this.props.hideDisplayName()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </View>
                </View>
                <View key={'buffBottom'} style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => this.props.hideDisplayName()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </View>
            </View>
        );
    };
}

export default withNavigation(DisplayName);
