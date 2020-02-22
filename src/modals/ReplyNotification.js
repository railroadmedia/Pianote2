/**
 * ReplyNotification
 */
import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

class ReplyNotification extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            rankProgress: 62.5,
            XP: '11,768',
            rank: 'MASTERO',
            user: 'Jordan Leibel',
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
                    style={{flex: 1}}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hideReplyNotification()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >

                    </TouchableOpacity>
                </View>
                <View key={'content'}
                    style={{
                        height: '35%',
                        width: '100%',
                        flexDirection: 'row',
                    }}
                >
                    <View key={'content'}
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'white',
                        }}
                    >
                        <View style={{height: '2%'}}/>
                        <View key={'profile'}
                            style={{
                                flexDirection: 'row',
                                height: '30%',
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View>
                                <View style={{flex: 1}}/>
                                <View 
                                    style={{
                                        height: fullWidth*0.165*factorRatio,
                                        width: fullWidth*0.165*factorRatio,
                                        borderRadius: 100*factorRatio,
                                        backgroundColor: 'cyan',
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            position: 'absolute',
                                            bottom: '0%',
                                            right: '0%',
                                            width: fullWidth*0.065,
                                            height: fullWidth*0.065,
                                            borderRadius: 100,
                                            backgroundColor: '#ff651e',
                                            zIndex: 3,
                                        }]}
                                    >
                                        <Chat
                                            height={fullWidth*0.0425}
                                            width={fullWidth*0.0425}
                                            fill={'white'}
                                        />
                                    </View>
                                    <FastImage
                                        style={{flex: 1, borderRadius: 100*factorRatio}}
                                        source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{height: 7.5*factorVertical}}/>
                        <Text key={'replyUser'}
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 14*factorRatio,
                                textAlign: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 15*factorRatio,
                                    fontWeight: '600',
                                    textAlign: 'center',
                                }}
                            >
                                {this.state.user}
                            </Text>
                            {' '}replied to your comment
                        </Text>
                        <View style={{flex: 1}}/>
                        <View key={'remove'}
                            style={{
                                height: '18.5%',
                                width: '100%',
                                borderTopWidth: 1*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View 
                                    style={{
                                        flexDirection: 'row', 
                                        alignItems: 'center',
                                        paddingLeft: fullWidth*0.035,
                                    }}
                                >
                                    <EntypoIcon
                                        name={'cross'}
                                        size={26*factorRatio}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 17*factorRatio,
                                        }}    
                                    >
                                        Remove this notification
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                        </View>
                        <View key={'mute'}
                            style={{
                                height: '18.5%',
                                width: '100%',
                                borderTopWidth: 1*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View 
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingLeft: fullWidth*0.035,
                                    }}
                                >
                                    <IonIcon
                                        name={'ios-notifications-outline'}
                                        size={26*factorRatio}
                                    />
                                    <View style={{width: 5*factorRatio}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 17*factorRatio,
                                        }}    
                                    >
                                        Turn off comment reply notifications
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: '10%'}}/>
                    </View>
                </View>            
            </View>
        )
    }
}

export default withNavigation(ReplyNotification);