/**
 * VideoPlayer
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import Replies from '../../components/Replies';
import FastImage from 'react-native-fast-image';
import Comments from '../../components/Comments';
import SoundSlice from '../../components/SoundSlice.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MakeComment from '../../components/MakeComment.js';
import LessonComplete from '../../modals/LessonComplete.js';
import QualitySettings from '../../modals/QualitySettings.js';
import VideoPlayerOptions from '../../modals/VideoPlayerOptions.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons.js';

export default class VideoPlayer extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showReplies: false,
            showStarted: false,
            showAssignment: false,
            showSoundSlice: false,
            showMakeComment: false,
            showInfo: false,
            showVideoPlayerOptions: false,
            showAssignmentComplete: false,
            showQualitySettings: false,
            showAssignmentComplete: false, 
            showLessonComplete: false, 
            title: 'The Four Pillars \n Of Improvisation',
            page: 1, // page of content
            outVideos: false, // if no more videos
            items: [], // hello
            progress: 0.73, // 0 - 1 for percent thru course
            assignmentList: [
                ['Learn The Exercise', 1],
                ['Learn The Song', 2],
                ['Put It Together', 3],
            ], // assingments
            comments: [
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 0, 28,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
            ], // video's comments
            items: [], // video lessons to pass to vertical video list
            page: 0,
            clickedAssignment: {'name':'','num':''},
            outComments: false, // if out of comments
            outVideos: false, // if out of videos
        }
    }


    componentDidMount() {
        this.getContent()
    }


    async getContent() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('artist'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        progress: (i < 7) ? 'check': ((i == 7) ? 'progress':'none')
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })
            
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
                        borderBottomColor: '#ececec',
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
                                color: '#7F8C8D',
                                fontFamily: 'OpenSans-Regular',
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
                        {(row[1] == 1) && (
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
                                    size={15*factorRatio}
                                    color={'white'}
                                />
                            </View>
                        </View>
                        )}
                        {(row[1] == 0) && (
                        <View style={[styles.centerContent, {flexDirection: 'row'}]}>
                            <View style={{flex: 0.25}}/>
                            <EntypoIcon
                                name={'chevron-thin-right'}
                                size={20*factorRatio}
                                color={'#c2c2c2'}
                            />
                            <View style={{flex: 1}}/>
                        </View>
                        )}
                    </View>
                </TouchableOpacity>
            )
        })
    }


    fetchComments() {
        if(this.state.outComments == false) {
            this.setState({
                comments: [...this.state.comments, ...this.state.comments],
                outComments: (this.state.comments.length > 100) ? true : false
            })
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container2'}
                    style={{
                        height: fullHeight, 
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'video'}
                        style={{
                            height: (onTablet) ? fullHeight*0.4 : fullHeight*0.3025,
                            backgroundColor: colors.mainBackground
                        }}
                    >
                        <FastImage
                            style={{flex: 1}}
                            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View key={'belowVideo'}
                        style={{flex: 1}}
                    >
                        <ScrollView
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
                                    This is The Lesson Title
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
                                    CASSI FALK | LESSON 7 | 275 XP
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
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={'like2'}
                                            size={27.5*factorRatio}
                                            color={'black'}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                            }}
                                        >
                                            34
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
                                            color={'black'}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
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
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5*factorRatio}
                                            color={'black'}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
                                            }}
                                        >
                                            Download
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
                                            color={'black'}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
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
                                            name={'infocirlceo'}
                                            size={27.5*factorRatio}
                                            color={'black'}
                                        />
                                        <View style={{height: 5*factorVertical}}/>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12*factorRatio,
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
                                        }}
                                    >
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                    </Text>
                                </View>
                                )}
                            </View>
                            <View key={'lessonProgress'}
                                style={{
                                    height: fullHeight*0.25
                                }}
                            >
                                <View style={{flex: 0.3}}/>
                                <View key={'subTitle'}
                                    style={{paddingLeft: fullWidth*0.035}}
                                >
                                    <Text
                                        style={{
                                            fontSize: 17*factorRatio,
                                            fontWeight: '700',
                                            fontFamily: 'OpenSans-Regular',
                                        }}
                                    >
                                        YOUR LESSON PROGRESS
                                    </Text>
                                </View>
                                <View style={{flex: 0.2}}/>
                                <View key={'progressBar'}
                                    style={styles.centerContent}
                                >
                                    <View
                                        style={{
                                            height: (Platform.OS == 'ios') ? 
                                                fullHeight*0.05*factorVertical : fullHeight*0.07*factorVertical,
                                            width: '92.5%',
                                            flexDirection: 'row',
                                            borderRadius: 100*factorRatio,
                                            backgroundColor: '#ececec',
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: (Platform.OS == 'ios') ? 
                                                    fullHeight*0.05*factorVertical : fullHeight*0.07*factorVertical,
                                                width: '83%',
                                                borderRadius: 100*factorRatio,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: (Platform.OS == 'ios') ? 
                                                        fullHeight*0.045*factorVertical : fullHeight*0.07*factorVertical,
                                                    width: '97%',
                                                    borderRadius: 100*factorRatio,
                                                    backgroundColor: '#ececec',
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                    paddingLeft: 5*factorHorizontal,
                                                    paddingRight: 5*factorHorizontal,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        height: '75%',
                                                        width: fullWidth*0.1 + fullWidth*0.635*this.state.progress,
                                                        borderRadius: 100*factorRatio,
                                                        backgroundColor: '#7F8C8D',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 14*factorRatio,
                                                            paddingRight: 10*factorHorizontal,
                                                            fontWeight: '700',
                                                            fontFamily: 'OpenSans-Regular',
                                                            textAlign: 'right',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {this.state.progress*100}%
                                                    </Text>
                                                </View>
                                            </View>    
                                        </View>
                                        <View
                                            style={[
                                                styles.centerContent, {
                                                height: (Platform.OS == 'ios') ? 
                                                    fullHeight*0.05*factorVertical : fullHeight*0.07*factorVertical,
                                                width: '15%',
                                                alignSelf: 'stretch'
                                            }]}
                                        >
                                            <View 
                                                style={{
                                                    width: fullWidth*0.1,
                                                    height: (Platform.OS == 'ios') ? 
                                                        fullHeight*0.05*factorVertical : fullHeight*0.07*factorVertical,
                                                }}
                                            >
                                                <View style={{flex: 0.5}}/>
                                                <View style={styles.centerContent}>
                                                    <IonIcon
                                                        name={'ios-trophy'}
                                                        size={16*factorRatio}
                                                        color={'#7F8C8D'}
                                                    />
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#7F8C8D',
                                                        fontWeight: '700',
                                                        textAlign: 'center',
                                                        fontSize: 10*factorRatio,
                                                    }}
                                                >
                                                    250 XP
                                                </Text>
                                                <View style={{flex: 0.5}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 0.155}}/>
                                <View key={'completeLessons'}
                                    style={{
                                        paddingLeft: fullWidth*0.0375,
                                        paddingRight: fullWidth*0.0375,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({showLessonComplete: true})
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            height: 50*factorRatio,
                                            width: '100%',
                                            borderRadius: 200,
                                            backgroundColor: '#fb1b2f',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18*factorRatio,
                                                fontWeight: '700',
                                                color: 'white',
                                            }}
                                        >
                                            COMPLETE LESSON
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View key={'assingmentsHeader'}
                                style={{paddingLeft: fullWidth*0.035}}
                            >
                                <Text
                                    style={{
                                        fontSize: 17*factorRatio,
                                        fontWeight: '700',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    ASSIGNMENTS
                                </Text>
                            </View>
                            <View style={{height: fullHeight*0.01}}/>
                            <View key={'assignments'}
                                style={{
                                    width: fullWidth,
                                    borderTopColor: '#ececec',
                                    borderTopWidth: 1.5,
                                }}
                            >
                                {this.renderAssignments()}
                            </View>
                            <View style={{height: fullHeight*0.045}}/>
                            <View key={'courseHeader'}
                                style={{paddingLeft: fullWidth*0.035}}
                            >
                                <Text
                                    style={{
                                        fontSize: 17*factorRatio,
                                        fontWeight: '700',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    COURSE LESSONS
                                </Text>
                            </View>
                            <View style={{height: fullHeight*0.02}}/>
                            <View key={'videoList'}>
                                <VerticalVideoList
                                    outVideos={true}
                                    showPlus={false}
                                    fetchVideos={() => this.getContent()}
                                    renderType={'Mapped'}
                                    items={this.state.items}
                                    containerWidth={fullWidth}
                                    imageRadius={7.5*factorRatio}
                                    containerHeight={(onTablet) ? fullHeight*0.15 : (
                                        Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.09}
                                    imageHeight={(onTablet) ? fullHeight*0.125 : (
                                        Platform.OS == 'android') ? fullHeight*0.0925 : fullHeight*0.07
                                    }        
                                    imageWidth={fullWidth*0.26}
                                />
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'comments'}>
                                <Comments
                                    showMakeComment={() => {
                                        this.setState({
                                            showMakeComment: true
                                        })
                                    }}
                                    showReplies={() => {
                                        this.setState({
                                            showReplies: true
                                        })
                                    }}
                                    comments={this.state.comments}
                                    outComments={this.state.outComments}
                                    fetchComments={() => this.fetchComments()}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View key={'goBackIcon'}
                        style={[
                            styles.centerContent, {
                            position: 'absolute',
                            left: 10*factorHorizontal,
                            top: (isNotch) ? 40*factorVertical : 30*factorVertical,
                            height: 50*factorRatio,
                            width: 50*factorRatio,
                            zIndex: 10,
                            elevation: 10,
                            backgroundColor: 'transparent',
                        }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack()
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
                <Modal key={'makeComment'}
                    isVisible={this.state.showMakeComment}
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
                    <MakeComment
                        hideMakeComment={() => {
                            this.setState({showMakeComment: false})
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
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={false}
                    hasBackdrop={false}
                >
                    <Replies
                        hideReplies={() => {
                            this.setState({showReplies: false})
                        }}
                        showMakeComment={() => {
                            this.setState({showMakeComment: true})
                        }}
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