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
            showModalMenu: false,
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View
                        style={{
                            height: fullHeight*0.1,
                            width: fullWidth,
                            position: 'absolute',
                            zIndex: 2, 
                            elevation: 2,
                            alignSelf: 'stretch', 
                        }}
                    >
                        <NavMenuHeaders
                            currentPage={'PACKS'}
                        />
                    </View>
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.mainBackground,
                            }}
                        />
                        <View style={{height: 20*factorVertical}}/>
                        <Text
                            style={{
                                paddingLeft: 12*factorHorizontal,
                                fontSize: 30*factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight: (Platform.OS == 'ios') ? '900' : 'bold',
                            }}
                        >
                            Packs
                        </Text>
                        <View style={{height: 20*factorVertical}}/>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                paddingLeft: 5*factorHorizontal,
                                paddingRight: 5*factorHorizontal,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('SINGLEPACK', {data: '500 SONGS'} )
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/500Songs.png')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('SINGLEPACK', {data: 'FASTER FINGERS'} )
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <FasterFingers
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/fasterFingers.png')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('SINGLEPACK', {data: 'SIGHT READING'} )
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <SightReading
                                            height={30*factorVertical}
                                            width={fullWidth*0.25}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/sightReading.png')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
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