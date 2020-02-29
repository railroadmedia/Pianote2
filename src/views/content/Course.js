/**
 * Course
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import { getContent } from '@musora/services';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { ScrollView } from 'react-native-gesture-handler';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class Course extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            showModalMenu: false, // show navigation menu
            showInfo: false,
            started: false, // if started lesson
            outVideos: false, // if no more videos
            page: 1, // page of content
            progress: 0.52,
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

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(i > 0) {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('artist'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        progress: (i < 7 && i > 1) ? 'check' : ((i == 7) ? 'progress':'none'),
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })

            console.log(this.state.items, ' - results')
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container2'}
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
                        <View key={'image'}
                            style={{
                                height: fullHeight*0.46,
                                width: fullWidth,
                                zIndex: 0,
                            }}
                        >
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 10*factorHorizontal,
                                    top: 40*factorVertical,
                                    height: 50,
                                    width: 50,
                                    zIndex: 5,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={25*factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View key={'contentContainer'}
                                style={{
                                    height: fullHeight*0.46,
                                    width: fullWidth,
                                    backgroundColor: 'black',
                                }}
                            >
                                <GradientFeature
                                    color={'brown'}
                                    opacity={1}
                                    height={'60%'}
                                    borderRadius={0}
                                />
                                <FastImage
                                    style={{flex: 1}}
                                    source={(this.state.started) ? 
                                        require('Pianote2/src/assets/img/imgs/JazzPiano.jpg')
                                        :
                                        require('Pianote2/src/assets/img/imgs/image-1.jpg')
                                    }
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View key={'buttons'}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: fullWidth,
                                        height: (isTablet) ? 170*factorVertical : 150*factorVertical,
                                        zIndex: 2,
                                    }}
                                >
                                    <View key={'title'}
                                        style={{
                                            height: (isTablet) ? 90*factorVertical : 80*factorVertical,
                                            alignSelf: 'stretch',  
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 28*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: '700',
                                                color: 'white',
                                                fontFamily: 'Roboto',
                                            }}
                                        >
                                            {(this.state.started) ? 
                                            'Playing The Groovy \n Groove Jazz Piano'
                                            :
                                            'The Four Pillars \n Of Improvisation'
                                            }
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 30*factorRatio,
                                                textAlign: 'center',
                                            }}
                                        >
                                            
                                        </Text>
                                    </View>
                                    <View key={'buttonRow'}
                                        style={{
                                            height: (isTablet) ? 80*factorVertical : 70*factorVertical,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View key={'plusButton'}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1,
                                            }]}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'center',
                                                    flex: 1,
                                                }}
                                            >
                                                <AntIcon
                                                    name={'plus'}
                                                    size={24.5*factorRatio}
                                                    color={'white'}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        color: 'white',
                                                        marginTop: 3*factorRatio,
                                                        fontSize: 10*factorRatio,
                                                    }}
                                                >
                                                    My List
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View key={'start'}
                                            style={{width: fullWidth*0.5}}
                                        >
                                            <View style={{flex: 1}}/>
                                            {!this.state.started && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        started: !this.state.started
                                                    })
                                                }}
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                }}
                                            >
                                                <StartIcon
                                                    pxFromTop={0}
                                                    pxFromLeft={0}
                                                    buttonWidth={fullWidth*0.5}
                                                    buttonHeight={(isTablet) ? 
                                                        fullHeight*0.065 : fullHeight*0.053
                                                    }
                                                    pressed={() => console.log('Start')}
                                                />
                                            </TouchableOpacity>
                                            )}
                                            {this.state.started && (
                                            <ContinueIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth*0.5}
                                                buttonHeight={
                                                    (isTablet) ? fullHeight*0.065 : fullHeight*0.053
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
                                                        showInfo: !this.state.showInfo
                                                    })
                                                }}
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <AntIcon
                                                    name={'infocirlceo'}
                                                    size={22*factorRatio}
                                                    color={'white'}
                                                />
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        color: 'white',
                                                        marginTop: 3*factorRatio,
                                                        fontSize: 10*factorRatio,
                                                    }}
                                                >
                                                    Info
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {this.state.showInfo && (
                        <View key={'info'}
                            style={{
                                width: fullWidth,
                                backgroundColor: '#3f070f',
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.05,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                Hanon exercises have been around forever and there is a great reason for their sticking power. Therese exercises make the perfect warm up for daily practice. They will help you to develop speed, dexterity and finer independence as well as give you a  platform to practice dynamics and articulations. Cassi walks you step by step through some of her facourite Hanon exercises in this Course and includes a variation for each exercise that will target specific technical skills.
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
                                                fontFamily: 'Roboto',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            11
                                        </Text>
                                        <Text
                                            style={{
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'Roboto',
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
                                                fontFamily: 'Roboto',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            2400
                                        </Text>
                                        <Text
                                            style={{
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'Roboto',
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
                                            this.setState({
                                                restart
                                            })
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
                                            color={'white'}
                                        />
                                        <Text
                                            style={{
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'Roboto',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            34
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{width: 15*factorRatio}}/>
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5*factorRatio}
                                            color={'white'}
                                        />
                                        <Text
                                            style={{
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'Roboto',
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
                                            color={'white'}
                                        />
                                        <Text
                                            style={{
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                color: 'white',
                                                fontFamily: 'Roboto',
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
                        {this.state.started && (
                        <View key={'progressBar'}
                            style={{
                                height: fullHeight*0.145,
                                width: fullWidth,
                            }}
                        >
                            <View key={'lessonProgress'}
                                style={{
                                    height: (isTablet) ? 
                                        fullHeight*0.25 : fullHeight*0.145,
                                    width: fullWidth,
                                }}
                            >
                                <View key={'buffer0'}
                                    style={{flex: 0.3}}
                                >
                                </View>
                                <View key={'subTitle'}
                                    style={{paddingLeft: fullWidth*0.035}}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16*factorRatio,
                                            fontWeight: '900',
                                            textAlign: 'left',
                                            fontFamily: 'RobotoCondensed-Regular',
                                            color: '#6a7475',

                                        }}
                                    >
                                        YOUR LESSON PROGRESS:
                                    </Text>
                                </View>
                                <View key={'buffer1'}
                                    style={{flex: 0.2}}
                                >
                                </View>
                                <View key={'progressBar'}
                                    style={styles.centerContent}
                                >
                                    <View
                                        style={{
                                            height: fullHeight*0.045*factorVertical,
                                            width: '92.5%',
                                            flexDirection: 'row',
                                            borderRadius: 100*factorRatio,
                                            backgroundColor: '#ececec',
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: fullHeight*0.045*factorVertical,
                                                width: '83%',
                                                borderRadius: 100*factorRatio,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: fullHeight*0.045*factorVertical,
                                                    width: '97%',
                                                    borderRadius: 100*factorRatio,
                                                    backgroundColor: '#ececec',
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                    paddingLeft: 5*factorHorizontal,
                                                    paddingRight: 5*factorHorizontal,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        height: fullHeight*0.035*factorVertical,
                                                        width: fullWidth*0.1 + fullWidth*0.635*this.state.progress,
                                                        borderRadius: 100*factorRatio,
                                                        backgroundColor: '#7F8C8D',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 14*factorRatio,
                                                            paddingRight: 10*factorHorizontal,
                                                            fontWeight: '700',
                                                            fontFamily: 'Roboto',
                                                            textAlign: 'right',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {this.state.progress*100}%
                                                    </Text>
                                                </View>
                                            </View>    
                                        </View>
                                        <View
                                            style={[
                                                styles.centerContent, {
                                                height: fullHeight*0.05*factorVertical,
                                                width: '15%',
                                                alignSelf: 'stretch'
                                            }]}
                                        >
                                            <View 
                                                style={{
                                                    width: fullWidth*0.1,
                                                    height: fullHeight*0.05*factorVertical,
                                                }}
                                            >
                                                <View style={{flex: 0.5}}/>
                                                <View style={[styles.centerContent]}>
                                                    <IonIcon
                                                        name={'ios-trophy'}
                                                        size={16*factorRatio}
                                                        color={'#7F8C8D'}
                                                    />
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#7F8C8D',
                                                        fontWeight: '700',
                                                        textAlign: 'center',
                                                        fontSize: 10*factorRatio,
                                                    }}
                                                >
                                                    250 XP
                                                </Text>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View key={'buffer2'}
                                    style={{flex: 0.155}}
                                >
                                </View>
                            </View>
                        </View>
                        )}
                        <VerticalVideoList
                            outVideos={this.state.outVideos}
                            showNextVideo={false}
                            fetchVideos={() => this.getContent()}
                            items={this.state.items}
                            containerWidth={fullWidth}
                            containerHeight={(isTablet) ? fullHeight*0.15 : fullHeight*0.09}
                            imageHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.0625}
                            imageWidth={fullWidth*0.22}
                            imageRadius={5*factorRatio}
                            renderType={'Mapped'}
                        />
                    </ScrollView>
                    <Modal key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
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