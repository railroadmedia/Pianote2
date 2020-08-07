import {Image, Platform} from 'react-native';
import RNFS from 'react-native-fs';
export default {
  quality: 'Auto',
  manageOfflinePath: function(path) {
    let isOnline = path.indexOf('http') > -1,
      isDataImg = path.indexOf('data:image') > -1,
      isAndroidPath = path.indexOf('file://') > -1,
      isiOSPath = !isOnline && !isDataImg && !isAndroidPath;
    const offPath =
      Platform.OS === 'ios'
        ? RNFS.LibraryDirectoryPath
        : RNFS.DocumentDirectoryPath;
    if (!isOnline) {
      if (isiOSPath) {
        path = `${offPath}/${path}`;
        return path;
      }
      if (isAndroidPath) {
        path = path.replace('file://', `file://${offPath}`);
        return path;
      }
    }
    return path;
  },
  getAssignWHRatio: async function(assignments) {
    let assignPromises = [];
    assignments.map(a => {
      let svgs = [],
        nsvgs = [];
      a[3].map(d => {
        if (d.key === 'sheet_music_image_url' && d.value.indexOf('.pdf') > -1)
          return;
        if (d.key === 'sheet_music_image_url' && d.value.indexOf('.svg') > -1)
          return svgs.push(d);
        if (d.key === 'sheet_music_image_url' && d.value.indexOf('.svg') < 0)
          return nsvgs.push(d);
      });
      if (svgs.length) {
        assignPromises.push(
          new Promise(async (res, rej) => {
            let vbPromises = [];
            svgs.map(s => vbPromises.push(fetch(s.value)));

            (await Promise.all(vbPromises)).map(async (vbResp, i) => {
              let vbArr;
              try {
                vbArr = vbResp._bodyText
                  .split('viewBox="')[1]
                  .split('" ')[0]
                  .split(' ');
              } catch (e) {
                vbArr = (await vbResp.text())
                  .split('viewBox="')[1]
                  .split('" ')[0]
                  .split(' ');
              }
              svgs[i].whRatio = vbArr[2] / vbArr[3];
              i === svgs.length - 1 && res();
            });
          }),
        );
      }
      if (nsvgs.length) {
        nsvgs.map((ns, i) => {
          assignPromises.push(
            new Promise((res, rej) => {
              Image.getSize(
                ns.value,
                (w, h) => {
                  ns.whRatio = w / h;
                  res();
                },
                e => {
                  ns.whRatio = 1;
                  res();
                },
              );
            }),
          );
        });
      }
    });
    await Promise.all(assignPromises);
  },
};
