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
            outVideos: false, // if no more videos to load
            page: 0,
            parentPage: 'LESSONS',
            menu: 'HOME',
        }
    }


    componentDidMount() {
        this.getVideos()
    }


    async getVideos() {
        if(this.state.outVideos == false) {
            
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            if(response.data.data.length == 0) {
                this.setState({outVideos: true})
            }

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
                courses: [...this.state.courses, ...items],
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
                        height: fullHeight, 
                        alignSelf: 'stretch'
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
                                zIndex: 10,
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
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
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
                                        parentPage: 'ALL TYPES',
                                        menu: 'LESSONS',
                                        showModalMenu: true,
                                    })
                                }}
                                rightHeader={'ALL TYPES'}
                                isHome={false}
                            />
                            <View key={'pianoteSVG'}
                                style={{
                                    position: 'absolute',
                                    bottom: fullHeight*0.175,
                                    zIndex: 2,
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
                                    transform: [{ scaleX: 0.7}],
                                    position: 'absolute',
                                    bottom: fullHeight*0.09,
                                    zIndex: 2,
                                    textAlign: 'center',
                                }}
                            >
                                FOUNDATIONS
                            </Text>
                            <StartIcon
                                pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.51}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                pxFromLeft={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
                            />
                            <MoreInfoIcon
                                pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.51}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                pxFromRight={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('PATHOVERVIEW')}
                            />   
                        </View>
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'courses'}
                            style={{
                                height: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'COURSES'}
                                Description={''}
                                seeAllRoute={'PACKUSER'}
                                showArtist={false}
                                items={this.state.courses}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                        <View key={'songs'}
                            style={{
                                height: fullHeight*0.27,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'SONGS'}
                                Description={''}
                                seeAllRoute={'PACKUSER'}
                                showArtist={false}
                                items={this.state.songs}
                                forceSquareThumbs={false}
                                itemWidth={fullHeight*0.15}
                                itemHeight={fullHeight*0.15}
                            />
                        </View>
                        <View key={'packs'}
                            style={{
                                height: fullHeight*0.55,
                                width: fullWidth,
                                paddingLeft: fullWidth*0.035,
                                paddingRight: fullWidth*0.035,
                            }}
                        >
                            <View key={'textTitle'}
                                style={{height: fullHeight*0.065,}}
                            >
                                <View style={{flex: 1}}></View>
                                <Text key={'studentFocusTitle'}
                                    style={{
                                        textAlign:'left', 
                                        fontWeight:'bold', 
                                        fontFamily:'avenir next',
                                        fontSize: 18*factorRatio,
                                    }}
                                >
                                    STUDENT FOCUS
                                </Text>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'pack'}
                                style={{
                                    height: fullHeight*0.43,
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
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
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