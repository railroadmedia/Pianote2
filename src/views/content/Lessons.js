/**
 * Lessons
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
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class Lessons extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            progressLessons: [],
            newLessons: [],
            allLessons: [],
            outVideos: false, 
            page: 0,
            showModalMenu: false, // show navigation menu
            lessonsStarted: true,
            profileImage: '',
            xp: '', // user's XP
            rank: '', // user's level
            isLoading: true,
        }
    }


    componentDidMount = async () => {
        email = await AsyncStorage.getItem('email')
        profileURI = await AsyncStorage.getItem('profileURI')

        await fetch('http://127.0.0.1:5000/accountDetails', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    xp: response.XP,
                    rank: response.rank,
                    profileImage: profileURI,
                    lessonsStarted: (response.lessonsStarted == 1) ? true : false,
                })
            })
            .catch((error) => {
                console.log('API Error: ', error)
            })    
        
        await this.getProgressLessons()
        await this.getNewLessons()
        //await this.getAllLessons()
        await this.setState({isLoading: false})
    }


    async getProgressLessons() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                required_user_states: ['started'],
                included_types: ['course'],
            });

            console.log('lessons in progress: ', response)

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
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            this.setState({
                progressLessons: [...this.state.progressLessons, ...items],
                lessonsStarted: (items.length > 0) ? true : false,
            })

        }
    }


    async getNewLessons() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                //required_user_states: ['started'],
                included_types:['course'],
            });

            console.log(response, 'response')

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
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            console.log(newContent, 'hello')
            
            this.setState({
                newLessons: [...this.state.newLessons, ...items],
            })

        }
    }    


    async getAllLessons() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types: ['song'],
            });

            const newContent = await response.data.data.map((data) => {
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
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            await this.setState({
                allLessons: [...this.state.allLessons, ...items],
            })

        }
    }


    changeXP = (num) => {
        if(num !== '') {
            num = Number(num)
            if(num < 10000) {
                num = num.toString()
                return num
            } else {
                num = (num/1000).toFixed(1).toString()
                num = num + 'k'
                return num
            }
        }
    }


    render() {
        return (
            <View styles={styles.container}>
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
                        currentPage={'LESSONS'}
                        parentPage={'LESSONS'}
                    /> 
                </View>
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
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
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
                                    pressed={() => {
                                        this.props.navigation.navigate('VIDEOPLAYER', {

                                        })
                                    }}
                                />
                                <MoreInfoIcon
                                    pxFromTop={(onTablet) ? fullHeight*0.32*0.725 : fullHeight*0.305*0.725}
                                    buttonHeight={(onTablet) ? fullHeight*0.06 : (Platform.OS == 'ios') ? fullHeight*0.05 : fullHeight*0.055}
                                    pxFromRight={fullWidth*0.065}
                                    buttonWidth={fullWidth*0.42}
                                    pressed={() => this.props.navigation.navigate('FOUNDATIONS')}
                                />  
                            </View> 
                        </View>
                        <View key={'profile'}
                            style={{
                                borderTopColor: colors.secondBackground,
                                borderTopWidth: 0.25,
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25,
                                height: fullHeight*0.1,
                                paddingTop: 10*factorVertical,
                                paddingBottom: 10*factorVertical,
                                backgroundColor: colors.mainBackground,
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent, {
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignSelf: 'stretch',
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={{
                                            height: fullHeight*0.075,
                                            width: fullHeight*0.075,
                                            borderRadius: 100,
                                            backgroundColor: colors.secondBackground,
                                            alignSelf: 'stretch',
                                            borderWidth: 3*factorRatio,
                                            borderColor: colors.secondBackground,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <FastImage
                                                style={{
                                                    flex: 1, 
                                                    borderRadius: 100, 
                                                    backgroundColor: colors.secondBackground,
                                                }}
                                                source={{uri: this.state.profileImage}}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View
                                style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    alignSelf: 'stretch',
                                }}
                            >
                                <View style={{flex: 0.5}}/>
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View>
                                        <Text
                                            style={{
                                                color: colors.pianoteRed,
                                                fontSize: 12*factorRatio,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            XP
                                        </Text>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 24*factorRatio,
                                                fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {this.changeXP(this.state.xp)}
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View>
                                        <Text
                                            style={{
                                                color: colors.pianoteRed,
                                                fontSize: 12*factorRatio,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            RANK
                                        </Text>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 24*factorRatio,
                                                fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {this.state.rank}
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                        </View>
                        
                        {!this.state.isLoading && (
                        <View>
                            {(this.state.lessonsStarted && 
                            <View key={'progressCourses'}
                                style={{
                                    minHeight: fullHeight*0.225,
                                    paddingLeft: fullWidth*0.035,
                                    backgroundColor: colors.mainBackground,
                                }}
                            >
                                <HorizontalVideoList
                                    Title={'CONTINUE'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate('SEEALL', {title: 'Continue'})
                                    }}
                                    showArtist={true}
                                    showType={true}
                                    items={this.state.progressLessons}
                                    forceSquareThumbs={false}
                                    itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? 
                                        fullWidth*0.425 : fullWidth*0.55)
                                    }
                                    itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                                />
                            </View>
                            )}
                            <View key={'newLessons'}
                                style={{
                                    minHeight: fullHeight*0.225,
                                    paddingLeft: fullWidth*0.035,
                                    backgroundColor: colors.mainBackground,
                                }}
                            >
                                <HorizontalVideoList
                                    Title={'NEW LESSONS'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate('COURSECATALOG')
                                    }}
                                    showArtist={true}
                                    showType={true}
                                    items={this.state.newLessons}
                                    forceSquareThumbs={false}
                                    itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? 
                                        fullWidth*0.425 : fullWidth*0.55)
                                    }
                                    itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                                />
                            </View>
                            <View style={{height: 5*factorRatio}}/>
                            <VerticalVideoList
                                title={'ALL LESSONS'}
                                outVideos={this.state.outVideos}
                                //getVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                type={'LESSONS'}
                                showFilter={true}
                                showType={true}
                                showArtist={true}
                                items={this.state.newLessons}
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
                        </View>
                        )}
                    </ScrollView>
                    <NavigationBar
                        currentPage={'LESSONS'}
                    />
                </View>
            </View>
        )
    }
}