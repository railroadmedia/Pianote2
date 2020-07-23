/**
 * SinglePack
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
} from 'react-native';
import Modal from 'react-native-modal';
import { getContentChildById } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SightReading from 'Pianote2/src/assets/img/svgs/sightReadingLogo.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import FasterFingers from 'Pianote2/src/assets/img/svgs/fasterFingersLogo.svg';

export default class SinglePack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            packData: null,
            videos: [],
            pack: this.props.navigation.state.params.data,
            isAddedToList: this.props.navigation.state.params.data.isAddedToList,
            bundleID: null,
            isLoadingAll: true,
            totalLength: 0,
        }
    }


    componentDidMount = async () => {
        await this.getBundle()
        await this.getVideos()
        for(i in this.state.videos) {
            this.state.totalLength = this.state.totalLength + Number(this.state.videos[i].duration)
        }
        this.state.totalLength = Math.floor(this.state.totalLength/60).toString()
        this.setState({totalLength: this.state.totalLength})
    }


    getBundle = async () => {
        const { response, error } = await getContentChildById({
            parentId: this.state.pack.id,
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        var bundleID = newContent[0].id

        await this.setState({
            bundleID,
        })
    }


    getDuration = (newContent) => {
        if(newContent.post.fields[0].key == 'video') {
            return newContent.post.fields[0].value.fields[1].value
        } else if(newContent.post.fields[1].key == 'video') {
            return newContent.post.fields[1].value.fields[1].value
        } else if(newContent.post.fields[2].key == 'video') {
            return newContent.post.fields[2].value.fields[1].value
        }
    }


    getVideos = async () => {
        try {
            const { response, error } = await getContentChildById({
                parentId: this.state.bundleID,
            });
    
            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })
    
            items = []
            for(i in newContent) {
                console.log(newContent[i])
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0].value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                        type: newContent[i].post.type,
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        duration: this.getDuration(newContent[i]),
                        like_count: newContent[i].post.like_count,
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    })
                }
            }
    
            this.setState({
                videos: [...this.state.videos, ...items],
                isLoadingAll: false,
            })
    
        } catch (error) {
            console.log(error)
        }
    }


    like = async () => {
        this.state.pack.like_count = (this.state.pack.isLiked) ? this.state.pack.like_count - 1 : this.state.pack.like_count + 1
        this.state.pack.isLiked = !this.state.pack.isLiked
        await this.setState({pack: this.state.pack})
    }

    
    addPackToMyList = async () => {
        this.state.pack.isAddedToList = !this.state.pack.isAddedToList
        this.setState({pack: this.state.pack})
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        width: fullWidth,
                        alignSelf: 'stretch',
                        zIndex: 3, 
                        elevation: 3,
                    }}
                >
                    <ScrollView
                        style={{backgroundColor: colors.mainBackground}}
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                    >
                        <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                        <View key={'imageContainer'}
                            style={{
                                height: fullHeight*0.5,
                                zIndex: 3, 
                                elevation: 3,
                            }}
                        >           
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 7.5*factorHorizontal,
                                    top: (isNotch) ? 10*factorVertical : 10*factorVertical,
                                    height: 35*factorRatio,
                                    width: 35*factorRatio,
                                    borderRadius: 100,
                                    zIndex: 5,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 100,
                                        backgroundColor: 'black',
                                        opacity: 0.4,
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 100,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </View>                
                            <GradientFeature
                                color={'blue'}
                                opacity={1}
                                height={'70%'}
                                borderRadius={0}
                            />
                            <View key={'SVGs'}
                                style={{
                                    position: 'absolute',
                                    bottom: (onTablet) ? fullHeight*0.065/2 : fullHeight*0.053/2,
                                    zIndex: 2,
                                    elevation: 2,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                {(this.state.pack == 'SIGHT READING') && (
                                <SightReading
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={275*factorVertical}
                                />
                                )}
                                {(this.state.pack == '500 SONGS') && (
                                <Songs500
                                    height={200*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={275*factorVertical}
                                />
                                )}
                                {(this.state.pack == 'FASTER FINGERS') && (
                                <FasterFingers
                                    height={250*factorVertical + (onTablet ? 20*factorVertical : 0)}
                                    width={300*factorVertical}
                                />
                                )}
                                <View style={{flex: 1}}/>
                            </View>    
                            <FastImage
                                style={{flex: 1}}
                                source={{uri: this.state.pack.thumbnail}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View key={'buttons'}
                                style={{
                                    position: 'absolute',
                                    bottom: 10*factorRatio,
                                    left: 0,
                                    width: fullWidth,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            >
                                <View key={'buttonRow'}
                                    style={{flexDirection: 'row'}}
                                >                                   
                                    <View key={'plusButton'}
                                        style={[
                                            styles.centerContent, {
                                            flex: 1,
                                        }]}
                                    >
                                        {!this.state.pack.isAddedToList && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.addPackToMyList()
                                            }}
                                            style={{
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <AntIcon
                                                name={'plus'} 
                                                size={30*factorRatio} 
                                                color={colors.pianoteRed}
                                            />
                                        </TouchableOpacity>
                                        )}
                                        {this.state.pack.isAddedToList && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.addPackToMyList()
                                            }}
                                            style={{
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <AntIcon
                                                name={'close'} 
                                                size={30*factorRatio} 
                                                color={colors.pianoteRed}
                                            />
                                        </TouchableOpacity>    
                                        )}
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                marginTop: 3*factorRatio,
                                                fontSize: 12*factorRatio,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </View>
                                    <View key={'start'}
                                        style={{width: fullWidth*0.5}}
                                    >
                                        <View style={{flex: 1}}/>
                                        {!this.state.pack.isStarted && (
                                            <StartIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth*0.5}
                                                buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                                pressed={() => {
                                                    this.props.navigation.navigate('VIDEOPLAYER')
                                                }}
                                            />
                                        )}
                                        {this.state.pack.isStarted && (
                                        <ContinueIcon
                                            pxFromTop={0}
                                            pxFromLeft={0}
                                            buttonWidth={fullWidth*0.5}
                                            buttonHeight={
                                                (onTablet) ? fullHeight*0.065 : fullHeight*0.053
                                            }
                                            pressed={() => {}}
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
                                                this.setState({showInfo: !this.state.showInfo})
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
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                {this.state.pack.description}
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
                                            {this.state.videos.length}
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
                                            {this.state.totalLength}
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
                                            {this.state.pack.xp}
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
                                            this.like()
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <View style={{flex: 1}}/>
                                        <AntIcon
                                            name={(this.state.pack.isLiked) ? 'like1':'like2'}
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
                                            {this.state.pack.like_count}
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
                                            Download
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
                        <View style={{height: 5*factorVertical}}/>
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
                                items={this.state.videos}
                                title={'Packs'} // title for see all page
                                type={'PACK'} // the type of content on page
                                isLoading={this.state.isLoadingAll}
                                showFilter={false} // 
                                showType={false} // show course / song by artist name
                                showArtist={false} // show artist name
                                showLength={true}
                                imageRadius={5*factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.095} // height per row
                                imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.095 : fullHeight*0.075} // image height
                                imageWidth={fullWidth*0.26} // image width
                                outVideos={this.state.outVideos} // if paging and out of videos
                                //getVideos={() => this.getContent()} // for paging
                            />
                        </View>
                        <View style={{height: 15*factorVertical}}/>
                    </ScrollView>
                </View>
                <NavigationBar
                    currentPage={'SINGLEPACK'}
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
                        onClose={(e) => {
                            this.setState({showModalMenu: e}),
                            this.forceUpdate()
                        }}
                        parentPage={this.state.parentPage}
                        menu={this.state.menu}
                    />
                </Modal>
                <Modal key={'restartCourse'}
                    isVisible={this.state.showRestartCourse}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}                    
                >
                    <RestartCourse
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false
                            })
                        }}
                    />
                </Modal>
            </View>
        )
    }
}