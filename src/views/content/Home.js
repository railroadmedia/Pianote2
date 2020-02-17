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
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
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

        console.log(response, error)

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        items = []
        for(i in newContent) {
            items.push({
                title: newContent[i].getField('title'),
                artist: newContent[i].getField('artist'),
                thumbnail: newContent[i].getData('thumbnail_url'),
            })
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
                        height: fullHeight, 
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
                                }}
                            >
                            </View>
                            <View key={'ImageAndButtons'}
                                style={{height: fullHeight*0.595}}
                            >
                                <View key={'pianoteIcon'}
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        bottom: fullHeight*0.195,
                                        width: fullWidth,
                                        zIndex: 3,
                                    }]}
                                >
                                    <Pianote
                                        height={fullHeight*0.0325}
                                        width={fullWidth*0.35}
                                        fill={'#fb1b2f'}
                                    />
                                </View>
                                <View key={'foundationsWord'}
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        bottom: fullHeight*0.115,
                                        width: fullWidth,
                                        zIndex: 3,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 60*factorRatio,
                                            fontWeight: '700',
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Regular',
                                            transform: [{ scaleX: 0.7}],
                                        }}
                                    >
                                        FOUNDATIONS
                                    </Text>
                                </View>
                                <GradientFeature
                                    color={'red'}
                                    opacity={1}
                                    height={'50%'}
                                    borderRadius={12.5*factorRatio}
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
                                <StartIcon
                                    pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.49}
                                    pxFromLeft={fullWidth*0.065}
                                    buttonWidth={fullWidth*0.42}
                                    buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                    pressed={() => {
                                        this.props.navigation.navigate('VIDEOPLAYER')
                                    }}
                                />
                                <MoreInfoIcon
                                    pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.49}
                                    pxFromRight={fullWidth*0.065}
                                    buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                    buttonWidth={fullWidth*0.42}
                                    pressed={() => {
                                        this.props.navigation.navigate('PATHOVERVIEW')
                                    }}
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
                                    pxFromTop={37.5*factorRatio}
                                    leftHeader={'LESSONS'}
                                    rightHeader={'ALL TYPES'}
                                    isHome={true}
                                />
                            </View>
                            <View key={'contentLists'}>
                                <View style={{height: 5*factorRatio}}/>
                                <View key={'inProgress'}
                                    style={{
                                        height: fullHeight*0.3,
                                        paddingLeft: 20*factorHorizontal,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <HorizontalVideoList
                                        items={this.state.inProgress}
                                        Title={'IN PROGRESS'}
                                        seeAllRoute={'PACKUSER'}
                                        itemWidth={fullWidth*0.6}
                                        itemHeight={fullHeight*0.155}
                                        showArtist={true}
                                    />
                                </View>
                                <View style={{height: 15*factorRatio}}/>
                                <View key={'newLessons'}
                                style={{
                                    width: fullWidth,
                                    paddingLeft: fullWidth*0.035,
                                    paddingRight: fullWidth*0.035,
                                    backgroundColor: 'white',
                                }}
                            >
                                <FullScreenVideoList
                                    items={this.state.newLessons}
                                    showArtist={true}
                                    Title={'NEW LESSONS'}
                                    isHorizontal={false}
                                    seeAllRoute={'PACKUSER'}
                                    itemWidth={fullWidth*0.93}
                                    itemHeight={fullHeight*0.245}
                                />
                            </View>
                            </View>
                        </ScrollView>
                    </View>
                    <NavigationBar
                        profileImage={this.state.profileImage}
                        currentPage={'HOME'}
                    />
                </View>
            </View>
        )
    }
}