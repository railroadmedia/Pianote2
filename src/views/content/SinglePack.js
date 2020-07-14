/**
 * SinglePack
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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SightReading from 'Pianote2/src/assets/img/svgs/sightReadingLogo.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import FasterFingers from 'Pianote2/src/assets/img/svgs/fasterFingersLogo.svg';

export default class SinglePack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            outVideos: false,
            showInfo: false,
            items: [],
            page: 0,
            pack: '', // 500 SONGS | FASTERFINGERS | SIGHT READING
        }
    }


    componentDidMount = async () => {
        await this.setState({
            pack: this.props.navigation.state.params.data,
        })
        await this.getContent()
    }


    async getContent() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                //required_user_states: ['started'],
                included_types: ['course'],
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
                        xp: newContent[i].getField('xp'),
                        duration: newContent[i].getField('length'),
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
            })
        }
    }


    whatImage() {
        if(this.state.pack == '500 SONGS') { 
            return require('Pianote2/src/assets/img/imgs/500Songs.png')
        } else if(this.state.pack == 'FASTER FINGERS') {
            return require('Pianote2/src/assets/img/imgs/fasterFingers.png')
        } else if(this.state.pack == 'SIGHT READING') {
            return require('Pianote2/src/assets/img/imgs/sightReading.png')
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
                        zIndex: 3, 
                        elevation: 3,
                    }}
                >
                    <ScrollView
                        style={{backgroundColor: colors.mainBackground}}
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                    >
                        <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                        <View key={'imageContainer'}
                            style={{
                                height: fullHeight*0.5,
                                zIndex: 3, 
                                elevation: 3,
                            }}
                        >           
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 10*factorHorizontal,
                                    top: (isNotch) ? 10*factorVertical : 10*factorVertical,
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
                                        opacity: 0.5,
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
                            <GradientFeature
                                color={'blue'}
                                opacity={1}
                                height={'70%'}
                                borderRadius={0}
                            />
                            <View key={'SVGs'}
                                style={{
                                    position: 'absolute',
                                    bottom: (onTablet) ? fullHeight*0.065/2 : fullHeight*0.053/2,
                                    zIndex: 2,
                                    elevation: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                {(this.state.pack == 'SIGHT READING') && (
                                <SightReading
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={275*factorVertical}
                                />
                                )}
                                {(this.state.pack == '500 SONGS') && (
                                <Songs500
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={275*factorVertical}
                                />
                                )}
                                {(this.state.pack == 'FASTER FINGERS') && (
                                <FasterFingers
                                    height={250*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={300*factorVertical}
                                />
                                )}
                                <View style={{flex: 1}}/>
                            </View>    
                            <FastImage
                                style={{flex: 1}}
                                source={this.whatImage()}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View key={'buttons'}
                                style={{
                                    position: 'absolute',
                                    bottom: 10*factorRatio,
                                    left: 0,
                                    width: fullWidth,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            >
                                <View key={'buttonRow'}
                                    style={{flexDirection: 'row'}}
                                >                                   
                                    <View key={'plusButton'}
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <AntIcon
                                                name={'plus'} 
                                                size={30*factorRatio} 
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
                                                My List
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'start'}
                                        style={{width: fullWidth*0.5}}
                                    >
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showStarted: !this.state.showStarted
                                                })
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                            }}
                                        >
                                            <StartIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth*0.5}
                                                buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                                pressed={() => {
                                                    this.props.navigation.navigate('VIDEOPLAYER')
                                                }}
                                            />
                                        </TouchableOpacity>
                                        {this.state.showStarted && (
                                        <ContinueIcon
                                            pxFromTop={0}
                                            pxFromLeft={0}
                                            buttonWidth={fullWidth*0.5}
                                            buttonHeight={
                                                (onTablet) ? fullHeight*0.065 : fullHeight*0.053
                                            }
                                            pressed={() => {}}
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
                                                this.setState({showInfo: !this.state.showInfo})
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
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                Hanon exercises have been around forever and there is a great reason for their sticking power. Therese exercises make the perfect warm up for daily practice.
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
                        <View style={{height: 5*factorVertical}}/>
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
                                items={this.state.items}
                                title={'Packs'} // title for see all page
                                renderType={'Mapped'} // map vs flatlist
                                type={'PACK'} // the type of content on page
                                showFilter={false} // 
                                showType={false} // show course / song by artist name
                                showArtist={false} // show artist name
                                showLength={true}
                                imageRadius={5*factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.095} // height per row
                                imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.095 : fullHeight*0.075} // image height
                                imageWidth={fullWidth*0.26} // image width
                                outVideos={this.state.outVideos} // if paging and out of videos
                                //getVideos={() => this.getContent()} // for paging
                            />
                        </View>
                        <View style={{height: 15*factorVertical}}/>
                    </ScrollView>
                </View>
                <NavigationBar
                    currentPage={'SINGLEPACK'}
                />
                <Modal key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={(e) => {
                            this.setState({showModalMenu: e}),
                            this.forceUpdate()
                        }}
                        parentPage={this.state.parentPage}
                        menu={this.state.menu}
                    />
                </Modal>
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
            </View>
        )
    }
}