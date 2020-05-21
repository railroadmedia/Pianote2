/**
 * Lessons
 */
import React from 'react';
import { 
    View, 
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class Lessons extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            courses: [], // videos
            songs: [], // videos
            showModalMenu: false, // show navigation menu
            outVideos: false,
            page: 0,
        }
    }


    componentDidMount() {
        this.getCourses()
        this.getSongs()
    }


    async getCourses() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['course'],
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
                courses: [...this.state.courses, ...items],
                page: this.state.page + 1,
            })

        }
    }


    async getSongs() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = await response.data.data.map((data) => {
                return new ContentModel(data)
            })
            
            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: await newContent[i].getField('title'),
                        artist: await newContent[i].getField('artist'),
                        thumbnail: await newContent[i].getData('thumbnail_url'),
                    })
                }
            }

            await this.setState({
                songs: [...this.state.songs, ...items],
                page: this.state.page + 1,
            })

        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch'
                    }}
                >
                    <NavMenuHeaders
                        currentPage={'LESSONS'}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: 'white'}}
                    >
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.mainBackground,
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
                                backgroundColor: colors.mainBackground,
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
                        <View key={'profile'}
                            style={{
                                borderTopColor: colors.secondBackground,
                                borderTopWidth: 0.25,
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25,
                                height: fullHeight*0.1,
                                backgroundColor: colors.mainBackground,

                            }}
                        >

                        </View>
                        <View key={'courses'}
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
                                    this.props.navigation.navigate('COURSECATALOG')
                                }}
                                showArtist={true}
                                items={this.state.courses}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? 
                                    fullWidth*0.425 : fullWidth*0.55)
                                }
                                itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                            />
                        </View>
                        <View key={'songs'}
                            style={{
                                height: fullHeight*0.27,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'SONGS'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate('SONGCATALOG')
                                }}
                                showArtist={false}
                                items={this.state.songs}
                                forceSquareThumbs={false}
                                itemWidth={fullHeight*0.15}
                                itemHeight={fullHeight*0.15}
                            />
                        </View>
                        <View style={{height: 5*factorRatio}}/>
                        <View key={'packs'}
                            style={{
                                backgroundColor: colors.mainBackground,
                                width: fullWidth,
                                paddingLeft: fullWidth*0.035,
                                paddingRight: fullWidth*0.035,
                            }}
                        >
                            <View key={'textTitle'}
                                style={{height: fullHeight*0.065}}
                            >
                                <View style={{flex: 1}}/>
                                <Text key={'studentFocusTitle'}
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold', 
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18*factorRatio,
                                    }}
                                >
                                    STUDENT FOCUS
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'pack'}
                                style={{
                                    height: fullWidth*0.45*2+fullWidth*0.033,
                                }}
                            >
                                <View key={'Q&A'}
                                    style={{
                                        borderRadius: 12.5*factorRatio,
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                                {'pack' : 'Q&A'}
                                            )
                                        }}
                                        style={{
                                            height: fullWidth*0.45,
                                            width: fullWidth*0.45,
                                            zIndex: 10,
                                            elevation: 10,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1}}
                                            source={require('Pianote2/src/assets/img/imgs/questionAnswer.jpg')}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />  
                                    </TouchableOpacity>
                                </View>
                                <View key={'bootcamps'}
                                    style={{
                                        borderRadius: 12.5*factorRatio,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                                {'pack' : 'Bootcamps'}
                                            )
                                        }}
                                        style={{
                                            height: fullWidth*0.45,
                                            width: fullWidth*0.45,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/bootcamps.jpg')}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />   
                                    </TouchableOpacity>
                                </View>
                                <View key={'studentReviews'}
                                    style={{
                                        borderRadius: 12.5*factorRatio,
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                                {'pack' : 'Student Review'}
                                            )
                                        }}
                                        style={{
                                            height: fullWidth*0.45,
                                            width: fullWidth*0.45,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/studentReview.jpg')}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />   
                                    </TouchableOpacity>
                                </View>
                                <View key={'quicktips'}
                                    style={{
                                        borderRadius: 12.5*factorRatio,
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                                {'pack' : 'Quick Tips'}
                                            )
                                        }}
                                        style={{
                                            height: fullWidth*0.45,
                                            width: fullWidth*0.45,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/quickTips.jpg')}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />   
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: fullHeight*0.033}}/>
                        </View>
                    </ScrollView>
                    <NavigationBar
                        currentPage={'NONE'}
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