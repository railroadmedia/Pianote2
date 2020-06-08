/**
 * PathOverview
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
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class PathOverview extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            outVideos: false,
            items: [],
            page: 0,
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

            console.log( 'response :', response, 'error : ', error)

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
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        width: fullWidth,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
                    >
                        <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                        <View key={'image'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.31 + (isNotch ? fullHeight*0.035 : 0),
                            }]}
                        >
                            <FastImage
                                style={{
                                    flex: 1, 
                                    alignSelf: 'stretch', 
                                    backgroundColor: colors.mainBackground,
                                }}
                                source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />  
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
                        </View>
                        <View key={'title'}
                            style={{minHeight: fullHeight*0.2}}
                        >
                            <View style={{height: 20*factorVertical}}/>
                            <View style={{flex: 1}}>   
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 24*factorRatio,
                                    }}
                                >
                                    {'The Four Pillars \nof Improvisation'}
                                </Text>
                                <View style={{height: 10*factorVertical}}/>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                        textAlign: 'center',
                                        fontSize: 14*factorRatio,

                                    }}
                                >
                                    TAYLOR GORDON | LEVEL 5 | 275XP
                                </Text>
                            </View>
                            <View style={{height: 20*factorVertical}}/>
                            <View key={'thumb/Start/Info'}
                                style={{height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053}}
                            >
                                <View key={'thumbs'}
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
                                    style={{
                                        alignItems: 'center',
                                        flex: 1,
                                    }}
                                >
                                    <AntIcon
                                        name={'like2'}
                                        size={24.5*factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            color: 'white',
                                            marginTop: 3*factorRatio,
                                            fontSize: 12*factorRatio,
                                        }}
                                    >
                                        34
                                    </Text>
                                </TouchableOpacity>
                            </View>
                                <StartIcon
                                    pxFromTop={0}
                                    buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                    pxFromLeft={fullWidth*0.5/2}
                                    buttonWidth={fullWidth*0.5}
                                    pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
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
                                                name={'infocirlceo'}
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
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'verticalVideoList'}
                            style={[
                                styles.centerContent, {
                                minHeight: fullHeight*0.29*0.90625,
                                justifyContent: 'space-around',
                                alignContent: 'space-around', 
                                flexDirection: 'row'
                            }]}
                        >
                            <VerticalVideoList
                                outVideos={this.state.outVideos}
                                fetchVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                showNextVideo={false}
                                showFilters={false}
                                showMultipleVideos={true}
                                items={this.state.items}
                                containerWidth={fullWidth}
                                containerHeight={(onTablet) ? fullHeight*0.155 : fullHeight*0.115}
                                containerBorderWidth={0}
                                imageHeight={(onTablet) ? fullHeight*0.125 : fullHeight*0.0875}
                                imageWidth={fullWidth*0.325}
                                imageRadius={7*factorRatio}
                            />
                        </View>
                    </ScrollView>
                </View>
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
                    currentPage={'LessonsPathOverview'}
                />
            </View>
        )
    }
}
                            