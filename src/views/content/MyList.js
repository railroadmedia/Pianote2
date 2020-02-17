/**
 * MyList
 */
import React from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import Ionicon from 'react-native-vector-icons/Ionicons';
import List from 'Pianote2/src/assets/img/svgs/myList.svg';
import Student from 'Pianote2/src/assets/img/svgs/student.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import Graduation from 'Pianote2/src/assets/img/svgs/courses.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class MyList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            filterClicked: false, // clicked red button center bottom of image
            filterSize: new Animated.Value(fullHeight*0.225), // shows hidden filters
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
            parentPageNav: 'MY LIST',
            menu: 'HOME',
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
                        <View key={'header'}
                            style={{zIndex: 2}}
                        >
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
                                leftHeader={'MY LIST'}
                                rightHeader={'ALL LESSONS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        showModalMenu: true,
                                        parentPage: 'MY LIST',
                                        menu: 'HOME',
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        showModalMenu: true,
                                        parentPage: 'ALL LESSONS',
                                        menu: 'MY LIST',
                                    })
                                }}
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
                                <List
                                    height={37.5*factorRatio}
                                    width={37.5*factorRatio}
                                    fill={'#fb1b2f'}
                                />
                                <Text
                                    style={{
                                        fontSize: 40*factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    MY LIST
                                </Text>
                            </View>
                            <FastImage
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: 'black',
                                }}
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
                                                        <LearningPaths
                                                            height={15*factorRatio}
                                                            width={15*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                            }}
                                                        >
                                                            LEARNING PATHS
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
                                                        <Graduation
                                                            height={20*factorRatio}
                                                            width={20*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                            }}
                                                        >
                                                            COURSES
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
                                                        <Student
                                                            height={15*factorRatio}
                                                            width={15*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                            }}
                                                        >
                                                            STUDENT FOCUS
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
                                                        <Songs
                                                            height={17.5*factorRatio}
                                                            width={17.5*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}></View>
                                                        <Text
                                                            style={{
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'Roboto',
                                                            }}
                                                        >
                                                            SONGS
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
                                            marginRight: 0.5,
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            fontFamily: 'Roboto',
                                        }]}
                                    >
                                        <Text
                                            style={[
                                                styles.centerContent, {
                                                fontSize: 14*factorRatio,
                                                color: 'grey',
                                                textAlign: 'right',
                                                fontWeight: '700',
                                                fontFamily: 'Roboto',
                                            }]}
                                        >
                                            x </Text>
                                        CLEAR FILTERS 
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}></View>
                            </View>
                        </Animated.View>
               
                        <View key={'addedList'}
                            style={{
                                height: fullHeight*0.25,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'ADDED TO LIST'}
                                Description={''}
                                seeAllRoute={'PACKUSER'}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                        <View key={'progressList'}
                            style={{
                                height: fullHeight*0.25,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'IN PROGRESS'}
                                Description={''}
                                seeAllRoute={'PACKUSER'}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                        <View key={'completedList'}
                            style={{
                                height: fullHeight*0.25,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'COMPLETED'}
                                Description={''}
                                seeAllRoute={'PACKUSER'}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
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
                    currentPage={'MyList'}
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
        )
    }
}