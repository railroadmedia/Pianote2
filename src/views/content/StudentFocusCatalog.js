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
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import StudentFocus from 'Pianote2/src/assets/img/svgs/student.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class StudentFocusCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [], // videos
            listSize: new Animated.Value(0.6), // shows hidden filters
            filterSize: new Animated.Value(0), // shows hidden filters
            filterClicked: false, // clicked red button center bottom of image
            levelChosen: false, // filter option
            instructorChosen: false, // filter option
            topicChosen: false, // filter option
            progressChosen: false, // filter option
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

            if(error) {
                console.error(error);
            } 
            
            if(response.data.data.length == 0) {
                this.setState({outVideos: true})
            }

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            console.log(newContent)

            items = []
            for(i in newContent) {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('artist'),
                    thumbnail: newContent[i].getData('thumbnail_url'),
                })
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
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
                        >
                        </View>
                        <View key={'contentContainer'}
                            style={{
                                height: fullHeight*0.36,
                                width: fullWidth,
                            }}
                        >
                            <View key={'image'}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'black',
                                }}
                            >
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
                                <View style={{zIndex: 5}}>
                                    <NavMenuHeaders
                                        pxFromTop={30*factorRatio}
                                        leftHeader={'LESSONS'}
                                        rightHeader={'STUDENT FOCUS'}
                                        isHome={false}
                                    />
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
                                height: fullHeight*0.15,
                                width: fullWidth,
                                paddingLeft: 10*factorHorizontal,
                                paddingRight: 10*factorHorizontal,
                            }}
                        >
                            <View style={{flex: 1}}></View>
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
                                            height: fullHeight*0.095,
                                            width: fullHeight*0.095,
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
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Q&A'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullHeight*0.095,
                                            width: fullHeight*0.095,
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
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Quick Tips'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullHeight*0.095,
                                            width: fullHeight*0.095,
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
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Student Review'}
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            height: fullHeight*0.095,
                                            width: fullHeight*0.095,
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
                            <View style={{flex: 1}}></View>
                        </View>
                        <View
                            style={{
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <View style={{height: fullHeight*0.25}}>
                                <HorizontalVideoList
                                    Title={'BOOTCAMPS'}
                                    Description={''}
                                    seeAllRoute={'PACKUSER'}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={fullWidth*0.42}
                                    itemHeight={fullHeight*0.115}
                                />
                            </View>
                            <View style={{height: fullHeight*0.25}}>
                                <HorizontalVideoList
                                    Title={'QUESTION & ANSWER'}
                                    Description={''}
                                    seeAllRoute={'PACKUSER'}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={fullWidth*0.42}
                                    itemHeight={fullHeight*0.115}
                                />
                            </View>
                            <View style={{height: fullHeight*0.25}}>
                                <HorizontalVideoList
                                    Title={'QUICK TIPS'}
                                    Description={''}
                                    seeAllRoute={'PACKUSER'}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={fullWidth*0.42}
                                    itemHeight={fullHeight*0.115}
                                />
                            </View>
                            <View style={{height: fullHeight*0.25}}>
                                <HorizontalVideoList
                                    Title={'STUDENT REVIEWS'}
                                    Description={''}
                                    seeAllRoute={'PACKUSER'}
                                    showArtist={false}
                                    items={this.state.items}
                                    forceSquareThumbs={false}
                                    itemWidth={fullWidth*0.42}
                                    itemHeight={fullHeight*0.115}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <NavigationBar
                        currentPage={'LESSONS'}
                    />
                </View>
            </View>
        )
    }
}