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
                }]}
            >
                {!this.props.isHome && (
                <View key={'headers'}
                    style={{
                        flexDirection: 'row',
                        width: fullWidth,
                        zIndex: 3,
                    }}
                >
                    <View key={'image'}
                        style={{
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
                    <TouchableOpacity key={'left'}
                        onPress={() => this.props.pressLeftHeader()}
                        style={{flexDirection: 'row'}}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 18*factorRatio,
                                    fontFamily: 'Roboto-Bold',
                                    fontWeight: '900',
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
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'Roboto-Bold',
                                    fontWeight: '900',
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
                <View key={'headersHome'}
                    style={{
                        flexDirection: 'row',
                        alignContent: 'space-around',
                        justifyContent: 'space-around',
                        width: fullWidth,
                        zIndex: 3,
                        paddingLeft: fullWidth*0.035,
                        paddingRight: fullWidth*0.035,
                    }}
                >
                    <Pianote
                        height={30*factorHorizontal}
                        width={fullWidth*0.25}
                        fill={'#fb1b2f'}
                    />
                    <TouchableOpacity key={'LESSONS'}
                        onPress={() => this.props.buttonLeft()}
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <View>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'Roboto-Bold',
                                    fontWeight: '900',
                                    color: 'white',
                                }}
                            >
                                LESSONS{' '}
                            </Text>
                            <View style={{flex: 0.2}}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity key={'PACKS'}
                        onPress={() => this.props.buttonMiddle()}
                    >
                        <View style={{flex: 1}}/>
                        <Text
                            style={{
                                fontSize: 16*factorRatio,
                                fontFamily: 'Roboto-Bold',
                                fontWeight: '900',
                                color: 'white',
                            }}
                        >
                            PACKS{' '}
                        </Text>
                        <View style={{flex: 0.2}}/>
                    </TouchableOpacity>
                    <TouchableOpacity key={'MYLIST'}
                        onPress={() => this.props.buttonRight()}
                    >
                        <View style={{flex: 1}}/>
                        <Text
                            style={{
                                fontSize: 16*factorRatio,
                                fontFamily: 'Roboto-Bold',
                                fontWeight: '900',
                                color: 'white',
                            }}
                        >
                            MY LIST{' '}
                        </Text>
                        <View style={{flex: 0.2}}/>
                    </TouchableOpacity>
                </View>
                )}
            </View>
        )
    }
}


export default withNavigation(NavMenuHeaders);