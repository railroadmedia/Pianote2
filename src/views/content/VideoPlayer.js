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
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MakeComment from '../../components/MakeComment.js';
import LessonComplete from '../../modals/LessonComplete.js';
import QualitySettings from '../../modals/QualitySettings.js';
import Resources from 'Pianote2/src/assets/img/svgs/resources.svg';
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
            isCourse: true,
            title: 'The Four Pillars \n Of Improvisation',
            page: 1, // page of content
            outVideos: false, // if no more videos
            items: [], // hello
            assignmentList: [
                ['Learn The Fill', 1, 1],
                ['Learn The Beat', 2, 0],
                ['Put It Together', 3, 0],
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
                                            Resources
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
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                        A description of the video I assume goes right here.
                                    </Text>
                                </View>
                                )}
                            </View>
                            <View style={{height: (this.state.isCourse) ? 20*factorVertical : 10*factorVertical}}/>
                            {this.state.isCourse && (
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
                            {this.state.isCourse && (
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
                            <View key={'videoList'}>
                            <VerticalVideoList
                                title={(this.state.isCourse) ? 'COURSE LESSONS' : 'MORE SONGS'}
                                outVideos={this.state.outVideos}
                                renderType={'Mapped'}
                                showFilter={true}
                                showTitleOnly={true}
                                items={this.state.items}
                                imageRadius={5*factorRatio}
                                containerBorderWidth={0}
                                containerWidth={fullWidth}
                                containerHeight={(this.state.isCourse) ? 
                                    ((onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.0925)
                                    : 
                                    fullWidth*0.22
                                }
                                imageHeight={(this.state.isCourse) ? 
                                    ((onTablet) ? fullHeight*0.12 : ((Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065))
                                    : 
                                    fullWidth*0.175
                                }
                                imageWidth={(this.state.isCourse) ? fullWidth*0.26 : fullWidth*0.175}
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
                                        COMPLETE {this.state.isCourse ? 'COURSE':'SONG'} 
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
                            height: 50*factorRatio,
                            width: 50*factorRatio,
                            zIndex: 5,
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