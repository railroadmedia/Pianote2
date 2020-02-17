/**
 * PackUser is 
 * a component that pulls in cateloglist
 * which shows a vertical list of videos
 */
import React from 'react';
import { SafeAreaView, Text, View,
    StyleSheet } from 'react-native';
import VerticalVideoList from '../../components/VerticalVideoList';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import NavigationMenu from '../../components/NavigationMenu';
import Modal from "react-native-modal";


export default class PackUser extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.items = []
        this.state = {
            items: [], // for holding catalog items
            showModalMenu: true // show navigation menu
        }
    }
    

    async componentDidMount() {
        const { response, error } = await getContent({
            brand:'pianote',
            limit: '15',
            page: '1',
            sort: '-created_on',
            statuses: ['published'],
            included_types:['song'],
        });
    
        if(error) {
            console.error(error);
        }

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

        this.setState({items})
    }


    render() {
        return (
            <SafeAreaView styles={styles.container}>
                <Modal key={'blurredMenuContainer'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu key={'menuButtons'}
                        onClose={(e) => this.setState({showModalMenu: e})}
                        parentPage={'PACKS'}
                        modalVisible={this.state.showModalMenu}
                    />
                </Modal>
                <View key={'catalogListContainer'}
                    style={[
                        styles.centerContent, {
                        height: fullHeight, 
                        width: '100%',
                    }]}
                >
                    <View style={[styles.centerContent, {flex: 1}]}>
                        <VerticalVideoList
                            Title={'Courses'}
                            renderType={'FlatList'}
                            Description={'These are some courses'}
                            seeAllRoute={'ROUTER'}
                            items={this.state.items}
                            forceSquareThumbs={false}
                            itemWidth={fullWidth*0.25}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const localStyles = StyleSheet.create({

});