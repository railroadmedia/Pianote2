/**
 * StudentFocusShow
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import AsyncStorage from '@react-native-community/async-storage';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

const packDict = {
    'Bootcamps': require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
    'Q&A': require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
    'Quick Tips': require('Pianote2/src/assets/img/imgs/quickTips.jpg'),
    'Student Review': require('Pianote2/src/assets/img/imgs/studentReview.jpg'),
}

export default class StudentFocusShow extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [], // hello
            showModalMenu: false, // show navigation menu
            showStarted: false,
            showRestartCourse: false,
            outVideos: false, // if no more videos
            page: 1, // page of content
            filters: null,
            currentSort: 'Relevance',
            pack: this.props.navigation.state.params.pack,
            title: this.props.navigation.state.params.pack,
        }
    }


    componentDidMount = async () => {
        this.getContent()
    }


    restartCourse = async () => {
        email = await AsyncStorage.getItem('email')
        contentID = 0

        await fetch('http://127.0.0.1:5000/restartCourse', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, addded to my list: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            })
    }


    like = async (contentID) => {
        email = await AsyncStorage.getItem('email')
        contentID = 0

        await fetch('http://127.0.0.1:5000/like', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, liked: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            }) 
    } 


    addToMyList = async (contentID) => {
        email = await AsyncStorage.getItem('email')
        contentID = 0

        await fetch('http://127.0.0.1:5000/addToMyList', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, addded to my list: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            }) 
    } 


    async getContent() {
        // see if importing filters
        try {
            var filters = this.props.navigation.state.params.filters
            if(
                filters.instructors.length !== 0 || 
                filters.level.length !== 0 || 
                filters.progress.length !== 0 || 
                filters.topics.length !== 0
            ) {
                // if has a filter then send filters to vertical list
                this.setState({filters})
            } else {
                // if no filters selected then null
                var filters = null
            }
        } catch (error) {
            var filters = null
        }

        console.log('filters', filters)

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
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })
        }
    }


    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'STUDENTFOCUSSHOW',
            onGoBack: (filters) => {
                this.setState({
                    items: [],
                    filters: (
                        filters.instructors.length == 0 && 
                        filters.level.length == 0 && 
                        filters.progress.length == 0 && 
                        filters.topics.length == 0
                    ) ? null : filters, 
                }),
                this.getContent(),
                this.forceUpdate()
            }
        })
    }


    render() {
        return (
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
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
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
                            }}
                        />
                        <View key={'imageContainer'}
                            style={{
                                width: fullWidth,
                            }}
                        >
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    height: (Platform.OS == 'android') ?  fullHeight*0.1 : (isNotch ? fullHeight*0.12 : fullHeight*0.055),
                                    width: fullWidth,
                                    position: 'absolute',
                                    top: 0,
                                    zIndex: 5,
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 0.1}}/>
                                        <View>
                                            <View style={{flex: 1}}/>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.goBack()}
                                                style={{
                                                    paddingLeft: 10*factorRatio,
                                                    paddingRight: 10*factorRatio,
                                                }}
                                            >
                                                <EntypoIcon
                                                    name={'chevron-thin-left'}
                                                    size={25*factorRatio}
                                                    color={'white'}
                                                />
                                            </TouchableOpacity>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 22*factorRatio,
                                            fontWeight: 'bold',
                                            color: colors.mainBackground,
                                            fontFamily: 'OpenSans-Regular',
                                        }}
                                    >
                                        Filter Courses
                                    </Text>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: 20*factorVertical}}/>
                            </View>                 




                            <View key={'bootcampImage'}
                                style={[
                                    styles.centerContent, {
                                    paddingTop: fullHeight*0.1,
                                    width: fullWidth,
                                    zIndex: 2,
                                }]}
                            >
                                <FastImage
                                    style={{
                                        height: onTablet ?  fullWidth*0.45 :  (Platform.OS == 'ios') ? fullWidth*0.625 : fullWidth*0.525,
                                        width: onTablet ?  fullWidth*0.45 :  (Platform.OS == 'ios') ? fullWidth*0.625 : fullWidth*0.525,
                                        zIndex: 2,
                                        borderRadius: 10*factorRatio,
                                        borderColor: colors.thirdBackground,
                                        borderWidth: 5,
                                    }}
                                    source={packDict[this.state.pack]}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                            <View style={{height: 20*factorVertical}}/>
                            <View key={'buttons'}
                                style={{
                                    height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View key={'start'}
                                    style={{width: fullWidth*0.5}}
                                >
                                    <View style={{flex: 1}}/>
                                    {!this.state.showStarted && (
                                    <StartIcon
                                        pxFromTop={0}
                                        pxFromLeft={0}
                                        buttonWidth={fullWidth*0.5}
                                        buttonHeight={(onTablet) ? 
                                            fullHeight*0.065 : fullHeight*0.053
                                        }
                                        pressed={() => this.setState({showStarted: !this.state.showStarted})}
                                    />
                                    )}
                                    {this.state.showStarted && (
                                    <ContinueIcon
                                        pxFromTop={0}
                                        pxFromLeft={0}
                                        buttonWidth={fullWidth*0.5}
                                        buttonHeight={
                                            (onTablet) ? fullHeight*0.065 : fullHeight*0.053
                                        }
                                        pressed={() => console.log('Start')}
                                    />
                                    )}
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'infoButton'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showInfo: !this.state.showInfo,
                                            })
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={(this.state.showInfo) ? 'infocirlce':'infocirlceo'}
                                            size={22*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                marginTop: 3*factorRatio,
                                                fontSize: 13*factorRatio,
                                            }}
                                        >
                                            Info
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {this.state.showInfo && (
                        <View key={'info'}
                            style={{
                                width: fullWidth,
                                backgroundColor: colors.mainBackground,
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.05,
                            }}
                        >
                            <View style={{height: 10*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                Hanon exercises have been around forever and there is a great reason for their sticking power. Therese exercises make the perfect warm up for daily practice. They will help you to develop speed, dexterity and finer independence as well as give you a  platform to practice dynamics and articulations.
                            </Text>
                            <View key={'containStats'}>
                                <View style={{height: 10*factorVertical}}/>
                                <View key={'stats'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.22,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            11
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            LESSONS
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            48
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            MINS
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 17*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            2400
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            XP
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                                <View style={{height: 15*factorVertical}}/>
                                <View key={'buttons'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.25,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.like(0)
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <AntIcon
                                            name={'like2'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            34
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{width: 15*factorRatio}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.addToMyList(0)
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{width: 15*factorRatio}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showRestartCourse: true
                                            })
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <MaterialIcon
                                            name={'replay'}
                                            size={27.5*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            Restart
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                                <View style={{height: 30*factorVertical}}/>
                            </View>
                        </View>
                        )}
                        <View style={{height: 20*factorVertical}}/>
                        <VerticalVideoList
                            items={this.state.items}
                            title={'EPISODES'}
                            renderType={'Mapped'} // map vs flatlist
                            type={'STUDENTFOCUSSHOW'} // the type of content on page
                            showFilter={true}
                            showType={true} // show course / song by artist name
                            showArtist={true} // show artist name
                            showLength={false}
                            filters={this.state.filters} // show filter list
                            containerWidth={fullWidth}
                            imageRadius={5*factorRatio}
                            containerBorderWidth={0} // border of box
                            currentSort={this.state.currentSort} // relevance sort
                            changeSort={(sort) => { 
                                this.setState({
                                    currentSort: sort,
                                    items: [],
                                }),
                                this.getContent()
                            }} // change sort and reload videos
                            filterResults={() => this.filterResults()} 
                            containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.09}
                            imageHeight={(onTablet) ? fullHeight*0.125 : (Platform.OS == 'android') ? fullHeight*0.0925 : fullHeight*0.07}
                            imageWidth={fullWidth*0.26}
                            outVideos={this.state.outVideos}
                            //fetchVideos={() => this.getContent()}
                        />
                    </ScrollView>
                    <Modal key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                            elevation: 5,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
                                this.restartCourse(),
                                this.setState({
                                    showRestartCourse: false
                                })
                            }}
                        />
                    </Modal>
                    <NavigationBar
                        currentPage={'NONE'}
                    />
                </View>
            </View>
        )
    }
}