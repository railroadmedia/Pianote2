/**
 * ChangeEmail
 */
import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class ChangeEmail extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            password: '', 
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
                        height: '8%',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hideChangeEmail()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >

                    </TouchableOpacity>
                </View>
                <View key={'content'}
                    style={{
                        height: '42%',
                        width: '100%',
                        flexDirection: 'row',
                    }}
                >
                    <View key={'buffLeft'}
                        style={{width: '7%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hideChangeEmail()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                    </View>
                    <View  key={'content'}
                        style={{
                            height: '100%',
                            width: '86%',
                            backgroundColor: '#f7f7f7',
                            paddingLeft: fullWidth*0.05,
                            paddingRight: fullWidth*0.05,
                            borderRadius: 15*factorRatio,
                        }}
                    >
                        <View style={{flex: 0.13}}/>
                        <Text key={'emailTaken'}
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 21*factorRatio,
                                fontWeight: '600',
                                textAlign: 'center',
                            }}
                        >
                            Confirm change of email.
                        </Text>
                        <View style={{flex: 0.075}}/>
                        <View key={'enterPassword'}>
                            <View style={{flex: 1}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 15*factorRatio,
                                    fontWeight: '300',
                                    textAlign: 'center',
                                }}
                            >
                                Enter your account password to confirm the change of email address.
                            </Text>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{flex: 0.075}}/>
                        <View key={'buttons'}
                            style={{flex: 0.8}}
                        >
                            <View style={{height: '100%'}}>
                            <View key={'passwords'}
                                    style={[
                                        styles.centerContent, {
                                        height: '30%',
                                    }]}
                                >
                                    <View
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 100*factorRatio,
                                            backgroundColor: '#ececec',
                                        }}
                                    >
                                        <TextInput
                                            ref={(txt) => { this.txt = txt }}
                                            placeholder={'Enter your password...'}
                                            value={this.state.password}
                                            secureTextEntry={true}
                                            placeholderTextColor={'#9b9b9b'}
                                            onChangeText={(password) => this.setState({password})}
                                            onSubmitEditing={() => {}}
                                            returnKeyType={'go'}
                                            style={{
                                                fontFamily: 'Roboto',
                                                height: fullHeight*0.06,
                                                paddingLeft: fullWidth*0.075,
                                                width: fullWidth,
                                                justifyContent: 'center',
                                                fontSize: 15*factorRatio,
                                                borderBottomColor: '#ececec',
                                                borderBottomWidth: 1.5*factorRatio,
                                            }}
                                        />
                                    </View>
                                </View>
                               <View key={'confirmEmail'}
                                    style={[
                                        styles.centerContent, {
                                        height: '30%',
                                    }]}
                                >
                                    <View
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 100*factorRatio,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {}}
                                            style={{
                                                height: '100%',
                                                width: '100%'
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 15*factorRatio,
                                                    fontWeight: '700',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                CONFIRM EMAIL CHANGE
                                            </Text>
                                            <View style={{flex: 1}}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    onPress={() => {
                                        this.props.hideChangeEmail()
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '35%',
                                        width: '100%',
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.hideChangeEmail()
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 15*factorRatio,
                                                fontWeight: '700',
                                                color: 'grey',
                                                textAlign: 'center',
                                            }}
                                        >
                                            CANCEL
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View key={'buffRight'}
                        style={{width: '7%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hideChangeEmail()}
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
                        onPress={() => this.props.hideChangeEmail()}
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

export default withNavigation(ChangeEmail);