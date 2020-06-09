/**
 * FoundationsLevel
 */
import React from 'react';
import { 
    View, 
    Text,
    ScrollView, 
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class FoundationsLevel extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showRestartCourse: false,
            profileImage: '',
            isStarted: true,
            outVideos: false,
            showInfo: false,
            level: 3,
            items: [],
            page: 0,
        }
    }


    async componentDidMount() {
        let profileImage = await AsyncStorage.getItem('profileURI')
        if(profileImage !== null) {
            await this.setState({profileImage})
        }
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
                        progress: (i > 700) ? 'check': ((i == 7) ? 'progress':'none')
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
                    zIndex: 1,
                    elevation: 1, 
                }}
            >                    
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{
                        flex: 1, 
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                    <View key={'image'}
                        style={[
                            styles.centerContent, {
                            height: fullHeight*0.33,
                        }]}
                    >
                        <View key={'goBackIcon'}
                            style={[
                                styles.centerContent, {
                                position: 'absolute',
                                left: 10*factorHorizontal,
                                top: (isNotch) ? 20*factorVertical : 10*factorVertical,
                                    height: 50*factorRatio,
                                width: 50*factorRatio,
                                zIndex: 10,
                                elevation: 10,
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
                                    size={27.5*factorRatio}
                                    color={'white'}
                                />
                            </TouchableOpacity>
                        </View>
                        <GradientFeature
                            color={'blue'}
                            opacity={1}
                            height={'100%'}
                            borderRadius={0}
                        />
                        <FastImage
                            style={{
                                flex: 1, 
                                alignSelf: 'stretch', 
                                backgroundColor: colors.mainBackground,
                            }}
                            source={require('Pianote2/src/assets/img/imgs/foundations-background-image.png')}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View key={'pianoteSVG'}
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: fullWidth,
                                zIndex: 2,
                                elevation: 2,
                            }}
                        >
                            <View style={{flex: 0.7}}/>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}/>
                                <Pianote
                                    height={fullHeight*0.03}
                                    width={fullWidth*0.35}
                                    fill={'white'}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <Text key={'foundations'}
                                style={{
                                    fontSize: 30*factorRatio,
                                    fontWeight: '700',
                                    color: 'white',
                                    fontFamily: 'RobotoCondensed-Regular',
                                    transform: [{scaleX: 0.7}],
                                    textAlign: 'center',
                                }}
                            >
                                FOUNDATIONS
                            </Text>
                            <View style={{flex: 0.15}}/>
                            <Text key={'level'}
                                style={{
                                    fontSize: 60*factorRatio,
                                    fontWeight: '700',
                                    color: 'white',
                                    fontFamily: 'RobotoCondensed-Regular',
                                    textAlign: 'center',
                                }}
                            >
                                LEVEL {this.state.level}
                            </Text>
                            <View style={{flex: 0.3}}/>
                            <View key={'startIcon'}
                                style={{height: (onTablet) ? fullHeight*0.065 : fullHeight*0.05}}
                            >
                                <View key={'mylist'}
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: fullWidth*0.25,
                                        height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                        zIndex: 3,
                                        elevation: 3,
                                    }]}
                                >
                                    <TouchableOpacity
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
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                fontSize: 12*factorRatio,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </TouchableOpacity>
                                                                 
                                </View>
                                <ContinueIcon
                                    pxFromTop={0}
                                    buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.05}
                                    pxFromLeft={fullWidth*0.5/2}
                                    buttonWidth={fullWidth*0.5}
                                    pressed={() => this.props.navigation.navigate('COURSECATALOG')}
                                />
                                <View key={'info'}
                                    style={[ 
                                        styles.centerContent, {
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        width: fullWidth*0.25,
                                        height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                        zIndex: 3,
                                        elevation: 3,
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showInfo: !this.state.showInfo
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
                            <View style={{height: 20*factorVertical}}/>   
                        </View> 
                    </View>
                    {this.state.showInfo && (
                    <View key={'info'}
                        style={{
                            width: fullWidth,
                            paddingLeft: fullWidth*0.05,
                            paddingRight: fullWidth*0.05,
                        }}
                    >
                        <View style={{height: 20*factorVertical}}/>
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
                        <View style={{height: 15*factorVertical}}/>
                        <TouchableOpacity
                            onPress={() => {}}
                            style={{}}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 15*factorRatio,
                                    color: colors.pianoteRed,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                <EntypoIcon
                                    name={'controller-play'}
                                    color={colors.pianoteRed}
                                    size={15*factorRatio}
                                /> WATCH THE TRAILER
                            </Text>
                        </TouchableOpacity>
                        <View style={{height: 10*factorVertical}}/>
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
                                            fontSize: 13*factorRatio,
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
                    <VerticalVideoList
                        title={'ALL LESSONS'}
                        outVideos={this.state.outVideos}
                        //getVideos={() => this.getContent()}
                        renderType={'Mapped'}
                        showFilter={false}
                        items={this.state.items}
                        imageRadius={5*factorRatio}
                        containerBorderWidth={0}
                        containerWidth={fullWidth}
                        containerHeight={(onTablet) ? fullHeight*0.155 : fullHeight*0.115}
                        imageHeight={(onTablet) ? fullHeight*0.125 : fullHeight*0.087}
                        imageWidth={fullWidth*0.315}
                        imageRadius={5*factorRatio}
                        showLines={true}
                    />
                </ScrollView>
                <Modal key={'restartCourse'}
                    isVisible={this.state.showRestartCourse}
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
                    <RestartCourse
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false
                            })
                        }}
                    />
                </Modal>
                <NavigationBar
                    currentPage={''}
                />
            </View>
        </View> 
        )
    }
}