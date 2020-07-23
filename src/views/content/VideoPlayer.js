/**
 * VideoPlayer
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Keyboard, 
    Platform,
    ActivityIndicator,
    TextInput,
    Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import Replies from '../../components/Replies.js';
import SoundSlice from '../../components/SoundSlice.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LessonComplete from '../../modals/LessonComplete.js';
import QualitySettings from '../../modals/QualitySettings.js';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Resources from 'Pianote2/src/assets/img/svgs/resources.svg';
import VideoPlayerOptions from '../../modals/VideoPlayerOptions.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

var showListener = (Platform.OS == 'ios') ? 'keyboardWillShow' : 'keyboardDidShow'
var hideListener = (Platform.OS == 'ios') ? 'keyboardWillHide' : 'keyboardDidHide'

export default class VideoPlayer extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.data, // data about incoming video
            profileImage: '',
            isLoadingAll: true,
            showReplies: false, 
            showAssignment: false,
            showSoundSlice: false,
            showMakeComment: false,
            showInfo: false,
            showVideoPlayerOptions: false,
            showAssignmentComplete: false,
            showQualitySettings: false,
            showAssignmentComplete: false, 
            showLessonComplete: false, 
            isReply: false,
            showMakeComment: false, 
            selectedComment: null,
            
            makeCommentVertDelta: new Animated.Value(0.01),
            
            comments: [],
            commentsLoading: true,
            outComments: false,
            page: 1,

            videos: [], 
            
            likes: 34,
            isLiked: false,
            comment: '',
            commentID: null,

            assignmentList: [
                ['Learn The Fill', 1, 1],
                ['Learn The Beat', 2, 0],
                ['Put It Together', 3, 0],
            ],

            clickedAssignment: {'name': '', 'num': ''},
        }
    }


    componentDidMount = async () => {
        // get profile image
        let profileImage = await AsyncStorage.getItem('profileURI')        
        if(profileImage !== null) {
            await this.setState({profileImage})
        }

        this.keyboardDidShowListener = Keyboard.addListener(
            showListener, this._keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            hideListener, this._keyboardDidHide
        )

        this.getVideos()
        this.fetchComments()
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
  

    _keyboardDidShow = async (e) => {
        const { height, screenX, screenY, width } = e.endCoordinates
        

        if(Platform.OS == 'ios') {
            Animated.timing(
                this.state.makeCommentVertDelta, {
                    toValue: height,
                    duration: 275,
                }
            ).start()
        } else {
            Animated.timing(
                this.state.makeCommentVertDelta, {
                    toValue: height,
                    duration: 0,
                }
            ).start()
        }
    }
  

    _keyboardDidHide = async () => {
        Animated.timing(
            this.state.makeCommentVertDelta, {
                toValue: -250,
                duration: 275,
            }
        ).start()
    }


    getVideos = async () => {
        const { response, error } = await getContent({
            brand:'pianote',
            limit: '15',
            page: this.state.page,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['song'],
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        items = []
        for(i in newContent) {
            if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0].value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                    xp: newContent[i].post.xp,
                    id: newContent[i].id,
                    like_count: newContent[i].post.like_count,
                    duration: this.getDuration(newContent[i]),
                    isLiked: newContent[i].isLiked,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                })
            }
        }

        this.setState({
            videos: [...this.state.videos, ...items],
            isLoadingAll: false,
        })
    }


    getDuration = (newContent) => {
        var data = 0
        try {
            for(i in newContent.post.current_lesson.fields) {
                if(newContent.post.current_lesson.fields[i].key == 'video') {
                    var data = newContent.post.current_lesson.fields[i].value.fields
                    for(var i=0; i < data.length; i++) {
                        if(data[i].key == 'length_in_seconds') {
                            return data[i].value
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)    
        }
    }


    fetchComments = async () => {
        await this.setState({commentsLoading: true})

        email = await AsyncStorage.getItem('email')

        await fetch('http://127.0.0.1:5000/getComments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contentID: this.state.data.id,
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

        await this.setState({commentsLoading: false})
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


    likeComment = async (index) => {
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


    makeComment = async () => {
        // reply to main video
        console.log('comment on video: ', this.state.data.id)
        this.setState({comment: ''})
        this.textInputRef.blur()
    }


    makeReply = async () => {
        // reply to comment
        console.log('reply to commentID: ', this.state.commentID)
        this.setState({
            comment: '',
            commentID: null,
        })
        this.textInputRef.blur()
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
                                            this.likeComment(index)
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
                                        onPress={() => {
                                            this.setState({
                                                showMakeComment: true,
                                                commentID: row[9]
                                            }),
                                            setTimeout(() => this.textInputRef.focus(), 100)
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
                                this.setState({
                                    showReplies: true,
                                    selectedComment: row,
                                })
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


    renderAssignments() {
        return this.state.assignmentList.map((row, index) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                    //    this.props.navigation.navigate('VIDEOPLAYERSONG', {
                      //      assignmentName: row[0], 
                        //    assignmentNum: index+1,
                          //  showAssignment: true,
                        //})
                    }}
                    style={{
                        height: 55*factorVertical,
                        paddingLeft: fullWidth*0.035,
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View style={{flex: 1}}/>
                        <Text
                            style={{
                                fontSize: 18*factorRatio,
                                color: colors.secondBackground,
                                fontFamily: 'RobotoCondensed-Bold',
                            }}
                        >
                            {index+1}. {row[0]}
                        </Text>
                        <View style={{flex: 1}}/>
                    </View>
                    <View style={{flex: 1}}/>
                    <View 
                        style={[
                            styles.centerContent, {
                            height: '100%',
                            width: 40*factorHorizontal,
                            flexDirection: 'row',
                        }]}
                    >
                        {(row[2] == 1) && (
                        <View style={styles.centerContent}>
                            <View
                                style={[
                                    styles.centerContent, {
                                    height: 22.5*factorRatio,
                                    width: 22.5*factorRatio,
                                    borderRadius: 100,
                                    backgroundColor: '#fb1b2f'
                                }]}
                            >
                                <EntypoIcon
                                    name={'check'}
                                    size={17.5*factorRatio}
                                    color={colors.mainBackground}
                                />
                            </View>
                        </View>
                        )}
                        {(row[2] == 0) && (
                        <View style={[styles.centerContent, {flexDirection: 'row'}]}>
                            <View style={{flex: 0.25}}/>
                            <EntypoIcon
                                name={'chevron-thin-right'}
                                size={20*factorRatio}
                                color={colors.secondBackground}
                            />
                            <View style={{flex: 1}}/>
                        </View>
                        )}
                    </View>
                </TouchableOpacity>
            )
        })
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container2'}
                    style={{
                        height: fullHeight, 
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                    <View key={'video'}
                        style={{
                            height: (onTablet) ? fullHeight*0.375 : fullHeight*0.275,
                            backgroundColor: colors.mainBackground
                        }}
                    >
                        <FastImage
                            style={{flex: 1}}
                            source={{uri: this.state.data.thumbnail}}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    </View>
                    <View key={'belowVideo'}
                        style={{flex: 1}}
                    >
                        <KeyboardAwareScrollView
                            innerRef={ref => {
                                this.scroll = ref
                            }}
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{flex: 1, backgroundColor: colors.mainBackground}}
                        >
                            <View style={{height: 2.5*factorVertical}}/>
                            <View key={'lessonTitle'}>
                                <View style={{height: fullHeight*0.015}}/>
                                <Text
                                    style={{
                                        fontSize: 20*factorRatio,
                                        fontWeight: 'bold',
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    {this.state.data.title}
                                </Text>
                                <View style={{height: fullHeight*0.01}}/>
                                <Text
                                    style={{
                                        fontSize: 12*factorRatio,
                                        fontWeight: '400',
                                        color: 'grey',
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    {this.state.data.artist} | LESSON 7 | {this.state.data.xp} XP
                                </Text>
                                <View style={{height: fullHeight*0.015}}/>
                            </View>
                            <View key={'icons'}
                                style={{
                                    paddingLeft: fullWidth*0.015,
                                    paddingRight: fullWidth*0.015,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View key={'icon'}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                    }}
                                >
                                    <TouchableOpacity key={'like'}
                                        onPress={() => {
                                            this.setState({
                                                isLiked: !this.state.isLiked,
                                                likes: (this.state.isLiked) ? this.state.likes - 1 : this.state.likes + 1
                                            })
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={(this.state.isLiked) ? 'like1' : 'like2'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.likes}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={'list'}
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={'plus'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={'resource'}
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Resources
                                            height={27.5*factorRatio}
                                            width={27.5*factorRatio}
                                            fill={colors.pianoteRed}
                                        />
                                        <View style={{height: 7.5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Resources
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={'download'}
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Download
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={'info'}
                                        onPress={() => {
                                            this.setState({
                                                showInfo: !this.state.showInfo,
                                            })
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={(this.state.showInfo) ? 'infocirlce' : 'infocirlceo'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Info
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'infoExpanded'}>
                                {this.state.showInfo && (
                                <View>
                                    <View style={{height: fullHeight*0.03}}/>
                                    <Text
                                        style={{
                                            paddingLeft: '5%',
                                            paddingRight: '5%',
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 14*factorRatio,
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.data.description}
                                    </Text>
                                </View>
                                )}
                            </View>
                            <View key={'buffer'}
                                style={{height: (this.state.data.type == 'course') ? 
                                    20*factorVertical : 10*factorVertical
                                }}
                            />
                            {this.state.data.type == 'course' && (
                            <View key={'assingmentsHeader'}
                                style={{paddingLeft: fullWidth*0.035}}
                            >
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    ASSIGNMENTS
                                </Text>
                                <View style={{height: 20*factorVertical}}/>
                            </View>
                            )}
                            {this.state.data.type == 'course' && (
                            <View key={'assignments'}
                                style={{
                                    width: fullWidth,
                                    borderTopColor: colors.secondBackground,
                                    borderTopWidth: 1,
                                }}
                            >
                                {this.renderAssignments()}   
                            </View>
                            )}
                            <View style={{height: 20*factorVertical}}/>
                            <View key={'videoList'}
                                style={{
                                    minHeight: fullHeight*0.5
                                }}
                            >
                            <VerticalVideoList
                                title={this.state.data.type == 'course' ? 'COURSE LESSONS' : 'MORE SONGS'}
                                items={this.state.videos}
                                type={'LESSONS'}
                                isLoading={this.state.isLoadingAll}
                                showTitleOnly={true}
                                showFilter={true}
                                showType={false}
                                showArtist={false}
                                showSort={false}
                                showLength={true}

                                imageRadius={5*factorRatio}
                                containerBorderWidth={0}
                                containerWidth={fullWidth}
                                containerHeight={(this.state.data.type == 'course') ? ((onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.0925) : fullWidth*0.22}
                                imageHeight={(this.state.data.type == 'course') ? ((onTablet) ? fullHeight*0.12 : ((Platform.OS == 'android') ? fullHeight*0.09 : fullHeight*0.08)): fullWidth*0.175}
                                imageWidth={(this.state.data.type == 'course') ? fullWidth*0.26 : fullWidth*0.175}
                                navigator={(row) => this.props.navigation.navigate('VIDEOPLAYER', {data: row})}
                            />
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'commentList'}
                                style={{
                                    minHeight: fullHeight*0.4
                                }}
                            >
                            {!this.state.commentsLoading && (
                            <View key={'commentContainer'}
                                style={[
                                    styles.centerContent, {
                                    minHeight: fullHeight*0.4,
                                    width: fullWidth,
                                    zIndex: 10,
                                }]}
                            >
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
                                                paddingRight: fullWidth*0.01,
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
                                                style={{
                                                    marginLeft: factorHorizontal*10,
                                                }}
                                                onPress={() => {

                                                }}
                                            >
                                                <FontIcon
                                                    size={20*factorRatio}
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
                                                            <TouchableOpacity 
                                                                onPress={() => {
                                                                    this.likeComment()
                                                                }}
                                                            >
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
                                        <View key={'addComment'}
                                            style={{
                                                width: fullWidth,
                                                height: fullHeight*0.1,
                                                flexDirection: 'row',
                                                paddingLeft: fullWidth*0.05,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({showMakeComment: true}),
                                                    setTimeout(() => this.textInputRef.focus(), 100)
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View key={'profileImage'}
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
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    {this.mapComments()}
                                </View>
                                <View style={{height: fullHeight*0.035}}/>
                            </View>
                            )}
                            </View>
                            <View style={{height: (isNotch) ? 90*factorVertical : 60*factorVertical}}/>
                        </KeyboardAwareScrollView>
                    </View>

                    {this.state.showMakeComment && (
                    <Animated.View key={'makeComment'}
                        style={{
                            position: 'absolute',
                            bottom: this.state.makeCommentVertDelta,
                            left: 0,
                            minHeight: fullHeight*0.125,
                            maxHeight: fullHeight*0.175,
                            width: fullWidth,
                            backgroundColor: colors.mainBackground,
                            flexDirection: 'row',
                        }}
                    >
                        <View 
                            style={{
                                flex: 1,
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: colors.secondBackground,
                            }}
                        />
                        <View
                            stlye={{
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: colors.secondBackground,
                            }}
                        >
                            <View 
                                style={{
                                    height: 10*factorVertical,
                                    borderTopWidth: 0.5*factorRatio,
                                    borderTopColor: colors.secondBackground,
                                }}
                            />
                            <TextInput
                                multiline={true}
                                ref={ref => { this.textInputRef = ref }}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 14*factorRatio,
                                    width: fullWidth*0.6,
                                    backgroundColor: colors.mainBackground,
                                    color: colors.secondBackground,
                                }}
                                onSubmitEditing={() => {
                                    (this.state.commentID !== null) ? this.makeReply() : this.makeComment(),
                                    this.textInputRef.clear()
                                }}
                                returnKeyType={'go'}
                                onChangeText={(comment) => this.setState({comment})}
                                onBlur={() => this.textInputRef.clear()}
                                placeholder={'Add a comment'}
                                placeholderTextColor={colors.secondBackground}
                            />
                            <View style={{height: 10*factorVertical}}/>
                        </View>
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 1,
                                borderTopWidth: 0.5*factorRatio,
                                borderTopColor: colors.secondBackground,
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <TouchableOpacity
                                onPress={() => {
                                    (this.state.commentID !== null) ? this.makeReply() : this.makeComment(),
                                    this.textInputRef.clear()
                                }}
                            >
                                <IonIcon
                                    name={'md-send'}
                                    size={25*factorRatio}
                                    color={colors.pianoteRed}
                                />
                            </TouchableOpacity>
                            <View style={{flex: 0.2}}/>
                        </View>
                    </Animated.View>
                    )}
                    <View key={'completeLesson'}
                        style={[
                            styles.centerContent, {
                            position: 'absolute',
                            left: 0*factorHorizontal,
                            width: fullWidth,
                            backgroundColor: colors.mainBackground,
                            zIndex: 5,
                            bottom: 0,
                            paddingBottom: (isNotch) ? fullHeight*0.035 : fullHeight*0.015,
                        }]}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View 
                                style={{
                                    width: fullWidth*0.7,
                                    height: 2*factorRatio,
                                    backgroundColor: colors.pianoteRed,
                                }}
                            />
                            <View style={{flex: 1}}/>
                        </View>
                        <View 
                            style={{
                                width: fullWidth,
                                height: 15*factorVertical
                            }}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <View key={'last'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.2, 
                                    alignSelf: 'stretch',
                                                                
                                }]}
                            >
                                <View
                                    style={{
                                        height: fullWidth*0.1,
                                        width: fullWidth*0.1,
                                        borderRadius: 100,
                                        borderWidth: 2*factorRatio,
                                        borderColor: colors.secondBackground,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent, {
                                            height: '100%',
                                            width: '100%',
                                        }]}
                                    >
                                        <EntypoIcon
                                            name={'chevron-thin-left'}
                                            size={22.5*factorRatio}
                                            color={colors.secondBackground}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View key={'complete'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.6, 
                                    alignSelf: 'stretch',
                                }]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.centerContent, {
                                        height: fullWidth*0.1,
                                        width: fullWidth*0.6,
                                        borderRadius: 100,
                                        backgroundColor: colors.pianoteRed,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            fontSize: 14*factorRatio,
                                        }}
                                    >
                                        COMPLETE {this.state.data == 'course' ? 'COURSE':'SONG'} 
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View key={'next'}
                            style={[
                                styles.centerContent, {
                                flex: 0.2, 
                                alignSelf: 'stretch',
                                                              
                            }]}
                        >
                            <View
                                style={{
                                    height: fullWidth*0.1,
                                    width: fullWidth*0.1,
                                    borderRadius: 100,
                                    borderWidth: 2*factorRatio,
                                    borderColor: colors.pianoteRed,
                                }}
                            >
                                <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent, {
                                            height: '100%',
                                            width: '100%',
                                        }]}
                                    >
                                        <EntypoIcon
                                            name={'chevron-thin-right'}
                                            size={22.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                    </View>             
                    <View key={'goBackIcon'}
                        style={[
                            styles.centerContent, {
                            position: 'absolute',
                            left: 10*factorHorizontal,
                            top: (isNotch) ? 55*factorVertical : 45*factorVertical,
                            height: 35*factorRatio,
                            width: 35*factorRatio,
                            borderRadius: 100,
                            zIndex: 5,
                        }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}
                            style={[
                                styles.centerContent, {
                                height: '100%',
                                width: '100%',
                                borderRadius: 100,
                                backgroundColor: 'black',
                                opacity: 0.4,
                            }]}
                        >
                            <EntypoIcon
                                name={'chevron-thin-left'}
                                size={22.5*factorRatio}
                                color={'white'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}
                            style={[
                                styles.centerContent, {
                                height: '100%',
                                width: '100%',
                                borderRadius: 100,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }]}
                        >
                            <EntypoIcon
                                name={'chevron-thin-left'}
                                size={22.5*factorRatio}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal key={'VideoPlayerOptions'}
                    isVisible={this.state.showVideoPlayerOptions}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <VideoPlayerOptions
                        hideVideoPlayerOptions={() => {
                            this.setState({
                                showVideoPlayerOptions: false
                            })
                        }}
                    />
                </Modal>
                <Modal key={'QualitySettings'}
                    isVisible={this.state.showQualitySettings}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <QualitySettings
                        hideQualitySettings={() => {
                            this.setState({
                                showQualitySettings: false
                            })
                        }}
                    />
                </Modal>
                <Modal key={'replies'}
                    isVisible={this.state.showReplies}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={false}
                    hasBackdrop={false}
                >
                    <Replies
                        hideReplies={() => {
                            this.setState({showReplies: false})
                        }}
                        parentComment={this.state.selectedComment}
                    />
                </Modal>
                <Modal key={'lessonComplete'}
                    isVisible={this.state.showLessonComplete}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={false}
                    hasBackdrop={false}
                >
                    <LessonComplete
                        hideLessonComplete={() => {
                            this.setState({showLessonComplete: false})
                        }}
                    />
                </Modal>                                 
                <Modal key={'soundSlice'}
                    isVisible={this.state.showSoundSlice}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <SoundSlice
                        hideSoundSlice={() => {
                            this.setState({
                                showSoundSlice: false
                            })
                        }}
                    />
                </Modal>                
            </View>
        )
    }
}