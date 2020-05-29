/**
 * StudentFocusCatalog
 */
import React from 'react';
import {
    View,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class StudentFocusCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [], // videos
            outVideos: false, // if no more videos to load
            page: 0, // current page
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
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('artist'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        alignSelf: 'stretch',
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
                            currentPage={'LESSONS'}
                        />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground,}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
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
                            Student Focus
                        </Text>
                        <View style={{height: 15*factorVertical}}/>
                        <View key={'continueCourses'}
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
                                    this.props.navigation.navigate('SEEALL', {title: 'CONTINUE'})
                                }}
                                showArtist={true}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.575 : (onTablet ? 
                                    fullWidth*0.425 : fullWidth*0.55)
                                }
                                itemHeight={isNotch ? fullHeight*0.15 : fullHeight*0.175}
                            />
                        </View>
                        <View key={'pack'}
                            style={{
                                height: fullWidth*0.45*2+fullWidth*0.033,
                                width: fullWidth,
                                justifyContent: 'space-around',
                                alignContent: 'space-around',
                            }}
                        >
                            <View key={'Q&A'}
                                style={{
                                    borderRadius: 12.5*factorRatio,
                                    position: 'absolute',
                                    top: 0,
                                    right: fullWidth*0.035,
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
                                    left: fullWidth*0.035,
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
                                    right: fullWidth*0.035,
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
                                    left: fullWidth*0.035,
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
                           
                        <View style={{height: 15*factorVertical}}/>                  
                    </ScrollView>
                </View>                
                <NavigationBar
                    currentPage={''}
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
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
              
            /**
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1}}
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
                        />
                        <View key={'contentContainer'}
                            style={{
                                height: (onTablet) ? fullHeight*0.425 : fullHeight*0.375,
                                width: fullWidth,
                            }}
                        >
                            <View key={'image'}
                                style={{
                                    flex: 1,
                                    elevation: 2,
                                    backgroundColor: 'black',
                                }}
                            >
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
                                            parentPage: 'STUDENT FOCUS',
                                            menu: 'LESSONS',
                                            showModalMenu: true,
                                        })
                                    }}
                                    rightHeader={'STUDENT FOCUS'}
                                    isHome={false}
                                />
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        width: fullWidth,
                                        bottom: 40*factorVertical,
                                        zIndex: 2,
                                    }]}
                                >
                                    <StudentFocus
                                        height={45*factorRatio}
                                        width={45*factorRatio}
                                        fill={'red'}
                                    />
                                    <View style={{height: 10*factorVertical}}/>
                                    <Text
                                        style={{
                                            fontSize: 45*factorRatio,
                                            fontWeight: '700',
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Regular',
                                            textAlign: 'center',
                                        }}
                                    >
                                        STUDENT{"\n"}FOCUS
                                    </Text>
                                </View>
                                <FastImage
                                    style={{flex: 1}}
                                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                        </View>
                        <View key={'horizontalSquares'}
                            style={{
                                height: fullWidth*0.25,
                                width: fullWidth,
                                paddingLeft: 10*factorHorizontal,
                                paddingRight: 10*factorHorizontal,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignContent: 'space-around',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Bootcamps'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullWidth*0.2,
                                            width: fullWidth*0.2,
                                            borderRadius: 10*factorRatio,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/bootcamps.jpg')}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />   
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Q&A'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullWidth*0.2,
                                            width: fullWidth*0.2,
                                            borderRadius: 10*factorRatio,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/questionAnswer.jpg')}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />   
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Quick Tips'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullWidth*0.2,
                                            width: fullWidth*0.2,
                                            borderRadius: 10*factorRatio,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/quickTips.jpg')}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />   
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                     onPress={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Student Review'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullWidth*0.2,
                                            width: fullWidth*0.2,
                                            borderRadius: 10*factorRatio,
                                        }}
                                    >
                                        <FastImage
                                            style={{flex: 1, borderRadius: 10*factorRatio}}
                                            source={require('Pianote2/src/assets/img/imgs/studentReview.jpg')}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />   
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{paddingLeft: fullWidth*0.035}}>
                            <View style={{minHeight: fullHeight*0.225}}>
                                <HorizontalVideoList
                                    Title={'BOOTCAMPS'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Bootcamps'}
                                        )
                                    }}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={onTablet ? fullWidth*0.425 : fullWidth*0.42}
                                    itemHeight={onTablet ? fullHeight*0.155 : fullHeight*0.12}
                                />
                            </View>
                            <View style={{minHeight: fullHeight*0.225}}>
                                <HorizontalVideoList
                                    Title={'QUESTION & ANSWER'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Q&A'}
                                        )
                                    }}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={onTablet ? fullWidth*0.425 : fullWidth*0.42}
                                    itemHeight={onTablet ? fullHeight*0.155 : fullHeight*0.12}
                                />
                            </View>
                            <View style={{minHeight: fullHeight*0.225}}>
                                <HorizontalVideoList
                                    Title={'QUICK TIPS'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Quick Tips'}
                                        )
                                    }}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={onTablet ? fullWidth*0.425 : fullWidth*0.42}
                                    itemHeight={onTablet ? fullHeight*0.155 : fullHeight*0.12}
                                />
                            </View>
                            <View style={{minHeight: fullHeight*0.225}}>
                                <HorizontalVideoList
                                    Title={'STUDENT REVIEWS'}
                                    Description={''}
                                    seeAll={() => {
                                        this.props.navigation.navigate(
                                            'STUDENTFOCUSSHOW', 
                                            {'pack' : 'Student Review'}
                                        )
                                    }}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={onTablet ? fullWidth*0.425 : fullWidth*0.42}
                                    itemHeight={onTablet ? fullHeight*0.155 : fullHeight*0.12}
                                />
                            </View>
                        </View>
                    </ScrollView>
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
                    <NavigationBar
                        currentPage={'LESSONS'}
                    />
                </View>
            </View>
            */
        )
    }
}