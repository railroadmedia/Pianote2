/**
 * SeeAll
 */
import React from 'react';
import { 
    View, 
    Text,
    Animated,
    ScrollView, 
    TouchableOpacity,
} from 'react-native';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Student from 'Pianote2/src/assets/img/svgs/student.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import Graduation from 'Pianote2/src/assets/img/svgs/courses.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';
import FilterIcon from 'Pianote2/src/assets/img/svgs/filters-selected.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class SeeAll extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.navigation.state.params.data,
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
            filterClicked: false,
        }
    }


    async componentDidMount() {
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
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View 
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch'
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: isNotch ? 7.5*factorVertical : 0,
                            }}
                        />
                        <View style={{height:  (Platform.OS == 'android') ? fullHeight*0.02 : fullHeight*0.04}}/>
                        <View key={'recentSearches'}
                            style={[
                                styles.centerContent, {
                                height: + (Platform.OS == 'android') ? fullHeight*0.065 : fullHeight*0.055,
                                flexDirection: 'row',
                                borderBottomWidth: 1*factorRatio,
                                borderBottomColor: '#ececec',
                                paddingBottom: fullHeight*0.015,
                            }]}
                        >
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 15*factorHorizontal,
                                    width: 50*factorRatio,
                                    zIndex: 10,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.goBack()}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={25*factorRatio}
                                        color={'grey'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={{
                                    fontWeight: '700',
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 22*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                {this.state.title}
                            </Text>
                            <View
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    right: fullWidth*0.05,
                                    flexDirection: 'row',
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            showFilters: !this.state.showFilters
                                        })
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                        height: 40*factorRatio,
                                        width: 40*factorRatio,
                                        borderRadius: 200,
                                    }]}
                                >
                                    <FilterIcon
                                        fill={(
                                            this.state.showFilters) ? 'red' : 'white'
                                        }
                                        height={40*factorRatio}
                                        width={40*factorRatio}
                                    />
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            position: 'absolute',
                                            zIndex: 5,
                                            height: 40*factorRatio,
                                            width: 40*factorRatio,
                                            borderRadius: 200,
                                            transform: [{ rotate: '90deg'}],
                                        }]}
                                    >
                                        <IonIcon 
                                            size={20*factorRatio}
                                            name={'md-options'}
                                            color={(
                                                this.state.showFilters
                                            ) ? 'white' : '#c2c2c2'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {this.state.showFilters && (
                        <Animated.View key={'filterOptions'} 
                            style={{
                                height: fullHeight*0.225, 
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
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 40*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: (
                                                            (this.state.LearningPath) ? '#fb1b2f' : 'black'
                                                        ),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                LearningPath: !this.state.LearningPath
                                                            })
                                                        }}
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
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontSize: 14*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'OpenSans-Regular',
                                                            }}
                                                        >
                                                            LEARNING PATHS
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
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
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: (
                                                            (this.state.Courses) ? '#fb1b2f' : 'black'
                                                        ),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                Courses: !this.state.Courses
                                                            })
                                                        }}
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
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontSize: 14*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'OpenSans-Regular',
                                                            }}
                                                        >
                                                            COURSES
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
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
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: (
                                                            (this.state.StudentFocus) ? '#fb1b2f' : 'black'
                                                        ),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                StudentFocus: !this.state.StudentFocus
                                                            })
                                                        }}
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
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontSize: 14*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'OpenSans-Regular',
                                                            }}
                                                        >
                                                            STUDENT FOCUS
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
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
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '80%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: (
                                                            (this.state.Songs) ? '#fb1b2f' : 'black'
                                                        ),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                Songs: !this.state.Songs
                                                            })
                                                        }}
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
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontSize: 14*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                fontFamily: 'OpenSans-Regular',
                                                            }}
                                                        >
                                                            SONGS
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
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
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            Songs: false,
                                            StudentFocus: false,
                                            Courses: false,
                                            LearningPath: false,
                                        })
                                    }}
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
                                            fontFamily: 'OpenSans-Regular',
                                        }]}
                                    >
                                        <Text
                                            style={[
                                                styles.centerContent, {
                                                fontSize: 14*factorRatio,
                                                color: 'grey',
                                                textAlign: 'right',
                                                fontWeight: '700',
                                                fontFamily: 'OpenSans-Regular',
                                            }]}
                                        >
                                            x </Text>
                                        CLEAR FILTERS 
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                            </View>
                        </Animated.View>
                        )}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{flex: 0.9, backgroundColor: 'white'}}
                        >
                            <VerticalVideoList
                                outVideos={this.state.outVideos}
                                getVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                items={this.state.items}
                                imageRadius={10*factorRatio}
                                containerBorderWidth={1}
                                containerWidth={fullWidth}
                                containerHeight={(onTablet) ? fullHeight*0.15 : (
                                    Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.09
                                }
                                imageHeight={(onTablet) ? fullHeight*0.12 : (
                                    Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.0625
                                }
                                imageWidth={fullWidth*0.26}
                            />
                        </ScrollView>
                    </View>
                    <NavigationBar
                        currentPage={'SEEALL'}
                    />
                </View>
            </View>
        )
    }
}