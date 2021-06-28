import { Image } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
export default {
  quality: 'Auto',
  manageOfflinePath: function (path) {
    let isOnline = path.indexOf('http') > -1,
      isDataImg = path.indexOf('data:image') > -1,
      isAndroidPath = path.indexOf('file://') > -1,
      isiOSPath = !isOnline && !isDataImg && !isAndroidPath;
    const offPath = isiOS
      ? RNFetchBlob.fs.dirs.LibraryDir
      : RNFetchBlob.fs.dirs.DocumentDir;
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
  getAssignWHRatio: async function (assignments) {
    let assignPromises = [];
    assignments.map(a => {
      let svgs = [],
        nsvgs = [];
      a.sheets?.map(s => {
        if (s.value.includes('.pdf')) return;
        if (s.value.includes('.svg')) svgs.push({ ...s });
        else nsvgs.push({ ...s });
      });
      if (svgs.length) {
        assignPromises.push(
          new Promise(async res => {
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
              if (i === svgs.length - 1) return res(svgs);
            });
          })
        );
      }
      if (nsvgs.length) {
        nsvgs.map(ns => {
          assignPromises.push(
            new Promise(res => {
              Image.getSize(
                ns.value,
                (w, h) => {
                  ns.whRatio = w / h;
                  res(nsvgs);
                },
                e => {
                  ns.whRatio = 1;
                  res(nsvgs);
                }
              );
            })
          );
        });
      }
    });
    return (await Promise.all(assignPromises)).flat();
  }
};
