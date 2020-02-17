/**
 * PathOverview
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
} from 'react-native';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class PathOverview extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            outVideos: false,
            items: [],
            page: 0,
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
                    progress: (i > 700) ? 'check': ((i == 7) ? 'progress':'none')
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
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625,
                        width: fullWidth,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: 'white'}}
                    >
                        <View key={'imageContainer'}
                            style={{height: fullHeight*0.595}}
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
                            <View key={'pianoteIcon'}
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        bottom: fullHeight*0.255,
                                        width: fullWidth,
                                        zIndex: 3,
                                    }]}
                                >
                                    <Pianote
                                        height={fullHeight*0.0325}
                                        width={fullWidth*0.35}
                                        fill={'#fb1b2f'}
                                    />
                                </View>
                            <View key={'PathOverviewWord'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    bottom: fullHeight*0.18,
                                    width: fullWidth,
                                    zIndex: 3,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontSize: 60*factorRatio,
                                        fontWeight:'700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        transform: [{ scaleX: 0.7}],
                                    }}
                                >
                                    FOUNDATIONS
                                </Text>
                            </View>
                            <GradientFeature
                                color={'red'}
                                opacity={1}
                                height={'60%'}
                                borderRadius={0}
                            />
                            <FastImage
                                style={{flex: 1, backgroundColor: 'black'}}
                                source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View key={'message'}
                                style={{
                                    position: 'absolute',
                                    width: fullWidth,
                                    height: '100%',
                                    zIndex: 10,
                                    paddingLeft: fullWidth*0.075,
                                    paddingRight: fullWidth*0.075,
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16*factorRatio,
                                        textAlign: 'center',
                                        color: 'white',    
                                    }}
                                >
                                    This is a short message explaining what the the Drumeo Method is, how to use it, and why students houdl begin to go through it.
                                </Text>
                                <View style={{height: fullHeight*0.115}}></View>
                            </View>
                            <View key={'buttons'}
                                style={{
                                    position: 'absolute',
                                    bottom: 5*factorVertical,
                                    left: 0,
                                    width: fullWidth,
                                    height: (isTablet) ? 170*factorVertical : 150*factorVertical,
                                    zIndex: 10,
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
                                            fontSize: 25*factorRatio,
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.title}
                                    </Text>
                                    <Text
                                        numberOfLines={2}
                                        style={{
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
                                        zIndex: 11,
                                    }}
                                >
                                    <View key={'plusButton'}
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {}}
                                            style={{
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <AntIcon
                                                name={'like2'}
                                                size={24.5*factorRatio}
                                                color={'white'}
                                            />
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    marginTop: 3*factorRatio,
                                                    fontSize: 10*factorRatio,
                                                }}
                                            >
                                                34
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'start'}
                                        style={{width: fullWidth*0.5}}
                                    >
                                        <View style={{flex: 1}}></View>
                                        <StartIcon
                                            pxFromTop={0}
                                            pxFromLeft={0}
                                            buttonWidth={fullWidth*0.5}
                                            buttonHeight={(isTablet) ? 
                                                fullHeight*0.065 : fullHeight*0.053
                                            }
                                            pressed={() => {
                                                this.props.navigation.navigate('VIDEOPLAYER')
                                            }}
                                        />
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
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 10*factorHorizontal,
                                    top: 40*factorVertical,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                    zIndex: 10,
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
                                        size={27.5*factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        <View key={'buffre'}
                            style={{
                                height: 10*factorVertical
                            }}
                        >
                        </View>
                        <View key={'verticalVideoList'}
                            style={[
                                styles.centerContent, {
                                minHeight: fullHeight*0.29*0.90625,
                                justifyContent: 'space-around',
                                alignContent: 'space-around', 
                                flexDirection: 'row'
                            }]}
                        >
                            <VerticalVideoList
                                outVideos={this.state.outVideos}
                                fetchVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                showNextVideo={false}
                                showLines={true}
                                showMultipleVideos={true}
                                items={this.state.items}
                                containerWidth={fullWidth}
                                containerHeight={(isTablet) ? fullHeight*0.155 : fullHeight*0.125}
                                containerBorderWidth={0}
                                imageHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.10}
                                imageWidth={fullWidth*0.35}
                                imageRadius={7*factorRatio}
                            />
                        </View>
                    </ScrollView>
                </View>
                <NavigationBar
                    currentPage={'LessonsPathOverview'}
                />
            </View>
        )
    }
}