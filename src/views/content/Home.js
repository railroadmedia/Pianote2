/**
 * Home
 */
import React from 'react';
import { 
    View, 
    Text, 
    ScrollView,
} from 'react-native';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';
import FullScreenVideoList from 'Pianote2/src/components/FullScreenVideoList.js';

export default class Home extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
           inProgress: [],
           newLessons: [],
           profileImage: '',
        }
    }  


    componentDidMount = async () => {
        profileImage = await AsyncStorage.getItem('profileImage')
        await this.setState({profileImage})

        const { response, error } = await getContent({
            brand:'pianote',
            limit: '15',
            page: '1',
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
            inProgress: items,
            newLessons: items,
        })
    }


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch',
                        backgroundColor: 'black',
                    }}
                >
                    <View key={'contentContainer'} 
                        style={{flex: 1}}
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
                                    zIndex: 10,
                                    elevation: 10,
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
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />  
                                <NavMenuHeaders
                                    buttonLeft={() => {
                                        this.props.navigation.navigate('LESSONS')
                                    }}
                                    buttonMiddle={() => {
                                        this.props.navigation.navigate('PACKS')
                                    }}
                                    buttonRight={() => {
                                        this.props.navigation.navigate('MYLIST')
                                    }}
                                    pxFromTop={navPxFromTop}
                                    leftHeader={'LESSONS'}
                                    rightHeader={'ALL TYPES'}
                                    isHome={true}
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
                                    pxFromTop={(onTablet) ? fullHeight*0.505 : fullHeight*0.51}
                                    buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                    pxFromRight={fullWidth*0.065}
                                    buttonWidth={fullWidth*0.42}
                                    pressed={() => this.props.navigation.navigate('LESSONS')}
                                />   
                            </View>
                            <View key={'contentLists'}>
                                <View style={{height: (Platform.OS == 'ios') ? 5*factorVertical : 5*factorVertical}}/>
                                <View key={'inProgress'}
                                    style={{
                                        height: fullHeight*0.3,
                                        paddingLeft: 15*factorHorizontal,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <HorizontalVideoList
                                        items={this.state.inProgress}
                                        Title={'IN PROGRESS'}
                                        Description={''}
                                        seeAll={() => {
                                            this.props.navigation.navigate(
                                                'SEEALL', {data: 'In Progress'}
                                            )
                                        }}
                                        itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? 
                                                fullWidth*0.425 : fullWidth*0.55)
                                        }
                                        itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                                        showArtist={true}
                                    />
                                </View>
                                <View style={{height: 5*factorVertical}}/>
                                <View key={'newLessons'}
                                    style={{
                                        width: fullWidth,
                                        paddingLeft: 15*factorHorizontal,
                                        paddingRight: 15*factorHorizontal,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <FullScreenVideoList
                                        items={this.state.newLessons}
                                        showArtist={true}
                                        Title={'NEW LESSONS'}
                                        isHorizontal={false}
                                        seeAll={() => {
                                            this.props.navigation.navigate(
                                                'SEEALL', {data: 'New Lessons'}
                                            )
                                        }}
                                        itemWidth={fullWidth*0.93}
                                        itemHeight={onTablet ? fullHeight*0.21*factorHorizontal : (
                                            Platform.OS == 'ios') ? fullHeight*0.245*factorHorizontal :
                                            fullHeight*0.325*factorHorizontal
                                        }
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }
}