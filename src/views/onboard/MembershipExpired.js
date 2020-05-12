/**
 * MembershipExpired
 */
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

export default class MembershipExpired extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    async changeColor(number) {
        if(number == 0) {
            await this.setState({page: 1})
        } else if(number == 1) {
            await this.setState({page: 2})
        } else if(number == 2) {
            await this.setState({page: 3})
        } else if(number == 3) {
            await this.setState({page: 4})
        } else if(number == 4) {
            await this.setState({page: 5})
        }

        await this.forceUpdate()
    }


    render() {
        return (
            <View style={[
                    styles.centerContent, {
                    height: fullHeight,
                }]}
            >
                <View key={'MembershipExpiredSignup'} 
                    style={[
                        styles.centerContent, {
                        width: fullWidth,
                        height: fullHeight,
                    }]}
                >
                    <View key={'pianote1'}
                        style={{
                            position: 'absolute', 
                            top: fullHeight*0.03,
                            zIndex: 2,
                        }}
                    >
                        <Pianote
                            height={75*factorRatio}
                            width={125*factorRatio}
                            fill={'#fb1b2f'}
                        />
                    </View>
                    <GradientFeature
                        color={'grey'}
                        opacity={1}
                        height={'70%'}
                        borderRadius={0}
                    />
                    <View key={'image1'}
                        style={{
                            flex: 0.75, 
                            alignSelf: 'stretch',
                        }}
                    >
                        <FastImage
                            style={{flex: 1}}
                            source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View key={'buffer1'}
                        style={{
                            flex: 0.25,
                            backgroundColor: 'rgba(23, 26, 26, 1)',
                            alignSelf: 'stretch',
                        }}
                    >
                    </View>
                    <View key={'content1'}
                        style={{
                            position: 'absolute',
                            bottom: fullHeight*0.165,
                            width: fullWidth,
                            zIndex: 3,
                        }}
                    >
                        <View style={{flex: 1}}/>
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 28*factorRatio,
                                paddingLeft: fullWidth*0.15,
                                paddingRight: fullWidth*0.15,
                                fontWeight: '800',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            Your Membership {"\n"} Has Expired
                        </Text>
                        <View style={{height: 25*factorVertical}}/>
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 18*factorRatio,
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.05,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            Your account no longer has access to Pianote. Click the button below to renew your membership - or, if you believe this is an error, please contact support@pianote.com
                        </Text>
                    </View>
                    <View key={'content1b'}
                        style={{
                            position: 'absolute',
                            bottom: fullHeight*0.055,
                            width: fullWidth,
                            zIndex: 3,
                        }}
                    >
                        <View key={'buttons'}
                            style={{
                                height: fullHeight*0.075,
                                flexDirection: 'row',
                                paddingLeft: fullWidth*0.02,
                                paddingRight: fullWidth*0.02,
                            }}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    flex: 1,
                                }]}
                            >
                                <View 
                                    style={{
                                        height: '80%',
                                        width: '95%',
                                        borderRadius: 60,
                                        backgroundColor: '#fb1b2f',
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('NEWMEMBERSHIP', {'type': false})
                                        }}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 18*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}
                                        >
                                            RENEW MEMBERSHIP
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    whiteBordersCircles: {
        borderColor: 'white',
        borderWidth: 1.25,
        borderRadius: 20,
        position: 'absolute',
        bottom: 0,
    },
    MembershipExpiredSignupButton: {
        height: 25, 
        width: '100%',
        backgroundColor: 'transparent', 
        borderWidth: 1.25,
        borderColor: 'white', 
        borderRadius: 10, 
    },
});



