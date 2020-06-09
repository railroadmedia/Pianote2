/**
 * StudentFocusShow
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
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

const packDict = {
    'Bootcamps': require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
    'Q&A': require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
    'Quick Tips': require('Pianote2/src/assets/img/imgs/quickTips.jpg'),
    'Student Review': require('Pianote2/src/assets/img/imgs/studentReview.jpg'),
}

export default class StudentFocusShow extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false, // show navigation menu
            showStarted: false,
            showRestartCourse: false,
            title: null,
            page: 1, // page of content
            outVideos: false, // if no more videos
            items: [], // hello
        }
    }


    componentDidMount() {
        this.setState({
            pack: this.props.navigation.state.params.pack,
            title: this.props.navigation.state.params.pack,
        })
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


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
                    >
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.mainBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                            }}
                        />
                        <View key={'imageContainer'}
                            style={{
                                width: fullWidth,
                            }}
                        >
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 10*factorHorizontal,
                                    top: (isNotch) ? 50*factorVertical : 40*factorVertical,
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
                            <View key={'bootcampImage'}
                                style={[
                                    styles.centerContent, {
                                    paddingTop: fullHeight*0.1,
                                    width: fullWidth,
                                    zIndex: 2,
                                }]}
                            >
                                <FastImage
                                    style={{
                                        height: onTablet ?  fullWidth*0.45 :  (Platform.OS == 'ios') ? fullWidth*0.625 : fullWidth*0.525,
                                        width: onTablet ?  fullWidth*0.45 :  (Platform.OS == 'ios') ? fullWidth*0.625 : fullWidth*0.525,
                                        zIndex: 2,
                                        borderRadius: 10*factorRatio,
                                        borderColor: colors.thirdBackground,
                                        borderWidth: 5,
                                    }}
                                    source={packDict[this.state.pack]}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                            <View style={{height: 20*factorVertical}}/>
                            <View key={'buttons'}
                                style={{
                                    height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View key={'start'}
                                    style={{width: fullWidth*0.5}}
                                >
                                    <View style={{flex: 1}}/>
                                    {!this.state.showStarted && (
                                    <StartIcon
                                        pxFromTop={0}
                                        pxFromLeft={0}
                                        buttonWidth={fullWidth*0.5}
                                        buttonHeight={(onTablet) ? 
                                            fullHeight*0.065 : fullHeight*0.053
                                        }
                                        pressed={() => this.setState({showStarted: !this.state.showStarted})}
                                    />
                                    )}
                                    {this.state.showStarted && (
                                    <ContinueIcon
                                        pxFromTop={0}
                                        pxFromLeft={0}
                                        buttonWidth={fullWidth*0.5}
                                        buttonHeight={
                                            (onTablet) ? fullHeight*0.065 : fullHeight*0.053
                                        }
                                        pressed={() => console.log('Start')}
                                    />
                                    )}
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'infoButton'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <TouchableOpacity
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
                                            name={(this.state.showInfo) ? 'infocirlce':'infocirlceo'}
                                            size={22*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                marginTop: 3*factorRatio,
                                                fontSize: 13*factorRatio,
                                            }}
                                        >
                                            Info
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {this.state.showInfo && (
                        <View key={'info'}
                            style={{
                                width: fullWidth,
                                backgroundColor: colors.mainBackground,
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.05,
                            }}
                        >
                            <View style={{height: 10*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                Hanon exercises have been around forever and there is a great reason for their sticking power. Therese exercises make the perfect warm up for daily practice. They will help you to develop speed, dexterity and finer independence as well as give you a  platform to practice dynamics and articulations.
                            </Text>
                            <View key={'containStats'}>
                                <View style={{height: 10*factorVertical}}/>
                                <View key={'stats'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.22,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            11
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            LESSONS
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            48
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            MINS
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            2400
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            XP
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                                <View style={{height: 15*factorVertical}}/>
                                <View key={'buttons'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.25,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <AntIcon
                                            name={'like2'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            34
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{width: 15*factorRatio}}/>
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{width: 15*factorRatio}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showRestartCourse: true
                                            })
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <MaterialIcon
                                            name={'replay'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            Restart
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                                <View style={{height: 30*factorVertical}}/>
                            </View>
                        </View>
                        )}
                        <View style={{height: 20*factorVertical}}/>
                        <VerticalVideoList
                            title={'EPISODES'}
                            outVideos={this.state.outVideos}
                            fetchVideos={() => this.getContent()}
                            items={this.state.items}
                            showFilter={true}
                            containerWidth={fullWidth}
                            imageRadius={5*factorRatio}
                            containerHeight={(onTablet) ? fullHeight*0.15 : (
                                Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.09}
                            imageHeight={(onTablet) ? fullHeight*0.125 : (
                                Platform.OS == 'android') ? fullHeight*0.0925 : fullHeight*0.07
                            }
                            renderType={'Mapped'}
                            imageWidth={fullWidth*0.26}
                        />
                    </ScrollView>
                    <Modal key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                            elevation: 5,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
                                this.setState({
                                    showRestartCourse: false
                                })
                            }}
                        />
                    </Modal>
                    <NavigationBar
                        currentPage={'NONE'}
                    />
                </View>
            </View>
        )
    }
}