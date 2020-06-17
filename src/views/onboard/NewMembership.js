/**
 * NewMembership
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Alert,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';

export default class NewMembership extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            step: 3,
            newUser: this.props.navigation.state.params.data.type,
            email: this.props.navigation.state.params.data.email,
            password: this.props.navigation.state.params.data.password,
        }
    }


    paid = async (plan) => {
        // if successful payment
        if(true == true) {
            if(this.state.newUser) {
            
                await this.props.navigation.navigate('CREATEACCOUNT3', {
                    data: {
                        email: this.state.email,
                        password: this.state.password,
                        plan,
                    }
                })
            } else {
                // restore purchases
                await this.props.navigation.navigate('GETRESTARTED', {
                    data: {
                        loggedInStatus: 'true',
                        email: this.state.email,
                        password: this.state.password,
                        plan,
                    }
                })
            }
        }
    }


    render() {
        return (
            <View style={[
                    styles.centerContent, {
                    height: fullHeight,
                    backgroundColor: '#fb1b2e',
                    opacity: 0.98
                }]}
            >
                <View key={'goBackIcon'}
                    style={[
                        styles.centerContent, {
                        position: 'absolute',
                        left: 17.5*factorHorizontal,
                        top: (isNotch) ?  50*factorVertical : 30*factorVertical,
                        height: 50*factorRatio,
                        width: 50*factorRatio,
                        zIndex: 10,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            (this.props.navigation.state.params.type == 'SIGNUP' ?
                            this.props.navigation.goBack() :
                            this.props.navigation.navigate('LOGINCREDENTIALS'))
                        }}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <EntypoIcon
                            name={'chevron-thin-left'}
                            size={25*factorRatio}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <View key={'redHalf'}
                    style={{
                        height: fullHeight*0.5,
                        width: fullWidth,
                    }}
                >
                </View>
                <View key={'blackHalf'}
                    style={{
                        height: fullHeight*0.65,
                        width: fullWidth*1.7,
                        borderTopLeftRadius: 225*factorRatio,
                        borderTopRightRadius: 225*factorRatio,
                        backgroundColor: '#181a1a',
                        opacity: 1,
                    }}
                >
                </View>
                <View key={'content'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: fullHeight,
                        width: fullWidth,
                        zIndex: 2,
                    }}
                >
                    <View style={{flex: 1}}>
                        <View key={'buff0'}
                            style={{
                                height: (Platform.OS == 'ios') ? fullHeight*0.115 : fullHeight*0.085
                            }}
                        >
                        </View>
                        <Text key={'7day'}
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 26*factorRatio,
                                fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            Start Your 7-Day {"\n"} FREE Trial Today
                        </Text>
                        <View style={{height: fullHeight*0.01}}/>
                        <Text key={'onUs'}
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 16*factorRatio,
                                textAlign: 'center',
                                color: 'white',
                                paddingLeft: fullWidth*0.1,
                                paddingRight: fullWidth*0.1,
                            }}
                        >
                            Your first 7 days are on us. Choose the plan that will start after your trial ends.
                        </Text>
                        <View key={'programs'} 
                            style={{
                                height: fullHeight*0.35,
                                width: fullWidth,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View key={'plans'}
                                style={{
                                    height: '85%',
                                    width: fullWidth,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View key={'plan1'}
                                    style={{
                                        width: fullWidth*0.45,
                                        height: '100%',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={{
                                            height: '90%',
                                            width: '100%',
                                            backgroundColor: 'white',
                                            borderRadius: 10*factorRatio,
                                            borderBottomLeftRadius: 10*factorRatio,
                                            borderBottomRightRadius: 10*factorRatio,
                                        }}
                                    >
                                        <View style={{flex: 0.05}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 18*factorRatio,
                                                fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            MONTHLY PLAN
                                        </Text>
                                        <View style={{flex: 0.015}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 8*factorRatio,
                                                fontWeight: '400',
                                                textAlign: 'center',
                                            }}
                                        >
                                            If you prefer flexibility
                                        </Text>
                                        <View 
                                            style={{
                                                flex: 0.125,
                                                borderBottomColor: '#ececec',
                                                borderBottomWidth: 1,
                                            }}
                                        />
                                        <View 
                                            style={{
                                                flex: 0.125,
                                            }}
                                        />
                                        <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 28*factorRatio,
                                                    fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                $29.99<Text 
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        fontSize: 9*factorRatio,
                                                        color: 'grey',
                                                    }}>/mo</Text>
                                            </Text>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                bottom: '7.5%',
                                                height: '30%',
                                                width: '100%',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <TouchableOpacity
                                                onPress={() => this.paid('plan1')}
                                                style={{
                                                    height: '80%',
                                                    width: '90%',
                                                    borderRadius: 50*factorRatio,
                                                    backgroundColor: '#fb1b2f',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        fontSize: 13*factorRatio,
                                                        fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                                    }}
                                                >
                                                    START YOUR{"\n"}7-DAY FREE TRIAL
                                                </Text>
                                                <View style={{flex: 1}}/>
                                            </TouchableOpacity>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                              
                                </View>
                                <View style={{flex: 1}}/>
                                <View key={'plan2'}
                                    style={{
                                        width: fullWidth*0.45,
                                        height: '100%',
                                        borderRadius: 10*factorRatio,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <View
                                        style={{
                                            height: '10%',
                                            width: '100%',
                                            borderTopLeftRadius: 10*factorRatio,
                                            borderTopRightRadius: 10*factorRatio,
                                            backgroundColor: 'black',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 10*factorRatio,
                                                fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}
                                        >
                                            SAVE 45% VS MONTHLY
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View
                                        style={{
                                            height: '90%',
                                            width: '100%',
                                            backgroundColor: 'white',
                                            borderBottomLeftRadius: 10*factorRatio,
                                            borderBottomRightRadius: 10*factorRatio,
                                        }}
                                    >
                                        <View style={{flex: 0.05}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 18*factorRatio,
                                                fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            ANNUAL PLAN
                                        </Text>
                                        <View style={{flex: 0.015}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 8*factorRatio,
                                                fontWeight: '400',
                                                textAlign: 'center',
                                            }}
                                        >
                                            If you're commited to improving
                                        </Text>
                                        <View 
                                            style={{
                                                flex: 0.125,
                                                borderBottomColor: '#ececec',
                                                borderBottomWidth: 1,
                                            }}
                                        />
                                        <View 
                                            style={{flex: 0.125}}
                                        />
                                        <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 28*factorRatio,
                                                    fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                $199.99<Text 
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        fontSize: 9*factorRatio,
                                                        color: 'grey',
                                                    }}>/yr</Text>
                                            </Text>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                bottom: '7.5%',
                                                height: '30%',
                                                width: '100%',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <TouchableOpacity
                                                onPress={() => this.paid('plan2')}
                                                style={{
                                                    height: '80%',
                                                    width: '90%',
                                                    borderRadius: 50*factorRatio,
                                                    backgroundColor: '#fb1b2f',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        fontSize: 13*factorRatio,
                                                        fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                                    }}
                                                >
                                                    START YOUR{"\n"}7-DAY FREE TRIAL
                                                </Text>
                                                <View style={{flex: 1}}/>
                                            </TouchableOpacity>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        {this.state.newUser && (
                        <View key={'progress'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth,
                                zIndex: 4,
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View
                                style={{
                                    height: '100%',
                                    width: '92.5%',
                                    borderRadius: 40*factorRatio,
                                    borderWidth: 2*factorRatio,
                                    backgroundColor: 'rgba(23, 24, 25, 0.6)',
                                    flexDirection: 'row',
                                }}
                            >
                                <View key={'step1'}
                                    style={{
                                        flex: 1.1,
                                        height: '100%',
                                        borderTopLeftRadius: 40*factorRatio,
                                        borderBottomLeftRadius: 40*factorRatio,
                                        borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                        borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                        backgroundColor: 'black',
                                        zIndex: 2,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                            borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                            borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '400',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            Step 1:
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            EMAIL ADDRESS
                                        </Text>
                                    </View>
                        
                                </View>
                                <View key={'step2'}
                                    style={{
                                        flex: 1.1,
                                        borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                        borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : 0,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                            borderTopRightRadius: (this.state.step == 2) ? 40*factorRatio : 0,
                                            borderBottomRightRadius: (this.state.step == 2) ? 40*factorRatio : 0,
                                            backgroundColor: (this.state.step > 1) ? 'black' : null,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '400',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            Step 2:
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            SET A PASSWORD
                                        </Text>
                                    </View>
                        </View>
                                <View key={'step3'}
                                    style={{
                                        flex: 1,
                                        borderTopRightRadius: (this.state.step == 3) ? 40*factorRatio : 0,
                                        borderBottomRightRadius: (this.state.step == 3) ? 40*factorRatio : 0,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                            borderTopRightRadius: (this.state.step == 3) ? 40*factorRatio : 0,
                                            borderBottomRightRadius: (this.state.step == 3) ? 40*factorRatio : 0,
                                            backgroundColor: (this.state.step > 2) ? 'black' : null,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '400',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            Step 3:
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                color: 'white',
                                            }}    
                                        >
                                            CHOOSE A PLAN
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>                    
                        )}
                        <View key={'buff2'}
                            style={{height: fullHeight*0.025}}
                        />
                        <View key={'words'}
                            style={{
                                height: fullHeight*0.15,
                                width: fullWidth,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14*factorRatio,
                                    color: 'white',
                                }}
                            >
                                <AntIcon 
                                    name={'check'}
                                    size={15*factorRatio}
                                    color={'white'}
                                /> Pay nothing for 7 days.
                            </Text>
                            <View style={{height: 7.5*factorRatio}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'center',
                                    fontSize: 14*factorRatio,
                                    color: 'white',
                                }}
                            >
                                <AntIcon 
                                    name={'check'}
                                    size={15*factorRatio}
                                    color={'white'}
                                />{' Award-winning piano lessons & more.'}
                            </Text>
                            <View style={{height: 7.5*factorRatio}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'center',
                                    fontSize: 14*factorRatio,
                                    color: 'white',
                                }}
                            >
                                <AntIcon 
                                    name={'check'}
                                    size={15*factorRatio}
                                    color={'white'}
                                /> Access to the Pianote Experience app.
                            </Text>
                            <View style={{height: 7.5*factorRatio}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'center',
                                    fontSize: 14*factorRatio,
                                    color: 'white',
                                }}
                            >
                                <AntIcon 
                                    name={'check'}
                                    size={15*factorRatio}
                                    color={'white'}
                                /> Access to the Pianote Experience website.
                            </Text>
                            <View style={{height: 7.5*factorRatio}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'center',
                                    fontSize: 14*factorRatio,
                                    color: 'white',
                                }}
                            >
                                <AntIcon 
                                    name={'check'}
                                    size={15*factorRatio}
                                    color={'white'}
                                /> Cancel anytime through the App Store.
                            </Text>
                        </View>
                        <View key={'buff3'}
                            style={{
                                height: (this.state.newUser) ? 
                                    fullHeight*0.045 : fullHeight*0.12,
                            }}
                        />      
                        <View key={'alreadyMember'}>
                            <Text
                                onPress={() => {
                                    (this.state.newUser) ? 
                                        this.props.navigation.navigate('LOGINCREDENTIALS')
                                        : 
                                        Alert.alert('Simulated appstore')
                                }}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'grey',
                                    fontSize: 14*factorRatio,
                                    textAlign: 'center',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                {(this.state.newUser) ? 
                                    'Already A Member? Log In.' : 'Restore purchases'
                                }
                            </Text>
                            <View style={{height: 2*factorVertical}}/>
                            {this.state.newUser && (
                            <Text
                                onPress={() => {
                                    this.props.navigation.navigate('TERMS')
                                }}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'grey',
                                    fontSize: 14*factorRatio,
                                    textAlign: 'center',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                Terms - Privacy
                            </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
