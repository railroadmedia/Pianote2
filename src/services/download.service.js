import { Image, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
export default {
  quality: 'Auto',
  manageOfflinePath: function (path) {
    let isOnline = path.indexOf('http') > -1,
      isDataImg = path.indexOf('data:image') > -1,
      isAndroidPath = path.indexOf('file://') > -1,
      isiOSPath = !isOnline && !isDataImg && !isAndroidPath;
    const offPath =
      Platform.OS === 'ios'
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
    let assignPromises = [],
      pdfs = [];
    assignments.map(a => {
      let svgs = [],
        nsvgs = [];
      a.sheets.map(s => {
        if (s.value.includes('.pdf')) return pdfs.push({ ...s });
        if (s.value.includes('.svg')) return svgs.push({ ...s });
        if (!s.value.includes('.svg')) return nsvgs.push({ ...s });
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
              i === svgs.length - 1 && res(svgs);
            });
          })
        );
      }
      if (pdfs.length) {
        assignPromises.push(
          new Promise(async res => {
            let pagesNo = [];
            pdfs.map(p =>
              pagesNo.push(
                RNFetchBlob.fetch(
                  'GET',
                  'https://www.anre.ro/files/furnizori/oferta%20Hidroelectrica.pdf'
                )
              )
            );
            (await Promise.all(pagesNo)).map(async (pagesNoResp, i) => {
              pdfs[i].numberOfPages = pagesNoResp
                .text()
                .match(/\/Type[\s]*\/Page[^s]/g).length;
              i === pdfs.length - 1 && res(pdfs);
            });
          })
        );
      }
      if (nsvgs.length) {
        nsvgs.map((ns, i) => {
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
