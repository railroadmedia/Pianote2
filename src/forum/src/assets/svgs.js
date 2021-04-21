import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
export const arrowLeft = props => (
  <Svg
    viewBox='0 0 15 27'
    xmlns='http://www.w3.org/2000/svg'
    version='1.1'
    style={[{ width: props.width, height: props.height, aspectRatio: 15 / 27 }]}
  >
    <Path
      fill={props.fill}
      id='arrow-left'
      d='M2.414000320434571,13.72849988937378 l12.021,12.021 c0.39000000000000007,0.39100000000000007 0.39000000000000007,1.024 0,1.415 c-0.39000000000000007,0.39000000000000007 -1.024,0.39000000000000007 -1.4140000000000001,0 l-12.728,-12.728 c-0.19500000000000003,-0.19600000000000004 -0.29300000000000004,-0.452 -0.29300000000000004,-0.7080000000000001 c0,-0.256 0.09800000000000003,-0.512 0.29300000000000004,-0.7080000000000001 l12.728,-12.728 c0.39000000000000007,-0.39000000000000007 1.024,-0.39000000000000007 1.4140000000000001,0 c0.39000000000000007,0.39100000000000007 0.39000000000000007,1.024 0,1.415 l-12.021,12.021 z'
      class=''
    />
  </Svg>
);
export const moderate = props => (
  <Svg
    viewBox='0 0 14 4'
    xmlns='http://www.w3.org/2000/svg'
    style={[{ width: props.width, height: props.height, aspectRatio: 14 / 4 }]}
  >
    <Circle
      fill={props.fill}
      cx='12.2386'
      cy='2.18525'
      r='1.7614'
      transform='rotate(-180 12.2386 2.18525)'
    />
    <Path
      fill={props.fill}
      d='M5.19301 2.18525C5.19301 1.21246 5.98162 0.423848 6.95442 0.423848C7.92721 0.423848 8.71582 1.21246 8.71582 2.18525C8.71582 3.15805 7.92721 3.94666 6.95442 3.94666C5.98162 3.94666 5.19301 3.15805 5.19301 2.18525Z'
    />
    <Circle
      fill={props.fill}
      cx='2.11042'
      cy='2.18525'
      r='1.7614'
      transform='rotate(-180 2.11042 2.18525)'
    />
  </Svg>
);
export const info = props => (
  <Svg
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    style={[{ width: props.width, height: props.height }]}
  >
    <Path
      d='M3.6634610567092896,20.631460877895357 C2.5173410567092898,19.524460877895354 1.6031510567092897,18.200360877895356 0.9742410567092896,16.736360877895354 C0.34533105670928954,15.272260877895356 0.01429905670928966,13.697660877895355 0.00045305670928963426,12.104260877895355 C-0.01339294329071039,10.510960877895355 0.2902310567092896,8.930770877895355 0.8936010567092896,7.4560108778953555 C1.4969710567092895,5.981250877895356 2.3880110567092894,4.641430877895355 3.5147210567092895,3.514720877895355 C4.64143105670929,2.388010877895355 5.98125105670929,1.4969708778953552 7.45601105670929,0.8936008778953553 C8.93077105670929,0.2902308778953553 10.51096105670929,-0.013393122104644717 12.104261056709289,0.0004528778953553081 C13.69766105670929,0.014298877895355333 15.27226105670929,0.3453308778953552 16.73636105670929,0.9742408778953553 C18.20036105670929,1.6031508778953554 19.52446105670929,2.5173408778953554 20.63146105670929,3.6634608778953552 C22.817361056709288,5.926680877895356 24.02686105670929,8.957910877895355 23.99956105670929,12.104260877895355 C23.97216105670929,15.250660877895356 22.71016105670929,18.260360877895355 20.48526105670929,20.485260877895357 C18.26036105670929,22.710160877895355 15.25066105670929,23.972160877895355 12.104261056709289,23.999560877895355 C8.957911056709289,24.026860877895356 5.92668105670929,22.817360877895354 3.6634610567092896,20.631460877895357 zM18.93946105670929,18.939460877895357 C20.74076105670929,17.138060877895356 21.75276105670929,14.694960877895355 21.75276105670929,12.147460877895355 C21.75276105670929,9.599960877895356 20.74076105670929,7.156810877895355 18.93946105670929,5.355460877895355 C17.13806105670929,3.554110877895355 14.694961056709289,2.5421208778953552 12.14746105670929,2.5421208778953552 C9.59996105670929,2.5421208778953552 7.156811056709289,3.554110877895355 5.35546105670929,5.355460877895355 C3.5541110567092895,7.156810877895355 2.5421210567092896,9.599960877895356 2.5421210567092896,12.147460877895355 C2.5421210567092896,14.694960877895355 3.5541110567092895,17.138060877895356 5.35546105670929,18.939460877895357 C7.156811056709289,20.740760877895354 9.59996105670929,21.752760877895355 12.14746105670929,21.752760877895355 C14.694961056709289,21.752760877895355 17.13806105670929,20.740760877895354 18.93946105670929,18.939460877895357 zM10.94746105670929,13.347460877895355 V10.947460877895356 H13.347461056709289 V18.147460877895355 H10.94746105670929 V13.347460877895355 zM10.94746105670929,6.147460877895355 H13.347461056709289 V8.547460877895356 H10.94746105670929 V6.147460877895355 z'
      fill={props.fill}
      id='svg_1'
      class=''
    />
  </Svg>
);
