/**
 * Comments
*/
import React from 'react';
import { 
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class Comments extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            profileImage: '',
            comments: [],
            isLoading: true,
            outComments: false,
            isReply: false,
        }
    }


    componentDidMount = async () => {
        let profileImage = await AsyncStorage.getItem('profileURI')
        
        if(profileImage !== null) {
            await this.setState({profileImage})
        }
        
        this.fetchComments()
    }


    fetchComments = async () => {
        await this.setState({isLoading: true})
        email = await AsyncStorage.getItem('email')

        await fetch('http://127.0.0.1:5000/getComments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contentID: this.props.ID,
                email,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('comments: ', response)
                this.setState({
                    comments: [...response, ...this.state.comments],
                })
            })
            .catch((error) => {
                console.log('API Error: ', error)
            })
        
            await this.setState({isLoading: false})
    }


    showFooter() {
        if(this.state.outComments == false) {
            return (
                <View
                    style={[
                        styles.centerContent, {
                        marginTop: 15*factorRatio,
                        height: 35*factorVertical
                    }]}
                >
                    <ActivityIndicator
                        size={(isTablet) ? 'large' : 'small'}
                        color={'grey'}
                    />
                </View>
            )
        } else {
            return (
                <View style={{height:20*factorVertical}}/>
            )
        }
    }


    like = async (index) => {
        if(this.state.comments[index][8] == 0) {
            this.state.comments[index][8] = 1
            this.state.comments[index][6] = this.state.comments[index][6] + 1
            await fetch('http://127.0.0.1:5000/likeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.comments[index][9],
                    email,
                })
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('liked : ', response)
                })
                .catch((error) => {
                    console.log('API Error: ', error)
                })
        } else {
            this.state.comments[index][8] = 0
            this.state.comments[index][6] = this.state.comments[index][6] - 1
            await fetch('http://127.0.0.1:5000/unlikeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.comments[index][9],
                    email,
                })
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('unliked : ', response)
                })
                .catch((error) => {
                    console.log('API Error: ', error)
                })
        }

        await this.setState({
            comments: this.state.comments,
        })
    }


    mapComments() {
        return this.state.comments.map((row, index) => {
            return (
                <View 
                    style={{
                        backgroundColor: colors.mainBackground,
                        paddingTop: fullHeight*0.025,
                        paddingBottom: fullHeight*0.02,
                        paddingLeft: fullWidth*0.05,
                        paddingRight: fullWidth*0.03,
                        minHeight: 40*factorVertical,
                        borderTopColor: colors.secondBackground,
                        borderTopWidth: 0.25,
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <FastImage
                                style={{
                                    height: 40*factorHorizontal,
                                    width: 40*factorHorizontal,
                                    borderRadius: 100,
                                }}
                                source={{uri: row[7]}}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 10*factorRatio,
                                    marginTop: 2*factorRatio,
                                    fontWeight: 'bold',
                                    color: 'grey',
                                }}
                            >
                                {this.changeXP(row[4])}
                            </Text>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                    <View 
                        style={{
                            flex: 1,
                            paddingLeft: 12.5*factorHorizontal,
                        }}
                    >
                        <View style={{height: 3*factorVertical}}/>
                        <Text 
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13*factorRatio,
                                color: 'white',
                            }}
                        >
                            {row[0]}
                        </Text>
                        <View style={{height: 7.5*factorVertical}}/>
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 12*factorRatio,
                                color: colors.secondBackground,
                            }}
                        >
                            {row[1]} | {row[2]} | {row[3]}
                        </Text>
                        <View
                            style={{
                                paddingTop: 15*factorVertical,
                                paddingBottom: 15*factorVertical,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            this.like(index)
                                        }}
                                    >
                                        <AntIcon
                                            name={(row[8]) ? 'like1' : 'like2'}
                                            size={20*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                    <View style={{width: 10*factorHorizontal}}/>
                                    {(row[6] > 0) && (
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <View 
                                            style={[
                                                styles.centerContent, {
                                                borderRadius: 40,
                                                paddingLeft: 8*factorHorizontal,
                                                paddingRight: 8*factorHorizontal,
                                                paddingTop: 4*factorVertical,
                                                paddingBottom: 4*factorVertical,
                                                backgroundColor: colors.notificationColor,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 10*factorRatio,
                                                    color: colors.pianoteRed,
                                                }}
                                            >
                                                {row[6]} LIKES
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>                                
                                    )}
                                </View>
                                <View style={{width: 20*factorHorizontal}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        onPress={() => {}}
                                        style={{
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'comment-text-outline'}
                                            size={20*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                    <View style={{width: 10*factorHorizontal}}/>
                                    {(row[5] > 0) && (
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <View 
                                            style={[
                                                styles.centerContent, {
                                                borderRadius: 40,
                                                paddingLeft: 8*factorHorizontal,
                                                paddingRight: 8*factorHorizontal,
                                                paddingTop: 4*factorVertical,
                                                paddingBottom: 4*factorVertical,
                                                backgroundColor: colors.notificationColor,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 10*factorRatio,
                                                    color: colors.pianoteRed,
                                                }}
                                            >
                                                {row[5]} REPLIES
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    )}
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        {(row[5] !== 0) && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.showReplies()
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 12*factorRatio,
                                    color: colors.secondBackground,
                                }}
                            >
                                VIEW {row[5]} REPLIES
                            </Text>
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
            )
        })
    }


    changeXP = (num) => {
        if(num !== '') {
            num = Number(num)
            if(num < 10000) {
                num = num.toString()
                return num
            } else {
                num = (num/1000).toFixed(1).toString()
                num = num + 'k'
                return num
            }
        }
    }


    render = () => {
        return (
            <View key={'componentContainer'}
                style={[
                    styles.centerContent, {
                    minHeight: fullHeight*0.4,
                    width: fullWidth,
                    zIndex: 10,
                }]}
            >
                {!this.state.isLoading && (
                <View style={{flex: 1}}>
                    <View
                        style={{
                            width: fullWidth,
                            backgroundColor: colors.mainBackground,
                            zIndex: 5,
                        }}
                    >
                        <View style={{height: fullHeight*0.025}}/>
                        <View key={'commentHeader'}
                            style={{
                                width: fullWidth,
                                flexDirection: 'row',
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.02,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    {(this.state.isReply) ? 'REPLIES' : this.state.comments.length.toString() + ' COMMENTS'}
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                            {this.state.isReply && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.hideReplies()
                                }}
                            >
                                <EntypoIcon
                                    size={27.5*factorRatio}
                                    name={'cross'}
                                    color={'#c2c2c2'}
                                />
                            </TouchableOpacity>
                            )}
                            {!this.state.isReply && (
                            <TouchableOpacity 
                                onPress={() => {

                                }}
                            >
                                <FontIcon
                                    size={16*factorRatio}
                                    name={'sort-amount-down'}
                                    color={colors.pianoteRed}
                                />
                            </TouchableOpacity>
                            )}
                            <View style={{flex: 0.1}}/>
                        </View>
                        <View style={{flex: 1.25}}/>
                        {this.state.isReply && (
                        <View key={'originalReply'}
                            style={{
                                backgroundColor: colors.mainBackground,
                                paddingTop: fullHeight*0.025,
                                paddingBottom: fullHeight*0.02,
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.03,
                                minHeight: 40*factorVertical,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{alignItems: 'center'}}>
                                    <FastImage
                                        style={{
                                            height: 40*factorHorizontal,
                                            width: 40*factorHorizontal,
                                            borderRadius: 100,
                                        }}
                                        source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 10*factorRatio,
                                            marginTop: 2*factorRatio,
                                            fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                            color: 'grey',
                                        }}
                                    >
                                        'Hello'
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingLeft: 12.5*factorHorizontal,
                                }}
                            >
                                <View style={{height: 3*factorVertical}}/>
                                <Text 
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 13*factorRatio,
                                    }}
                                >
                                    Lorem ipsum dolor sit smart cosaf adiffdsf eli, prascent quie eros magnia. Etrian tincidunt
                                </Text>
                                <View style={{height: 7.5*factorVertical}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 11*factorRatio,
                                        color: 'grey',
                                    }}
                                >
                                    user | rank | time
                                </Text>
                                <View style={{height: 50*factorVertical}}>
                                    <View style={{flex: 1}}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity onPress={() => {}}>
                                                <AntIcon
                                                    name={'like2'}
                                                    size={20*factorRatio}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <View style={{width: 10*factorHorizontal}}/>
                                            <View>
                                                <View style={{flex: 1}}/>
                                                <View 
                                                    style={[
                                                        styles.centerContent, {
                                                        borderRadius: 40,
                                                        paddingLeft: 8*factorHorizontal,
                                                        paddingRight: 8*factorHorizontal,
                                                        paddingTop: 4*factorVertical,
                                                        paddingBottom: 4*factorVertical,
                                                        backgroundColor: '#ececec',
                                                    }]}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 9.5*factorRatio,
                                                            color: 'dimgrey',
                                                        }}
                                                    >
                                                        4 LIKES
                                                    </Text>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                        <View style={{width: 20*factorHorizontal}}/>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity onPress={() => {}}>
                                                <MaterialIcon
                                                    name={'comment-text-outline'}
                                                    size={20*factorRatio}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <View style={{width: 10*factorHorizontal}}/>
                                            <View>
                                                <View style={{flex: 1}}/>
                                                <View 
                                                    style={[
                                                        styles.centerContent, {
                                                        borderRadius: 40,
                                                        paddingLeft: 8*factorHorizontal,
                                                        paddingRight: 8*factorHorizontal,
                                                        paddingTop: 4*factorVertical,
                                                        paddingBottom: 4*factorVertical,
                                                        backgroundColor: '#ececec',
                                                    }]}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 9.5*factorRatio,
                                                            color: 'dimgrey',
                                                        }}
                                                    >
                                                        REPLIES
                                                    </Text>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <TouchableOpacity onPress={() => {}}>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 11.5*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        VIEW REPLIES
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )}
                        <TouchableOpacity key={'addComment'}
                            onPress={() => this.props.showMakeComment()}
                            style={{
                                width: fullWidth,
                                height: fullHeight*0.1,
                                flexDirection: 'row',
                                paddingLeft: fullWidth*0.05,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {}}
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <View key={'yourImage'}
                                    style={{
                                        height: '100%',
                                        width: 40*factorHorizontal,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <FastImage
                                        style={{
                                            height: 40*factorHorizontal,
                                            width: 40*factorHorizontal,
                                            borderRadius: 100,
                                        }}
                                        source={{uri: this.state.profileImage}}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'addComment'}
                                    style={{
                                        height: '100%',
                                        width: fullWidth*0.95 - 40*factorHorizontal,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 13*factorRatio,
                                            color: 'white',
                                            paddingLeft: 10*factorHorizontal,
                                        }}
                                    >
                                        Add a comment...
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                    </View>
                    {this.mapComments()}
                </View>
                )}
                <View style={{height: fullHeight*0.035}}/>
            </View>
        )
    }
}

export default withNavigation(Comments);