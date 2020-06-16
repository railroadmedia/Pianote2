/**
 * PasswordEmailMatch
 */
import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class PasswordEmailMatch extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    
    render = () => {
        return (         
            <View key={'container'}
                style={{
                    height: fullHeight, 
                    width: fullWidth, 
                    backgroundColor: 'transparent',
                }}
            >
                <View key={'buffTop'}
                    style={{
                        height: '37%',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hidePasswordEmailMatch()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >

                    </TouchableOpacity>
                </View>
                <View key={'content'}
                    style={{
                        height: '26%',
                        width: '100%',
                        flexDirection: 'row',
                    }}
                >
                    <View key={'buffLeft'}
                        style={{width: '5%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hidePasswordEmailMatch()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                    </View>
                    <View key={'content'}
                        style={{
                            height: '100%',
                            width: '90%',
                            backgroundColor: '#f7f7f7',
                            borderRadius: 15*factorRatio,
                        }}
                    >
                        <View key={'buffer'}
                            style={[
                                styles.centerContent, {
                                flex: 0.125,
                            }]}
                        />
                        <View key={'emailTaken'}
                            style={[
                                styles.centerContent, {
                                flex: 0.4,
                            }]}
                        >
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 22*factorRatio,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                Your password and email{'\n'}do not match.
                            </Text>
                        </View>
                        <View style={{flex: 0.075}}/>
                        <View key={'toUseThis'}>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 16*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Please try again.
                            </Text>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 0.1}}/>
                        <View key={'buttons'}
                            style={{flex: 0.45}}
                        >
                            <View key={'SIGNUP'}
                                style={{
                                    height: '100%',
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{width: '15%'}}/>
                                <View
                                    style={{
                                        height: '100%',
                                        width: '70%',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={{
                                            height: '80%',
                                            width: '100%',
                                            borderRadius: 45*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.hidePasswordEmailMatch()
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 17*factorRatio,
                                                    fontWeight: 'bold',
                                                    color: '#fb1b2f',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                TRY AGAIN
                                            </Text>
                                            <View style={{flex: 1}}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{width: '15%'}}/>
                            </View>
                        </View>
                    </View>
                    <View key={'buffRight'}
                        style={{width: '5%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hidePasswordEmailMatch()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                    </View>
                </View>            
                <View key={'buffBottom'}
                    style={{height: '27.5%'}}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hidePasswordEmailMatch()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default withNavigation(PasswordEmailMatch);