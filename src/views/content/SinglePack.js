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
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
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
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('artist'),
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    progress: (i > 700) ? 'check': ((i == 7) ? 'progress':'none')
                })
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
                        height: fullHeight*0.90625,
                        width: fullWidth,
                        alignSelf: 'stretch',
                    }}
                >
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
                                zIndex: 10,
                            }}
                        >
                        </View>
                        <View key={'imageContainer'}
                            style={{height: fullHeight*0.64}}
                        >
                            <View style={{zIndex: 11}}>
                                <NavMenuHeaders
                                    pxFromTop={30*factorRatio}
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
                            </View>
                            <GradientFeature
                                color={'black'}
                                opacity={1}
                                height={'60%'}
                                borderRadius={0}
                            />
                            <View key={'message'}
                                style={{
                                    position: 'absolute',
                                    width: fullWidth,
                                    height: '100%',
                                    zIndex: 10,
                                    paddingLeft: fullWidth*0.125,
                                    paddingRight: fullWidth*0.125,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 16*factorRatio,
                                        textAlign: 'center',
                                        color: 'white',
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    This is a short message explaining what the pack is, how to use it, and why students should begin to go through it.
                                </Text>
                                <View style={{height: fullHeight*0.115}}/>
                            </View>
                            <View key={'image1'}
                                style={{
                                    position: 'absolute',
                                    bottom: fullHeight*0.09,
                                    zIndex: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                {(this.state.pack == 'SIGHT READING') && (
                                <SightReading
                                    height={250*factorVertical}
                                    width={250*factorVertical}
                                />
                                )}
                                {(this.state.pack == '500 SONGS') && (
                                <Songs500
                                    height={250*factorVertical}
                                    width={250*factorVertical}
                                />
                                )}
                                {(this.state.pack == 'FASTER FINGERS') && (
                                <FasterFingers
                                    height={250*factorVertical}
                                    width={250*factorVertical}
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
                                    height: (isTablet) ? 170*factorVertical : 150*factorVertical,
                                    zIndex: 10,
                                }}
                            >
                                <View key={'title'}
                                    style={{
                                        height: (isTablet) ? 90*factorVertical : 80*factorVertical,
                                        alignSelf: 'stretch',  
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            fontFamily: 'Roboto',
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
                                        height: (isTablet) ? 80*factorVertical : 70*factorVertical,
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
                                                    fontFamily: 'Roboto',
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
                                                buttonHeight={(isTablet) ? 
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
                                                (isTablet) ? fullHeight*0.065 : fullHeight*0.053
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
                                                    fontFamily: 'Roboto',
                                                    color: 'white',
                                                    marginTop: 3*factorRatio,
                                                    fontSize: 12*factorRatio,
                                                }}
                                            >
                                                Info
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View key={'buffer0'}
                            style={{height: 5*factorVertical}}
                        >
                        </View>
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
                                containerHeight={(isTablet) ? fullHeight*0.15 : fullHeight*0.09}
                                imageHeight={(isTablet) ? fullHeight*0.135 : fullHeight*0.07}
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
            </View>
        )
    }
}