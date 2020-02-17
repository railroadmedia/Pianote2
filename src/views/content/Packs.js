/**
 * Packs
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import SightReading from 'Pianote2/src/assets/img/svgs/sightReadingLogo.svg';
import FasterFingers from 'Pianote2/src/assets/img/svgs/fasterFingersLogo.svg';

export default class Packs extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            parentPage: 'PACKS',
            menu: 'HOME',
            showModalMenu: false,
            mainImage: null,
            secondImage: null,
            thirdImage: null,
            currentPack: 'FASTER FINGERS'
        }
    }


    componentDidMount() {
        this.setState({
            mainImage: require('Pianote2/src/assets/img/imgs/fasterFingers.png'),
            secondImage: require('Pianote2/src/assets/img/imgs/sightReading.png'),
            thirdImage: require('Pianote2/src/assets/img/imgs/500Songs.png'),
        })
    }


    pressFilters = async () => {
        await this.setState({
            filterClicked: !this.state.filterClicked
        })

        await Animated.timing(
            this.state.filterSize, {
                toValue: (this.state.filterClicked) ? 0.25 : 0,
                duration : 250,
            }
        ).start();
        
        await Animated.timing(
            this.state.listSize, {
            toValue: (this.state.filterClicked) ? 0.35 : 0.6,
            duration : 250,
            }
        ).start();
    }


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View style={{zIndex: 3}}>
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
                                leftHeader={'PACKS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        parentPage: 'PACKS',
                                        menu: 'HOME',
                                        showModalMenu: true,
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        parentPage: 'ALL PACKS',
                                        menu: 'PACKS',
                                        showModalMenu: true,
                                    })
                                }}
                                rightHeader={'ALL PACKS'}
                                isHome={false}
                            />
                        </View>
                        <View key={'focusedPack'}
                            style={{flex: 0.71}}
                        >
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
                                        fontFamily: 'Roboto',
                                        fontSize: 16*factorRatio,
                                        textAlign: 'center',
                                        color: 'white',    
                                    }}
                                >
                                    This is a short message explaining what the pack is, how to use it, and why students should begin to go through it.
                                </Text>
                                <View style={{height: fullHeight*0.115}}/>
                            </View>
                            <View key={'image1'}
                                style={{
                                    position: 'absolute',
                                    bottom: fullHeight*0.095,
                                    zIndex: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <FasterFingers
                                    height={250*factorVertical}
                                    width={250*factorVertical}
                                />
                                <View style={{flex: 1}}/>
                            </View>    
                            <FastImage
                                style={{
                                    flex: 1, 
                                    alignSelf: 'stretch', 
                                    backgroundColor: 'black'
                                }}
                                source={this.state.mainImage}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <StartIcon
                                pxFromTop={(isTablet) ? fullHeight*0.54 : fullHeight*0.55}
                                pxFromLeft={fullWidth*0.065}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => {
                                    this.props.navigation.navigate('VIDEOPLAYER')
                                }}
                            />
                            <MoreInfoIcon
                                pxFromTop={(isTablet) ? fullHeight*0.54 : fullHeight*0.55}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                pxFromRight={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => {
                                    this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Bootcamps'}
                                        )
                                }}
                            />
                        </View>
                        <View key={'otherPacks'}
                            style={[
                                styles.centerContent, {
                                flex: 0.275,
                                justifyContent: 'space-around',
                                alignContent: 'space-around', 
                                flexDirection: 'row',
                                zIndex: 10,
                            }]}
                        >
                            <View key={'image2'}
                                style={{
                                    height: 170*factorVertical,
                                    width: 170*factorVertical,
                                    borderRadius: 12.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.85}
                                    height={'60%'}
                                    borderRadius={12.5*factorRatio}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        height: 170*factorVertical,
                                        width: 170*factorVertical,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <SightReading
                                            height={90*factorVertical}
                                            width={125*factorVertical}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 12.5*factorRatio, backgroundColor: 'black'}}
                                        source={this.state.secondImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View key={'image3'}
                                style={{
                                    height: 170*factorVertical,
                                    width: 170*factorVertical,
                                    borderRadius: 12.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.8}
                                    height={'60%'}
                                    borderRadius={12.5*factorRatio}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        height: 170*factorVertical,
                                        width: 170*factorVertical,
                                        
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <Songs500
                                            height={60*factorVertical}
                                            width={100*factorVertical}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 12.5*factorRatio, backgroundColor: 'black'}}
                                        source={this.state.thirdImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>
                    <NavigationBar
                        currentPage={'PACKS'}
                    />
                </View>
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
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        )
    }
}