import React from 'react';
import {
    View,
    Text,
    Alert,
    ScrollView,
    TouchableOpacity,
    PermissionsAndroid,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const getTypeByExtension = path => {
    if (path === 'mp3' || path.indexOf('mp3') > 0) return 'audio/mp3';
    if (path === 'pdf' || path.indexOf('pdf') > 0) return 'application/pdf';
    if (path === 'zip' || path.indexOf('zip') > 0) return 'application/zip';
};

const downloadRes = (
    resource,
    id,
    notEmmitingProgress,
    notOppeningAfterDld,
    cancel,
) => {
    if (cancel) return this[id].cancel(() => {});
    return new Promise(async (resolve, reject) => {
        let isiOS = Platform.OS === 'ios';
        let dirs = RNFetchBlob.fs.dirs;
        const filePath = isiOS
            ? `${dirs.DocumentDir}/Downloads/${resource.resource_url
                  .split('/')
                  .pop()
                  .replace(/ /g, '')
                  .replace(/%20/g, '-')
                  .toLowerCase()}`
            : `${
                  RNFS.ExternalStorageDirectoryPath
              }/Download/${resource.resource_url
                  .split('/')
                  .pop()
                  .replace(/ /g, '-')
                  .replace(/%20/g, '-')
                  .toLowerCase()}`;
        let exists = await RNFetchBlob.fs.exists(filePath);
        if (exists) {
            resolve();
            if (!notOppeningAfterDld) {
                if (isiOS) RNFetchBlob.ios.openDocument(filePath);
                else {
                    RNFetchBlob.android.actionViewIntent(
                        filePath,
                        getTypeByExtension(filePath),
                    );
                }
            }
        } else {
            if (isiOS) {
                try {
                    let fetchConf = RNFetchBlob.config({
                        fileCache: true,
                        path: filePath,
                    });
                    this[id] = fetchConf.fetch(
                        'GET',
                        encodeURI(decodeURI(resource.resource_url)),
                    );
                    this[id]
                        .progress((received, total) => {
                            if (!notEmmitingProgress)
                                DeviceEventEmitter.emit('dldProgress', {
                                    id,
                                    val: received / total,
                                });
                        })
                        .then(res => {
                            resolve();
                            if (!notEmmitingProgress)
                                DeviceEventEmitter.emit('dldProgress', {
                                    id,
                                    val: undefined,
                                });
                            if (!getTypeByExtension(filePath))
                                RNFetchBlob.fs
                                    .mv(
                                        res.data,
                                        `${res.data}${resource.extension}`,
                                    )
                                    .then(() => {
                                        if (!notOppeningAfterDld)
                                            RNFetchBlob.ios.openDocument(
                                                `${res.data}${resource.extension}`,
                                            );
                                    })
                                    .catch(() => {
                                        reject();
                                    });
                            else if (!notOppeningAfterDld)
                                RNFetchBlob.ios.openDocument(res.data);
                        })
                        .catch(e => {
                            reject();
                            Alert.alert(
                                `Error while downloading ${resource.resource_name}`,
                                'There is insufficient storage space on your device. Please free up some space and try again.',
                                [{text: 'OK'}],
                                {cancelable: false},
                            );
                            RNFetchBlob.fs.unlink(filePath);
                        });
                } catch (e) {
                    resolve();
                }
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Write to external Storage',
                            message:
                                'For downloading resources we need your permission',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        RNFS.getFSInfo().then(info => {
                            let freeSpaceInMb = info.freeSpace / 1024 / 1024;
                            let extension = resource.extension;
                            let hasSpace = false;
                            if (
                                (extension === 'pdf' && freeSpaceInMb > 1) ||
                                (extension !== 'pdf' && freeSpaceInMb > 100)
                            ) {
                                hasSpace = true;
                            }
                            if (hasSpace) {
                                try {
                                    let options = {
                                        fileCache: true,
                                        addAndroidDownloads: {
                                            useDownloadManager: true,
                                            notification: true,
                                            path: filePath,
                                            title: resource.resource_name,
                                            description: 'Downloading',
                                        },
                                    };
                                    let fetchConf = RNFetchBlob.config(options);
                                    fetchConf
                                        .fetch(
                                            'GET',
                                            encodeURI(
                                                decodeURI(
                                                    resource.resource_url,
                                                ),
                                            ),
                                        )
                                        .then(fetchResp => {
                                            resolve();
                                            if (!notOppeningAfterDld) {
                                                const extension = getTypeByExtension(
                                                    resource.extension,
                                                );
                                                if (
                                                    resource.wasWithoutExtension
                                                ) {
                                                    RNFetchBlob.fs
                                                        .mv(
                                                            filePath,
                                                            `${filePath}${resource.extension}`,
                                                        )
                                                        .then(() => {
                                                            RNFetchBlob.android.actionViewIntent(
                                                                `${filePath}${resource.extension}`,
                                                                extension,
                                                            );
                                                        })
                                                        .catch(e => {
                                                            reject();
                                                        });
                                                } else {
                                                    RNFetchBlob.android.actionViewIntent(
                                                        filePath,
                                                        extension,
                                                    );
                                                }
                                            }
                                        })
                                        .catch(e => {
                                            reject();
                                        });
                                } catch (e) {
                                    resolve();
                                }
                            } else {
                                resolve();
                                Alert.alert(
                                    `Error while downloading ${resource.resource_name}`,
                                    'There is insufficient storage space on your device. Please free up some space and try again.',
                                    [{text: 'OK'}],
                                    {cancelable: false},
                                );
                            }
                        });
                    }
                } catch (err) {
                    resolve();
                }
            }
        }
    });
};

const renderSvgs = extension => {
    switch (extension) {
        case 'zip':
            return (
                <FontIcon
                    name={'file-zip-o'}
                    size={20 * factorRatio}
                    color={'white'}
                />
            );
        case 'mp3':
            return (
                <FontIcon
                    name={'music'}
                    size={20 * factorRatio}
                    color={'white'}
                />
            );

        case 'pdf':
            return (
                <FontIcon
                    name={'file-pdf-o'}
                    size={20 * factorRatio}
                    color={'white'}
                />
            );
    }
};

export class DownloadResources extends React.Component {
    render() {
        let {resources} = this.props;
        return (
            <View
                style={{
                    backgroundColor: colors.mainBackground,
                    width: fullWidth,
                }}
            >
                <ScrollView>
                    {resources &&
                        resources.map((resource, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ffffff',
                                }}
                                onPress={async () => {
                                    await this.props.onClose();
                                    downloadRes(resource, index);
                                }}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            marginRight: 15,
                                        }}
                                    >
                                        {renderSvgs(resource.extension)}
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'OpenSans-Regular',
                                            color: '#ffffff',
                                        }}
                                    >
                                        {resource.resource_name}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontFamily: 'OpenSans-Regular',
                                            color: '#CCD3D3',
                                            marginRight: 10,
                                        }}
                                    >
                                        {resource.extension?.toUpperCase()}
                                    </Text>
                                    <FontIcon
                                        name={'external-link'}
                                        size={20 * factorRatio}
                                        color={'white'}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    <TouchableOpacity
                        onPress={this.props.onClose}
                        style={{
                            padding: 15,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                marginRight: 15,
                            }}
                        >
                            <AntIcon
                                name={'close'}
                                size={20 * factorRatio}
                                color={'#ffffff'}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: 'OpenSans-Regular',
                                color: '#ffffff',
                            }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

export {downloadRes};
