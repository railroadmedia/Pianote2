/**
 * NavMenuHeaders
*/
import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';

class NavMenuHeaders extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View 
                style={[
                    styles.centerContent, {
                    top: this.props.pxFromTop,
                    position: 'absolute',
                    flexDirection: 'row',
                    left: 0,
                    backgroundColor: 'transparent',
                    zIndex: 3,
                    elevation: 3,
                }]}
            >
                {!this.props.isHome && (
                <View
                    style={{
                        flexDirection: 'row',
                        width: fullWidth,
                        zIndex: 3,
                        backgroundColor: 'transparent',
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            height: 40*factorHorizontal,
                            width: 0.33*fullWidth,
                            backgroundColor: 'transparent',
                            elevation: 3,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('HOME')}
                            style={[
                                styles.centerContent, {
                                height: '100%',
                                width: '100%',
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <Pianote
                                height={30*factorHorizontal}
                                width={fullWidth*0.25}
                                fill={'#fb1b2f'}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.pressLeftHeader()}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 18*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                    color: 'white',
                                }}
                            >
                                {this.props.leftHeader}{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                        <View>
                            <View style={{flex: 1}}/>
                            <EntypoIcon
                                size={15*factorRatio}
                                color={'white'}
                                name={'chevron-thin-down'}
                            />
                            <View style={{flex: 0.15}}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.pressRightHeader()}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 14*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                    color: 'white',
                                }}
                            >
                                {'  '} {this.props.rightHeader}{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                        <View>
                            <View style={{flex: 1}}/>
                            <EntypoIcon
                                size={15*factorRatio}
                                color={'white'}
                                name={'chevron-thin-down'}
                            />
                            <View style={{flex: 0.15}}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View>
                )}
                
                {this.props.isHome && (
                <View
                    style={{
                        flexDirection: 'row',
                        width: fullWidth,
                        zIndex: 3,
                    }}
                >
                    <View
                        style={{
                            position: 'relative',
                            left: 0,
                            bottom: 0,
                            height: 40*factorHorizontal,
                            width: 0.33*fullWidth,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('HOME')}
                            style={[
                                styles.centerContent, {
                                height: '100%',
                                width: '100%',
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <Pianote
                                height={30*factorHorizontal}
                                width={fullWidth*0.25}
                                fill={'#fb1b2f'}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('LESSONS')
                        }}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                    color: 'white',
                                }}
                            >
                                LESSONS{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('PACKS')
                        }}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                    color: 'white',
                                }}
                            >
                                PACKS{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('MYLIST')
                        }}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                    color: 'white',
                                }}
                            >
                                MY LIST{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View>
                )}
            </View>
        )
    }
}


export default withNavigation(NavMenuHeaders);