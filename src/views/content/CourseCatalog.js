/**
 * CourseCatalog
 */
import React from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Topic from 'Pianote2/src/assets/img/svgs/topics.svg';
import Levels from 'Pianote2/src/assets/img/svgs/levels.svg';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import Graduation from 'Pianote2/src/assets/img/svgs/courses.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class CourseCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            filterClicked: false, // clicked red button center bottom of image
            filterSize: new Animated.Value(fullHeight*0.225), // shows hidden filters
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
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
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625,
                        alignSelf: 'stretch'
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
                        <View key={'header'}
                            style={{
                                zIndex: 2
                            }}
                        >
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
                                leftHeader={'LESSONS'}
                                rightHeader={'COURSES'}
                                isHome={false}
                            />
                        </View>
                        <View key={'filtericon'}
                            style={{
                                position: 'absolute',
                                top: fullHeight*0.275,
                                left: 0,
                                width: fullWidth,
                                zIndex: 2,
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View key={'filter'}
                                style={[
                                    styles.centerContent, {
                                    height: 45*factorRatio,
                                    width: 45*factorRatio,
                                    backgroundColor: (this.state.filterClicked) ? 
                                        '#fb1b2f' : 'transparent',
                                    borderRadius: 50,
                                    borderWidth: 2.5*factorRatio,
                                    borderColor: '#fb1b2f', 
                                    transform: [{ rotate: '90deg' }],
                                }]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.centerContent, {
                                        height: 45*factorRatio,
                                        width: 45*factorRatio,
                                    }]}
                                    onPress={() => this.pressFilters()}
                                >
                                    <Ionicon 
                                        size={25*factorRatio}
                                        name={'md-options'}
                                        color={(this.state.filterClicked) ? 'white':'#fb1b2f'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View key={'image'}
                            style={{
                                height: fullHeight*0.36,
                                width: fullWidth,
                            }}
                        >
                            <View key={'courses'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    height: '100%',
                                    width: '100%',
                                    
                                }]}
                            >
                                <Graduation
                                    height={50*factorRatio}
                                    width={50*factorRatio}
                                    fill={'#fb1b2f'}
                                />
                                <Text
                                    style={{
                                        fontSize: 40*factorRatio,
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        color: 'white',
                                    }}
                                >
                                    COURSES
                                </Text>
                            </View>
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>
                        <Animated.View key={'filterOptions'} 
                            style={{
                                height: this.state.filterSize, 
                                width: fullWidth,
                                paddingTop: 2.5*factorRatio,
                            }}
                        >
                            <View key={'content'}
                                style={{
                                    flex: 1,
                                }}
                            >
                                <View key={'upper'}
                                    style={{
                                        flex: 0.5,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'level'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}></View>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}></View>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 40*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {}}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Levels
                                                            height={12.5*factorRatio}
                                                            width={12.5*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            LEVEL
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}></View>
                                            </View>
                                            <View style={{flex: 1}}></View>
                                        </View>
                                    </View>
                                    <View key={'instructor'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}></View>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}></View>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {}}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <FontIcon
                                                            name={'user'}
                                                            size={17.5*factorRatio}
                                                            color={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            INSTRUCTOR
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}></View>
                                            </View>
                                            <View style={{flex: 1}}></View>
                                        </View>
                                    </View>
                                </View>
                                <View key={'lower'}
                                    style={{
                                        flex: 0.5,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'topic'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}></View>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}></View>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {}}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Topic
                                                            height={18*factorRatio}
                                                            width={18*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            TOPIC
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}></View>
                                            </View>
                                            <View style={{flex: 1}}></View>
                                        </View>
                                    </View>
                                    <View key={'progress'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}></View>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}></View>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {}}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Progress
                                                            height={17*factorRatio}
                                                            width={17*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            PROGRESS
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}></View>
                                            </View>
                                            <View style={{flex: 1}}></View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View key={'clear'}
                                style={{
                                    height: fullHeight*0.075,
                                    backgroundColor: 'white',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <Text
                                        style={[
                                            styles.centerContent, {
                                            fontSize: 14*factorRatio,
                                            color: 'grey',
                                            fontFamily: 'Roboto',
                                            marginRight: 0.5,
                                            textAlign: 'center',
                                            fontWeight: '700',
                                        }]}
                                    >
                                            <Text
                                            style={[
                                                styles.centerContent, {
                                                fontSize: 14*factorRatio,
                                                color: 'grey',
                                                fontFamily: 'Roboto',
                                                textAlign: 'right',
                                                fontWeight: '700',
                                            }]}
                                        >
                                            x </Text>
                                        CLEAR FILTERS 
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}></View>
                            </View>
                        </Animated.View>
                        <VerticalVideoList
                            outVideos={this.state.outVideos}
                            getVideos={() => this.getContent()}
                            renderType={'Mapped'}
                            items={this.state.items}
                            imageRadius={10*factorRatio}
                            containerBorderWidth={1}
                            containerWidth={fullWidth}
                            containerHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.09}
                            imageHeight={(isTablet) ? fullHeight*0.15 : fullHeight*0.07}
                            imageWidth={fullWidth*0.26}
                        />
                    </ScrollView>
                </View>
                
                <NavigationBar
                    currentPage={'COURSECATALOG'}
                />
            </View>
        )
    }
}