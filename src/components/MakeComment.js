/** 
 * MakeComment
*/
import React from 'react';
import { 
    View,
    KeyboardAvoidingView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

class MakeComment extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
        }
    }

    componentDidMount() {
        setTimeout(() => { this.textInputRef.focus() }, 100)
    }
    

    render = () => {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={0} 
                style={{
                    height: '100%',
                    width: '100%',
                }}
                behavior={'padding'}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.textInputRef.blur(),
                        this.props.hideMakeComment()
                    }}
                    style={{
                        height: '72.5%',
                        width: '100%',
                        alignSelf: 'stretch',
                    }}
                />
                <View
                    style={{
                        height: '27.5%',
                        width: '100%',
                        alignSelf: 'stretch',
                    }}
                >
                    <View style={{flex: 0.1, backgroundColor: 'white'}}/>
                    <View style={{flex: 0.8, flexDirection: 'row'}}>
                        <View 
                            style={[
                                styles.centerContent, {
                                flex: 1,
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: '#ececec',
                                backgroundColor: 'white',
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <View
                                style={{
                                    width: fullWidth*0.125,
                                    height: fullWidth*0.125,
                                    backgroundColor: 'blue',
                                    borderRadius: 100,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        alignSelf: 'stretch',
                                        borderRadius: 100,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                        </View>
                        <TextInput
                            multiline={true}
                            ref={ref => { this.textInputRef = ref }}
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 14*factorRatio,
                                height: '100%',
                                width: '60%',
                                paddingTop: 10*factorVertical,
                                backgroundColor: 'white',
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                            onSubmitEditing={() => {
                                this.props.hideMakeComment()
                            }}
                            returnKeyType={'go'}
                            onChangeText={(comment) => {
                                this.setState({comment})
                            }}
                            placeholder={'Add a comment'}
                            placeholderTextColor={'grey'}
                        />
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View 
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.hideMakeComment()
                                    }}
                                >
                                    <IonIcon
                                        name={'md-send'}
                                        size={25*factorRatio}
                                        color={'#0a84ff'}
                                    />
                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 0.1, backgroundColor: 'white'}}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

export default withNavigation(MakeComment);