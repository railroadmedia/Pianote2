/**
 * NotificationSettings
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import CustomSwitch from 'Pianote2/src/components/CustomSwitch.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class NotificationSettings extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.imageIURL = require('Pianote2/src/assets/img/imgs/lisa-foundations.png')
        this.state = {
            weeklyCommunityUpdatesClicked: true,
            commentRepliesClicked: false, 
            commentLikesClicked: true,
            forumPostRepliesClicked: false,
            forumPostLikesClicked: true,
            frequency: 'Immediate',
        }
    }


    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: (isNotch) ? 15*factorVertical : 0,
                            }}
                        >
                        </View>
                        <View key={'header'}
                            style={[
                                styles.centerContent, {
                                flex: 0.1,
                            }]}
                        >
                            <View key={'goback'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 0, 
                                    bottom: 0*factorRatio,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        (this.state.currentlyView == 'Profile Settings') ? 
                                            this.props.navigation.goBack() 
                                            :
                                            this.setState({currentlyView: 'Profile Settings'})
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.66}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '600',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                Notification Settings
                            </Text>
                            <View style={{flex: 0.33}}/>
                        </View>
                        <View style={{flex: 0.95}}>
                            <View key={'notifcationTypes'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        fontWeight: '600',
                                    }}
                                >
                                    Notification Types
                                </Text>
                            </View>
                            <View key={'weeklyCommunityUpdates'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                    
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Weekly community updates
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <CustomSwitch
                                        isClicked={this.state.weeklyCommunityUpdatesClicked}
                                        clicked={(bool) => this.setState({ 
                                            weeklyCommunityUpdatesClicked: bool,
                                        })}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'commentReplies'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Comment replies
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <CustomSwitch
                                        isClicked={this.state.commentRepliesClicked}
                                        clicked={() => this.setState({ 
                                            commentRepliesClicked: this.state.commentRepliesClicked,
                                        })}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'commentLikes'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Comment likes
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <CustomSwitch
                                        isClicked={this.state.commentLikesClicked}
                                        clicked={() => this.setState({ 
                                            commentLikesClicked: this.state.commentLikesClicked,
                                        })}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'forumPostReplies'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Forum post replies
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <CustomSwitch
                                        isClicked={this.state.forumPostRepliesClicked}
                                        clicked={() => this.setState({ 
                                            forumPostRepliesClicked: this.state.forumPostRepliesClicked,
                                        })}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'forumPostLikes'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Forum post likes
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <CustomSwitch
                                        isClicked={this.state.forumPostLikesClicked}
                                        clicked={() => this.setState({ 
                                            forumPostLikesClicked: this.state.forumPostLikesClicked,
                                        })}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'border'}
                                style={{
                                    height: 25*factorVertical,
                                    borderBottomColor: '#ececec',
                                    borderBottomWidth: 1*factorRatio,
                                }}
                            />
                            <View style={{height: 15*factorVertical}}/>
                            <View key={'emailNotificationFrequency'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        fontWeight: '600',
                                    }}
                                >
                                    Email Notification Frequency
                                </Text>
                            </View>
                            <View key={'immediate'}
                                style={{
                                    height: fullHeight*0.065,
                                    paddingLeft: fullWidth*0.045,
                                    paddingRight: fullWidth*0.045,
                                    width: fullWidth,
                                    justifyContent: 'center',
                                    fontSize: 18*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16*factorRatio,
                                            }}
                                        >
                                            Immediate
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            height: fullHeight*0.0375,
                                            width: fullHeight*0.0375,
                                            backgroundColor: (this.state.frequency == 'Immediate') ?
                                                '#fb1b2f' : '#C5CDCD',
                                            borderRadius: 100,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({frequency: 'Immediate'})}
                                            style={[
                                                styles.centerContent, {
                                                height: '100%',
                                                width: '100%',
                                            }]}
                                        >
                                            {(this.state.frequency == 'Immediate') && (
                                            <FontIcon
                                                name={'check'}
                                                size={20*factorRatio}
                                                color={'white'}
                                            />
                                            
                                            )}
                                            {(this.state.frequency !== 'Immediate') && (
                                            <EntypoIcon
                                                name={'cross'}
                                                size={22.5*factorRatio}
                                                color={'white'}
                                            />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'OncePerDay'}
                                    style={{
                                        height: fullHeight*0.065,
                                        paddingLeft: fullWidth*0.045,
                                        paddingRight: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}}/>
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 16*factorRatio,
                                                }}
                                            >
                                                Once per day
                                            </Text>
                                            <View style={{flex: 1}}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <View
                                            style={[
                                                styles.centerContent, {
                                                height: fullHeight*0.0375,
                                                width: fullHeight*0.0375,
                                                backgroundColor: (this.state.frequency == 'OncePerDay') ?
                                                    '#fb1b2f' : '#C5CDCD',
                                                borderRadius: 100,
                                            }]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => this.setState({frequency: 'OncePerDay'})}
                                                style={[
                                                    styles.centerContent, {
                                                    height: '100%',
                                                    width: '100%',
                                                }]}
                                            >
                                                {(this.state.frequency == 'OncePerDay') && (
                                                <FontIcon
                                                    name={'check'}
                                                    size={20*factorRatio}
                                                    color={'white'}
                                                />
                                                
                                                )}
                                                {(this.state.frequency !== 'OncePerDay') && (
                                                <EntypoIcon
                                                    name={'cross'}
                                                    size={22.5*factorRatio}
                                                    color={'white'}
                                                />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                            <View key={'never'}
                                        style={{
                                            height: fullHeight*0.065,
                                            paddingLeft: fullWidth*0.045,
                                            paddingRight: fullWidth*0.045,
                                            width: fullWidth,
                                            justifyContent: 'center',
                                            fontSize: 18*factorRatio,
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <View style={{flexDirection: 'row'}}>
                                            <View>
                                                <View style={{flex: 1}}/>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        fontSize: 16*factorRatio,
                                                    }}
                                                >
                                                    Never
                                                </Text>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    height: fullHeight*0.0375,
                                                    width: fullHeight*0.0375,
                                                    backgroundColor: (this.state.frequency == 'Never') ?
                                                        '#fb1b2f' : '#C5CDCD',
                                                    borderRadius: 100,
                                                }]}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => this.setState({frequency: 'Never'})}
                                                    style={[
                                                        styles.centerContent, {
                                                        height: '100%',
                                                        width: '100%',
                                                    }]}
                                                >
                                                    {(this.state.frequency == 'Never') && (
                                                    <FontIcon
                                                        name={'check'}
                                                        size={20*factorRatio}
                                                        color={'white'}
                                                    />
                                                    
                                                    )}
                                                    {(this.state.frequency !== 'Never') && (
                                                    <EntypoIcon
                                                        name={'cross'}
                                                        size={22.5*factorRatio}
                                                        color={'white'}
                                                    />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                        </View>
                    </View>
                    <NavigationBar
                        currentPage={'PROFILE'}
                    />
                </View>
            </View>
        )
    }
}