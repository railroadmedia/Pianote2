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
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import { getContentChildById } from '@musora/services';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class PathOverview extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.data,
            showInfo: false,
            isLoadingAll: true,
            items: [],
            
        }
    }


    componentDidMount = async () => {
        console.log(this.state.data)
        this.getContent()
    }


    getContent = async () => {
        const { response, error } = await getContentChildById({
            parentId: this.state.data.id,
        });

        console.log(response, 'SPOINSE')

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        });

        try {
            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructors'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        like_count: newContent[i].post.like_count,
                        duration: this.getDuration(newContent[i]),
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    })
                }
            }
    
            for(i in items) {
                this.state.totalLength = this.state.totalLength + Number(items[i].duration)
            }
            this.state.totalLength = Math.floor(this.state.totalLength/60).toString()
            

            this.setState({
                items: [...this.state.items, ...items],
                isLoadingAll: false,
                totalLength: this.state.totalLength,
            })    
            
        } catch (error) {
            console.log(error)
        }

    }


    getDuration = (newContent) => {
        var data = 0
        try {
            for(i in newContent.post.fields) {
                if(newContent.post.fields[i].key == 'video') {
                    var data = newContent.post.fields[i].value.fields
                    for(var i=0; i < data.length; i++) {
                        if(data[i].key == 'length_in_seconds') {
                            return data[i].value
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)    
        }
    }
 

    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        width: fullWidth,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
                    >
                        <View style={{height: (isNotch) ? fullHeight*0.05 : fullHeight*0.03}}/>
                        <View key={'image'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.31 + (isNotch ? fullHeight*0.035 : 0),
                            }]}
                        >
                            <FastImage
                                style={{
                                    flex: 1, 
                                    alignSelf: 'stretch', 
                                    backgroundColor: colors.mainBackground,
                                }}
                                source={{uri: this.state.data.thumbnail}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View key={'goBackIcon'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 10*factorHorizontal,
                                    top: ((isNotch) ? 55*factorVertical-fullHeight*0.05 : 45*factorVertical-fullHeight*0.03),
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
                        </View>
                        <View key={'title'}>
                            <View style={{height: 20*factorVertical}}/>
                            <View style={{flex: 1}}>   
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 24*factorRatio,
                                    }}
                                >
                                    {this.state.data.title}
                                </Text>
                                <View style={{height: 10*factorVertical}}/>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                        textAlign: 'center',
                                        fontSize: 14*factorRatio,

                                    }}
                                >
                                    {this.state.data.artist} | LEVEL 5 | {this.state.data.xp}XP
                                </Text>
                            </View>
                            <View style={{height: 20*factorVertical}}/>
                            <View key={'thumb/Start/Info'}
                                style={{height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053}}
                            >
                                <View key={'thumbs'}
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: fullWidth*0.25,
                                        height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                        zIndex: 3,
                                        elevation: 3,
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
                                        color={colors.pianoteRed}
                                    />
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
                                </TouchableOpacity>
                            </View>
                                <StartIcon
                                    pxFromTop={0}
                                    buttonHeight={(onTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                    pxFromLeft={fullWidth*0.5/2}
                                    buttonWidth={fullWidth*0.5}
                                    pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
                                />
                                <View key={'info'}
                                        style={[ 
                                            styles.centerContent, {
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            width: fullWidth*0.25,
                                            height: (onTablet) ? fullHeight*0.065 : fullHeight*0.053,
                                            zIndex: 3,
                                            elevation: 3,
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
                                paddingLeft: fullWidth*0.05,
                                paddingRight: fullWidth*0.05,
                            }}
                        >
                            <View style={{height: 20*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5*factorVertical,
                                    fontSize: 15*factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                {this.state.data.description}
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
                                        onPress={() => {}}
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
                                                fontSize: 13*factorRatio,
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
                        <View style={{height: 15*factorVertical}}/>
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
                                items={this.state.items}
                                isLoading={this.state.isLoadingAll}
                                title={'Foundations'} // title for see all page
                                type={'FOUNDATIONS'} // the type of content on page
                                showFilter={false} // 
                                showType={true} // show course / song by artist name
                                showArtist={false} // show artist name
                                showLength={false}
                                showSort={false}
                                imageRadius={5*factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.0925} // height per row
                                imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.09 :fullHeight*0.0825} // image height
                                imageWidth={fullWidth*0.26} // image width
                                navigator={(row) => this.props.navigation.navigate('VIDEOPLAYER', {data: row})}
                            />
                        </View>
                    </ScrollView>
                </View>
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
                <NavigationBar
                    currentPage={'LessonsPathOverview'}
                />
            </View>
        )
    }
}
                            