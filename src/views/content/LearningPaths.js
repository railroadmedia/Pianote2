/**
 * LearningPaths
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
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class LearningPaths extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
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
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View key={'image'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.32,
                            }]}
                        >
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
                                <View style={{flex: 0.4}}/>
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
                                        fontSize: 60*factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        transform: [{ scaleX: 0.7}],
                                        textAlign: 'center',
                                    }}
                                >
                                    FOUNDATIONS
                                </Text>
                                <View style={{flex: 0.6}}/>
                                <StartIcon
                                    pxFromTop={(onTablet) ? fullHeight*0.32*0.725 : fullHeight*0.305*0.725}
                                    buttonHeight={(onTablet) ? fullHeight*0.06 : (Platform.OS == 'ios') ? fullHeight*0.05 : fullHeight*0.055}
                                    pxFromLeft={fullWidth*0.065}
                                    buttonWidth={fullWidth*0.42}
                                    pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
                                />
                                <MoreInfoIcon
                                    pxFromTop={(onTablet) ? fullHeight*0.32*0.725 : fullHeight*0.305*0.725}
                                    buttonHeight={(onTablet) ? fullHeight*0.06 : (Platform.OS == 'ios') ? fullHeight*0.05 : fullHeight*0.055}
                                    pxFromRight={fullWidth*0.065}
                                    buttonWidth={fullWidth*0.42}
                                    pressed={() => this.props.navigation.navigate('PATHOVERVIEW')}
                                />  
                            </View> 
                        </View>
                        <View style={{height: 5*factorRatio}}/>
                        <VerticalVideoList
                            title={'ALL LESSONS'}
                            outVideos={this.state.outVideos}
                            //getVideos={() => this.getContent()}
                            renderType={'Mapped'}
                            showFilter={true}
                            items={this.state.items}
                            imageRadius={5*factorRatio}
                            containerBorderWidth={0}
                            containerWidth={fullWidth}
                            containerHeight={(onTablet) ? fullHeight*0.15 : (
                                Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.0925
                            }
                            imageHeight={(onTablet) ? fullHeight*0.12 : (
                                Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065
                            }
                            imageWidth={fullWidth*0.26}
                        />
                    </ScrollView>
                    <NavigationBar
                        currentPage={'LESSONS'}
                    />
                </View>
                <NavigationBar
                    currentPage={'LessonsLearningPaths'}
                />
            </View>
        )
    }
}
                            
/**
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
                        style={{flex: 1, backgroundColor: 'white'}}
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
                        >
                        </View>
                        <View key={'image'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.595,
                            }]}
                        >
                            <GradientFeature
                                color={'red'}
                                opacity={1}
                                height={'50%'}
                                borderRadius={0}
                            />
                            <FastImage
                                style={{
                                    flex: 1, 
                                    alignSelf: 'stretch', 
                                    backgroundColor: 'black',
                                }}
                                source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />  
                            <NavMenuHeaders
                                pxFromTop={navPxFromTop}
                                leftHeader={'LESSONS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        parentPage: 'LESSONS',
                                        menu: 'HOME',
                                        showModalMenu: true,
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        parentPage: 'LEARNING PATHES',
                                        menu: 'LESSONS',
                                        showModalMenu: true,
                                    })
                                }}
                                rightHeader={'LEARNING PATHS'}
                                isHome={false}
                            />
                            <View key={'pianoteSVG'}
                                style={{
                                    position: 'absolute',
                                    bottom: isNotch ? fullHeight*0.175 : 
                                            (onTablet) ? fullHeight*0.195 : fullHeight*0.185,
                                    zIndex: 2,
                                    elevation: 2,
                                }}
                            >
                                <Pianote
                                    height={fullHeight*0.0325}
                                    width={fullWidth*0.35}
                                    fill={'#fb1b2f'}
                                />
                            </View>
                            <Text key={'foundations'}
                                style={{
                                    fontSize: 60*factorRatio,
                                    fontWeight:'700',
                                    color: 'white',
                                    fontFamily: 'RobotoCondensed-Regular',
                                    transform: [{scaleX: 0.7}],
                                    position: 'absolute',
                                    bottom: fullHeight*0.09,
                                    zIndex: 2,
                                    elevation: 2,
                                    textAlign: 'center',
                                }}
                            >
                                FOUNDATIONS
                            </Text>
                            <StartIcon
                                pxFromTop={(onTablet) ? fullHeight*0.505 : fullHeight*0.51}
                                buttonHeight={(onTablet) ? fullHeight*0.06 : fullHeight*0.053}
                                pxFromLeft={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
                            />
                            <MoreInfoIcon
                     d           pxFromTop={(onTablet) ? fullHeight*0.505 : fullHeight*0.51}
                                buttonHeight={(onTablet) ? fullHeight*0.06 : fullHeight*0.053}
                                pxFromRight={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('PATHOVERVIEW')}
                            />   
                        </View>
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
                                showLines={true}
                                showMultipleVideos={true}
                                items={this.state.items}
                                containerWidth={fullWidth}
                                containerHeight={(onTablet) ? fullHeight*0.155 : fullHeight*0.125}
                                containerBorderWidth={0}
                                imageHeight={(onTablet) ? fullHeight*0.125 : fullHeight*0.10}
                                imageWidth={fullWidth*0.35}
                                imageRadius={7*factorRatio}
                            />
                        </View>
                    </ScrollView>
                </View>
                
 */