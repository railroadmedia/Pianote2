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
import AntIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
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
            menu: 'PACKS',
            parentPage: 'PACKS',
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
                    <NavMenuHeaders
                        pxFromTop={navPxFromTop}
                        leftHeader={'PACKS'}
                        rightHeader={this.state.pack}
                        pressLeftHeader={() => {
                            this.setState({
                                parentPage: 'PACKS',
                                menu: 'HOME',
                                showModalMenu: true,
                            })
                        }}
                        pressRightHeader={() => {
                            this.setState({
                                parentPage: this.props.navigation.state.params.data,
                                menu: 'PACKS',
                                showModalMenu: true,
                            })
                        }}
                        isHome={false}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                    >
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: 'black',
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 3, 
                                elevation: 3,
                            }}
                        />
                        <View key={'imageContainer'}
                            style={{
                                height: (fullHeight*0.90625 - navHeight) - (fullWidth*0.45 + fullWidth*0.05),
                                zIndex: 3, 
                                elevation: 3,
                            }}
                        >
                            <GradientFeature
                                color={'black'}
                                opacity={1}
                                height={'60%'}
                                borderRadius={0}
                            />
                            <View key={'image1'}
                                style={{
                                    position: 'absolute',
                                    bottom: fullHeight*0.025,
                                    zIndex: 2,
                                    elevation: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                {(this.state.pack == 'SIGHT READING') && (
                                <SightReading
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={250*factorVertical}
                                />
                                )}
                                {(this.state.pack == '500 SONGS') && (
                                <Songs500
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={250*factorVertical}
                                />
                                )}
                                {(this.state.pack == 'FASTER FINGERS') && (
                                <FasterFingers
                                    height={250*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={290*factorVertical}
                                />
                                )}
                                <View style={{flex: 1}}/>
                            </View>    
                            <FastImage
                                style={{flex: 1, backgroundColor: 'black'}}
                                source={this.whatImage()}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View key={'buttons'}
                                style={{
                                    position: 'absolute',
                                    bottom: 5*factorVertical,
                                    left: 0,
                                    width: fullWidth,
                                    height: (onTablet) ? 170*factorVertical : 150*factorVertical,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            >
                                <View key={'title'}
                                    style={{
                                        height: (onTablet) ? 90*factorVertical : 80*factorVertical,
                                        alignSelf: 'stretch',  
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 25*factorRatio,
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.title}
                                    </Text>
                                </View>
                                <View key={'buttonRow'}
                                    style={{
                                        height: (onTablet) ? 80*factorVertical : 70*factorVertical,
                                        flexDirection: 'row',
                                    }}
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
                                                name={'like2'}
                                                size={24.5*factorRatio}
                                                color={'white'}
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
                                                buttonHeight={(onTablet) ? 
                                                    fullHeight*0.065 : fullHeight*0.053
                                                }
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
                                            pressed={() => console.log('Start')}
                                        />
                                        )}
                                        <View style={{flex: 1}}></View>
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
                                                color={'white'}
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
                                backgroundColor: '#111212',
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
                                Hanon exercises have been around forever and there is a great reason for their sticking power. Therese exercises make the perfect warm up for daily practice. They will help you to develop speed, dexterity and finer independence as well as give you a  platform to practice dynamics and articulations. Cassi walks you step by step through some of her facourite Hanon exercises in this Course and includes a variation for each exercise that will target specific technical skills.
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
                                            color={'white'}
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
                                            color={'white'}
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
                                            color={'white'}
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
                                outVideos={this.state.outVideos}
                                items={this.state.items}
                                fetchVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                containerWidth={fullWidth}
                                containerHeight={(onTablet) ? fullHeight*0.15 : (
                                    Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.09
                                }
                                imageHeight={(onTablet) ? fullHeight*0.12 : (
                                    Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.0625
                                }
                                imageWidth={fullWidth*0.26}
                                showLines={false}
                                imageRadius={10*factorRatio}
                                containerBorderWidth={1}
                            />
                        </View>
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