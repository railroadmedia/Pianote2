/**
 * Packs
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
import Songs500 from 'Pianote2/src/assets/img/svgs/500SongsLogo.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import SightReading from 'Pianote2/src/assets/img/svgs/sightReadingLogo.svg';
import FasterFingers from 'Pianote2/src/assets/img/svgs/fasterFingersLogo.svg';

export default class Packs extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            packs: [],
            isLoading: true,
        }
    }


    componentDidMount = async () => {
        await this.setState({isLoading: true})

        console.log('GET PACKS')

        const { response, error } = await getContent({
            brand: 'pianote',
            limit: '30',
            page: 1,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['pack'],
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        console.log(response, error)

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
                    like_count: newContent[i].likeCount,
                    isLiked: newContent[i].isLiked,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                })
            }
        }

        items.reverse()

        await this.setState({
            packs: [...this.state.packs, ...items],
            isLoading: false,
        })
    }


    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View
                        style={{
                            height: fullHeight*0.1,
                            width: fullWidth,
                            position: 'absolute',
                            zIndex: 2, 
                            elevation: 2,
                            alignSelf: 'stretch', 
                        }}
                    >
                        <NavMenuHeaders
                            currentPage={'PACKS'}
                        />
                    </View>
                    <ScrollView key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.05,
                                backgroundColor: colors.mainBackground,
                            }}
                        />
                        <View style={{height: 20*factorVertical}}/>
                        <Text
                            style={{
                                paddingLeft: 12*factorHorizontal,
                                fontSize: 30*factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight: (Platform.OS == 'ios') ? '900' : 'bold',
                            }}
                        >
                            Packs
                        </Text>
                        <View style={{height: 20*factorVertical}}/>
                        {!this.state.isLoading && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                paddingLeft: 5*factorHorizontal,
                                paddingRight: 5*factorHorizontal,
                            }}
                        >
                            {(this.state.packs.length > 0) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[0]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[0].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}
                            {(this.state.packs.length > 1) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[1]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[1].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}   
                            {(this.state.packs.length > 2) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[2]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[2].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}                                                                       
                        </View>
                        )}
                        <View style={{height: 20*factorVertical}}/>
                        {!this.state.isLoading && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                paddingLeft: 5*factorHorizontal,
                                paddingRight: 5*factorHorizontal,
                            }}
                        >
                            {(this.state.packs.length > 3) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[3]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[3].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}
                            {(this.state.packs.length > 4) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[4]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[4].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}   
                            {(this.state.packs.length > 5) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[5]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[5].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}                                                                       
                        </View>
                        )}
                        <View style={{height: 20*factorVertical}}/>
                        {!this.state.isLoading && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                paddingLeft: 5*factorHorizontal,
                                paddingRight: 5*factorHorizontal,
                            }}
                        >
                            {(this.state.packs.length > 6) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[6]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[6].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}
                            {(this.state.packs.length > 7) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[7]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[7].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}   
                            {(this.state.packs.length > 8) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[8]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[8].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}                                                                       
                        </View>
                        )}
                        <View style={{height: 20*factorVertical}}/>
                        {!this.state.isLoading && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                paddingLeft: 5*factorHorizontal,
                                paddingRight: 5*factorHorizontal,
                            }}
                        >
                            {(this.state.packs.length > 9) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[9]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[9].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}
                            {(this.state.packs.length > 10) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[10]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[10].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}   
                            {(this.state.packs.length > 11) && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('SINGLEPACK', {data: this.state.packs[11]})
                                }}
                                style={{
                                    width: fullWidth*0.285,
                                    height: fullWidth*0.285*(95/65),
                                    backgroundColor: colors.secondBackground,
                                    borderRadius: 7.5*factorRatio,
                                }}
                            >
                                <GradientFeature
                                    color={'black'}
                                    opacity={0.45}
                                    height={'100%'}
                                    borderRadius={0}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 2,
                                        elevation: 2,
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 7.5*factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={styles.centerContent}>
                                        <View>
                                            <View
                                                style={[
                                                    styles.centerContent, {
                                                    backgroundColor: colors.pianoteRed,
                                                    paddingLeft: 3.5*factorRatio,
                                                    paddingRight: 3.5*factorRatio,
                                                    paddingTop: 2.5*factorRatio,
                                                    paddingBottom: 2.5*factorRatio,
                                                    borderRadius: 20*factorRatio,
                                                    alignSelf: 'stretch',
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 8*factorRatio,
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                    }}
                                                >
                                                    NEW PACK!
                                                </Text>
                                            </View>
                                        </View>
                                        <Songs500
                                            height={32.5*factorVertical}
                                            width={fullWidth*0.2}
                                        />
                                    </View>
                                    <View style={{height: 10*factorVertical}}/>
                                </View>                                
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        borderRadius: 7.5*factorRatio,
                                        alignSelf: 'stretch', 
                                    }}
                                    source={{uri: this.state.packs[11].thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            )}                                                                       
                        </View>
                        )}                                                                        
                        <View style={{height: 20*factorVertical}}/>
                    </ScrollView>
                    <NavigationBar
                        currentPage={'PACKS'}
                    />
                </View>
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
