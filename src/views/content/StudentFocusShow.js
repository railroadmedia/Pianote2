/**
 * StudentFocusShow
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import SubscribeIcon from 'Pianote2/src/components/SubscribeIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import { ScrollView } from 'react-native-gesture-handler';

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
            showModalMenu: false, // show navigation menu
            showStarted: false,
            title: null,
            page: 1, // page of content
            outVideos: false, // if no more videos
            items: [], // hello
        }
    }


    componentDidMount() {
        this.setState({
            pack: this.props.navigation.state.params.pack,
            title: this.props.navigation.state.params.pack,
        })
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
            
            console.log( 'response :', response, 'error : ', error)

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
                        <View key={'imageContainer'}
                            style={{
                                height: fullHeight*0.58,
                                width: fullWidth,
                            }}
                        >
                            <View key={'bootcampImage'}
                                style={[
                                    styles.centerContent, {
                                    bottom: fullHeight*0.175,
                                    position: 'absolute',
                                    width: fullWidth,
                                    zIndex: 2,
                                }]}
                            >
                                <FastImage
                                    style={{
                                        height: fullWidth*0.65,
                                        width: fullWidth*0.65,
                                        zIndex: 2,
                                        borderRadius: 10*factorRatio,
                                        borderColor: 'white',
                                        borderWidth: 2,
                                    }}
                                    source={packDict[this.state.pack]}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
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
                                    flex: 1,
                                    backgroundColor: 'black',
                                }}
                            >
                                <FastImage
                                    style={{flex: 1}}
                                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
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
                                        <View style={{flex: 1,}}></View>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 30*factorRatio,
                                                textAlign: 'center',
                                                fontFamily: 'Roboto',
                                                fontWeight: '700',
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.title}
                                        </Text>
                                        <View style={{flex: 1}}></View>
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
                                                        fontSize: 12*factorRatio,
                                                    }}
                                                >
                                                    My List
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View key={'start'}
                                            style={{width: fullWidth*0.5}}
                                        >
                                            <View style={{flex: 1}}></View>
                                            {!this.state.showStarted && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        showStarted: !this.state.showStarted
                                                    })
                                                }}
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                }}
                                            >
                                                <SubscribeIcon
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
                                            {this.state.showStarted && (
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
                                            <View style={{flex: 1}}></View>
                                        </View>
                                        <View key={'infoButton'}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1,
                                            }]}
                                        >
                                            <TouchableOpacity
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
                                                        fontSize: 12*factorRatio,
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
                        <VerticalVideoList
                            outVideos={this.state.outVideos}
                            fetchVideos={() => this.getContent()}
                            items={this.state.items}
                            containerWidth={fullWidth}
                            imageRadius={5*factorRatio}
                            containerHeight={(isTablet) ? fullHeight*0.15 : fullHeight*0.09}
                            imageHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.07}
                            renderType={'Mapped'}
                            imageWidth={fullWidth*0.26}
                        />
                    </ScrollView>
                    <NavigationBar
                        currentPage={'NONE'}
                    />
                </View>
            </View>
        )
    }
}