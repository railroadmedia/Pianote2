import React from 'react';
import Svg, { Circle, Path, Polygon, Rect, G } from 'react-native-svg';
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

export const like = props => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox='0 0 15 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <Path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M3.50643 15.5898H1.17302C0.527145 15.5898 0 15.0635 0 14.4162V7.38241C0 6.73546 0.527145 6.20868 1.17302 6.20868H4.21171C4.47078 6.20868 4.68126 6.41881 4.68126 6.67787V14.4162C4.68126 15.0635 4.15411 15.5898 3.50643 15.5898ZM1.17305 7.14692C1.04352 7.14692 0.939178 7.25234 0.939178 7.38242V14.4162C0.939178 14.5458 1.04352 14.6517 1.17305 14.6517H3.50647C3.63786 14.6517 3.7422 14.5458 3.7422 14.4162V7.14691L1.17305 7.14692Z'
      fill={props.fill}
    />
    <Path
      d='M12.5978 15.4335H7.08708C6.36203 15.4335 5.63518 15.2624 4.98568 14.9373L4.00337 14.4458C3.77131 14.3299 3.67774 14.048 3.79289 13.8163C3.90803 13.5845 4.1905 13.4917 4.42256 13.6067L5.40487 14.0982C5.92483 14.358 6.50596 14.4954 7.08707 14.4954H12.5978C12.8532 14.4954 13.0799 14.3256 13.1177 14.109C13.1483 13.9199 13.0655 13.7871 13.0133 13.7252C12.9234 13.6187 12.792 13.5574 12.6553 13.5574C12.3962 13.5574 12.1857 13.3476 12.1857 13.0883C12.1857 12.8289 12.3962 12.6193 12.6553 12.6193H13.0673C13.321 12.6193 13.5494 12.4495 13.5854 12.2327C13.6178 12.0438 13.535 11.911 13.4829 11.8491C13.3929 11.7426 13.2616 11.6811 13.1249 11.6811C12.864 11.6811 12.6553 11.4715 12.6553 11.212C12.6553 10.9526 12.864 10.743 13.1249 10.743H13.3174C13.6556 10.743 13.9561 10.53 14.0352 10.2364C14.1162 9.93431 13.9956 9.71679 13.9183 9.61406C13.7815 9.43721 13.5783 9.33591 13.3588 9.33591C13.0997 9.33591 12.8892 9.12614 12.8892 8.86672C12.8892 8.60746 13.0997 8.39768 13.3588 8.39768C13.5783 8.39768 13.7816 8.2964 13.9183 8.12007C13.9956 8.01681 14.1162 7.79912 14.0352 7.49758C13.9561 7.20396 13.6556 6.99059 13.3174 6.99059H8.90234C8.75303 6.99059 8.61091 6.91827 8.52092 6.79539C8.43278 6.67305 8.40939 6.51581 8.45794 6.37278L9.18661 4.18506C9.30175 3.83855 9.34135 3.46415 9.30175 3.10199C9.22801 2.43219 8.87713 1.81491 8.33921 1.40884C8.19529 1.30036 7.96503 1.41621 7.96503 1.59541V2.05275C7.96503 2.92153 7.67176 3.77666 7.13742 4.46229L4.58266 7.74766C4.42254 7.95204 4.1275 7.98819 3.92422 7.83024C3.71912 7.67066 3.6831 7.37614 3.84146 7.17159L6.39617 3.88586C6.80279 3.36466 7.02589 2.7132 7.02589 2.05275V1.59541C7.02589 0.949534 7.55304 0.423828 8.19891 0.423828C8.45074 0.423828 8.70262 0.507672 8.90414 0.660588C9.6472 1.22155 10.1311 2.07434 10.2337 2.99891C10.2894 3.49421 10.2355 4.00695 10.0772 4.48209L9.55363 6.05236H13.3174C14.0838 6.05236 14.7531 6.54676 14.942 7.25416C15.0769 7.75881 14.9744 8.28235 14.6613 8.69093C14.6127 8.75373 14.5606 8.81237 14.5066 8.86671C14.5606 8.92122 14.6127 8.97986 14.6613 9.04267C14.9744 9.45124 15.0769 9.9746 14.942 10.4789C14.8412 10.8519 14.6091 11.1651 14.2997 11.3781C14.494 11.6737 14.5713 12.033 14.512 12.3879C14.4454 12.7787 14.2043 13.1132 13.8733 13.3228C14.037 13.6047 14.0982 13.9363 14.0424 14.2642C13.9308 14.9312 13.3084 15.4335 12.5978 15.4335L12.5978 15.4335Z'
      fill={props.fill}
    />
  </Svg>
);

export const likeOn = props => (
  <Svg
    viewBox='0 0 32 32'
    version='1.1'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      width: props.width,
      height: props.height
    }}
  >
    <Path
      id='liked'
      fill={props.fill}
      d='M8.978,12.507l0,17.469c-0.14,0.028 -0.284,0.042 -0.431,0.042l-4.357,0c-1.208,0 -2.19,-0.982 -2.19,-2.19l0,-13.13c0,-1.208 0.982,-2.191 2.19,-2.191l4.788,0Zm1.752,0.084l3.21,-4.128c0.758,-0.973 1.175,-2.189 1.175,-3.422l0,-0.854c0,-1.205 0.982,-2.187 2.187,-2.187c0.473,0 0.941,0.157 1.318,0.442c1.386,1.047 2.292,2.639 2.483,4.365c0.103,0.925 0.001,1.882 -0.293,2.768l-0.977,2.932l7.025,0c1.432,0 2.679,0.923 3.033,2.243c0.253,0.942 0.062,1.919 -0.523,2.682c-0.091,0.117 -0.187,0.227 -0.291,0.328c0.104,0.102 0.201,0.211 0.291,0.329c0.585,0.762 0.776,1.739 0.523,2.681c-0.187,0.696 -0.621,1.281 -1.198,1.678c0.362,0.552 0.506,1.223 0.395,1.885c-0.124,0.73 -0.573,1.354 -1.192,1.745c0.305,0.527 0.419,1.146 0.316,1.758c-0.21,1.245 -1.369,2.182 -2.697,2.182l-10.286,0c-1.355,0 -2.712,-0.319 -3.924,-0.926l-0.575,-0.288l0,-16.213Zm-4.37,12.174c0.483,0 0.875,0.392 0.875,0.876c0,0.483 -0.392,0.875 -0.875,0.875c-0.484,0 -0.876,-0.392 -0.876,-0.875c0,-0.484 0.392,-0.876 0.876,-0.876Z'
    />
  </Svg>
);

export const replies = props => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox='0 0 13 12'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <Path
      d='M12.6309 0C12.7308 0.0149846 12.8223 0.0643765 12.8897 0.139655C12.9571 0.214933 12.9961 0.311378 13 0.41235V11.6014C12.9949 11.6759 12.9705 11.7477 12.9291 11.8097C12.8877 11.8718 12.8308 11.9219 12.764 11.9552C12.6972 11.9884 12.6229 12.0036 12.5485 11.9993C12.474 11.9949 12.402 11.9712 12.3396 11.9303L8.96096 9.37558H0.369144C0.269407 9.36049 0.178026 9.31116 0.110673 9.23605C0.0433196 9.16094 0.00419183 9.06473 0 8.96392L0 0.41235C0.00460311 0.304466 0.0495136 0.202237 0.12585 0.125882C0.202186 0.0495262 0.304389 0.00460427 0.412246 0L12.5878 0H12.6309ZM9.0993 8.55296C9.14413 8.54977 9.18915 8.5555 9.23175 8.56983C9.27435 8.58415 9.31369 8.60678 9.34749 8.63641L12.1755 10.7746V0.824005H0.823797V8.55296H9.0993ZM10.4966 7.06836H2.50267C2.2684 7.05793 2.24893 6.99466 2.18706 6.92164C2.13824 6.86096 2.10738 6.78781 2.09797 6.71048C2.08856 6.63316 2.10098 6.55474 2.13383 6.48411C2.16667 6.41348 2.21863 6.35346 2.28382 6.31085C2.349 6.26823 2.42482 6.24471 2.50267 6.24297C5.17914 6.24297 7.85561 6.12823 10.5321 6.24297C11.317 6.34588 10.9332 7.04611 10.4959 7.06558L10.4966 7.06836ZM10.4966 5.09006H2.50267C1.70599 5.05529 2.07722 4.28413 2.50267 4.26605C5.17914 4.26605 7.85561 4.15132 10.5321 4.26605C11.4254 4.38357 10.9214 5.06989 10.4959 5.08867L10.4966 5.09006ZM10.4966 3.11175H2.50267C2.2684 3.10132 2.24893 3.03804 2.18706 2.96503C2.13844 2.90433 2.10775 2.83125 2.09845 2.75403C2.08916 2.67682 2.10162 2.59854 2.13444 2.52803C2.16727 2.45753 2.21914 2.3976 2.2842 2.35502C2.34927 2.31244 2.42494 2.28889 2.50267 2.28705C5.17914 2.28705 7.85561 2.17231 10.5321 2.28705C11.317 2.38996 10.9332 3.09019 10.4959 3.10966L10.4966 3.11175Z'
      fill={props.fill}
    />
  </Svg>
);
export const pin = props => (
  <Svg
    viewBox='0 0 8 10'
    xmlns='http://www.w3.org/2000/svg'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 8 / 10
    }}
  >
    <Path
      fill={props.fill}
      d='M6.2089,4.1849 L5.95401,1.875 H6.8333200000000005 C7.10946,1.875 7.33331,1.66513 7.33331,1.40625 V0.46874899999999997 C7.33331,0.20986300000000002 7.10946,0 6.8333200000000005,0 H1.16666 C0.890518,0 0.6666650000000002,0.20986300000000002 0.6666650000000002,0.46874899999999997 V1.40625 C0.6666650000000002,1.66513 0.890518,1.875 1.16666,1.875 H2.04597 L1.79108,4.1849 C0.780519,4.62539 0,5.41525 0,6.40624 C0,6.66513 0.22385400000000003,6.87499 0.499999,6.87499 H3.33332 V8.90638 C3.33332,8.93063 3.33935,8.95456 3.35093,8.97626 L3.85093,9.91376 C3.9122,10.0286 4.08768,10.0289 4.14907,9.91376 L4.64907,8.97626 C4.66064,8.95456 4.66667,8.93064 4.66668,8.90638 V6.87499 H7.5 C7.77615,6.87499 8,6.66513 8,6.40624 C7.99998,5.40658 7.20869,4.6207 6.2089,4.1849 z'
      id='svg_1'
      class=''
      fill-opacity='1'
    />
  </Svg>
);
export const coach = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 46.3 36.4'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 46.3 / 36.4
    }}
  >
    <Polygon
      fill={props.fill}
      class='st0'
      points='23.2,9.3 25.1,11.7 30.3,8.6 27.9,6.4 	'
    />
    <Path
      fill={props.fill}
      class='st0'
      d='M46.3,20.7C40.8,14.3,34.9,8.3,28.7,2.6C23.6-1.4,14.3-1.1,5.5,5.9l-1.2,1C4.3,6.9,4.2,7,4.1,7
		c-5.1,4.6-5.5,12.4-1,17.6c3.9,5.6,11.6,7,17.3,3.2c1.1-1.1,2-2.3,2.7-3.7l10.4,12.3l12.5-8.3L46.3,20.7L46.3,20.7L46.3,20.7z
		 M43.6,27.1l-6.1,3.7v-1.7l6.1-3.7V27.1z M35.2,27L21.5,10.3c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.2-0.3-0.3l-0.3-0.4
		c-2.5-2.9-6.1-4.6-9.9-4.7C17.3,1.4,23.7,1,27.5,4c6,5.5,11.7,11.4,17.1,17.6L35.2,27z'
    />
  </Svg>
);
export const team = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 80.5 25.5'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 80.5 / 25.5
    }}
  >
    <Path
      fill={props.fill}
      class='st0'
      d='M6.3,5.8V25h6.3V5.8h6.3V0.4H0v5.8L6.3,5.8z M33.5,0.4H18.3v25H34v-5.8h-9.4v-4.5h8.5V9.4h-8.5
	V5.8H34V0.4H33.5z M51,25h6.3v-0.9L46.1,0h-2.7L32.2,24.2V25h6.3l1.3-3.1h9.8L51,25z M47.4,16.5h-5.8l3.1-6.3L47.4,16.5z M68.4,11.2
	L58.6,0.4h-2.2v25h6.3V14.3l5.4,5.4h0.9l5.4-5.4v11.2h6.3v-25h-2.2L68.4,11.2z'
    />
  </Svg>
);
export const edge = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 65.8 24.2'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 65.8 / 24.2
    }}
  >
    <Path
      fill={props.fill}
      class='st0'
      d='M47.7,15h-5.9v-3.5h9.5l0,0c0,1.2,0,2.4-0.4,3.5c-0.4,2-1.2,3.9-2.8,5.5
	c-0.8,1.6-2.4,2.8-3.9,3.2C43,24,41.4,24.4,39.8,24c-1.6,0-2.8-0.4-3.9-1.2c-1.2-0.4-2.4-1.2-3.2-2c-0.8-0.8-1.6-1.6-2-2.4l0,0
	c-0.4,0.4-0.4,0.8-0.8,1.2c-1.6,2-3.5,3.2-5.9,3.9C22.9,24,21.7,24,20.9,24c-2.4,0-4.3,0-6.7,0l0,0V0l0,0c1.6,0,3.5,0,5.1,0
	c1.6,0,3.2,0,4.7,0.4c2.8,0.8,5.1,2.4,6.7,5.1l0,0l0,0c1.2-2,3.2-3.5,5.5-4.7C37.4,0.4,39,0,40.2,0c3.2,0,5.9,0.8,8.3,2.8
	c0.8,0.4,1.2,1.2,1.6,1.6l0,0l-2.4,2.4l-0.4-0.4c-0.8-1.2-2-2-3.2-2.8c-1.2-0.8-2.4-0.8-3.9-0.8c-1.2,0.8-2.8,1.2-4.3,2.4
	c-1.6,1.2-2.8,2.8-3.2,5.1c-0.4,2-0.4,3.9,0.8,5.9c0.8,1.2,1.6,2.4,3.2,3.2c0.8,0.8,1.6,1.2,2.8,1.6c2,0.4,4.3-0.4,5.9-1.6
	c1.2-1.2,2-2.4,2-3.5C47.7,15.4,47.7,15.4,47.7,15z M52.4,24L52.4,24V0l0,0h13v3.5l0,0H56v5.9h5.1l0,0c-0.8,1.2-1.6,2-2,3.2l0,0
	c-0.8,0-1.6,0-2.8,0l0,0v7.9h9.5l0,0V24H52.4L52.4,24z M13,3.5H3.5v5.9h5.1l0,0c-0.8,0.8-1.2,2-2,3.2c0,0,0,0-0.4,0H3.5v7.9H13V24H0
	V0h13V3.5z M17.7,20.9L17.7,20.9h2c0.8,0,1.6,0,2.8-0.4c2.8-0.4,5.1-2.4,5.9-5.1c0.8-2,0.8-4.7,0-6.7c-0.8-1.6-2-2.8-3.2-3.9
	c-1.2-0.8-2.8-1.2-4.3-1.2c-1.2,0-2.4,0-3.5,0l0,0L17.7,20.9z'
    />
  </Svg>
);
export const lifetime = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 63.1 30.1'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 63.1 / 30.1
    }}
  >
    <Path
      fill={props.fill}
      class='st0'
      d='M48,0c-5.5,0.3-10.6,2.9-14.2,7.1c1.2,1.5,2.3,3.1,3.3,4.7l0.2,0.3c2.6-3.5,6.5-5.7,10.8-6.1
	c5,0.1,9,4.3,8.9,9.3c-0.1,4.9-4,8.8-8.9,8.9c-7.8,0-14-10.5-14-10.6C33.7,13,26.1,0,14.8,0C6.5,0.1-0.1,7,0,15.3
	C0.1,23.4,6.7,30,14.8,30.1c5.5-0.3,10.6-2.9,14.2-7.1c-1.2-1.5-2.3-3.1-3.3-4.7l-0.2-0.3c-2.6,3.4-6.5,5.7-10.7,6.1
	c-5,0.1-9.2-3.9-9.3-8.9c-0.1-5,3.9-9.2,8.9-9.3c0.1,0,0.3,0,0.4,0c7.8,0,14,10.5,14,10.6c0.3,0.6,7.9,13.6,19.2,13.6
	c8.3,0,15.1-6.7,15.1-15.1C63.1,6.8,56.3,0,48,0z'
    />
  </Svg>
);
export const arrowRight = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    version='1.1'
    viewBox='0 0 15 27'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 15 / 27
    }}
  >
    <Path
      fill={props.fill}
      id='arrow-right'
      d='M12.31350154876709,13.72849988937378 l-12.021,-12.021 c-0.39000000000000007,-0.39100000000000007 -0.39000000000000007,-1.024 0,-1.415 c0.39000000000000007,-0.39000000000000007 1.024,-0.39000000000000007 1.4140000000000001,0 l12.728,12.728 c0.19500000000000003,0.19600000000000004 0.29300000000000004,0.452 0.29300000000000004,0.7080000000000001 c0,0.256 -0.09800000000000003,0.512 -0.29300000000000004,0.7080000000000001 l-12.728,12.728 c-0.39000000000000007,0.39000000000000007 -1.024,0.39000000000000007 -1.4140000000000001,0 c-0.39000000000000007,-0.39100000000000007 -0.39000000000000007,-1.024 0,-1.415 l12.021,-12.021 z'
      class=''
    />
  </Svg>
);
export const pencil = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 10 11'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 10 / 11
    }}
  >
    <Path
      fill={props.fill}
      d='M9.724599993015081,3.051439761581421 L8.82415999301508,4.041909761581421 C8.73235999301508,4.142889761581421 8.583919993015082,4.142889761581421 8.49211999301508,4.041909761581421 L6.32404999301508,1.6570497615814213 C6.23224999301508,1.556069761581421 6.23224999301508,1.392779761581421 6.32404999301508,1.291799761581421 L7.2244799930150805,0.30132976158142105 C7.589729993015082,-0.10044323841857912 8.18350999301508,-0.10044323841857912 8.550709993015081,0.30132976158142105 L9.724599993015081,1.5925897615814208 C10.09179999301508,1.9943697615814209 10.09179999301508,2.647519761581421 9.724599993015081,3.051439761581421 zM5.550579993015081,2.1426097615814212 L0.4214319930150808,7.784639761581421 L0.0073500330150806925,10.39509976158142 C-0.049293206984919326,10.747399761581422 0.23001699301508075,11.052499761581421 0.550343993015081,10.99239976158142 L2.9234999930150805,10.534699761581422 L8.052639993015081,4.8927197615814215 C8.144449993015082,4.791739761581421 8.144449993015082,4.628459761581421 8.052639993015081,4.527479761581421 L5.88457999301508,2.1426097615814212 C5.790819993015081,2.041629761581421 5.642379993015082,2.041629761581421 5.550579993015081,2.1426097615814212 zM2.4234799930150808,7.301219761581421 C2.316049993015081,7.1830497615814215 2.316049993015081,6.9939797615814205 2.4234799930150808,6.875809761581421 L5.4314299930150804,3.567089761581421 C5.53885999301508,3.448919761581421 5.710739993015082,3.448919761581421 5.818169993015081,3.567089761581421 C5.92558999301508,3.6852497615814213 5.92558999301508,3.874319761581421 5.818169993015081,3.992489761581421 L2.8102099930150812,7.301219761581421 C2.702789993015081,7.419389761581421 2.5308999930150806,7.419389761581421 2.4234799930150808,7.301219761581421 zM1.7183699930150809,9.10812976158142 H2.655909993015081 V9.888039761581421 L1.396089993015081,10.130799761581422 L0.7886359930150809,9.462629761581422 L1.0093499930150807,8.076839761581422 H1.7183699930150809 V9.10812976158142 z'
      id='svg_1'
      class=''
    />
  </Svg>
);
export const post = props => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 13 10'
    style={{
      width: props.width,
      height: props.height,
      aspectRatio: 13 / 10
    }}
  >
    <Path
      fill={props.fill}
      d='M6.500019980163574,0.1910247802734375 C3.0848899801635743,0.1910247802734375 0.3170499801635743,2.1897547802734376 0.3170499801635743,4.656494780273437 C0.3170499801635743,5.721344780273437 0.8339069801635743,6.696014780273438 1.6937299801635746,7.4624447802734375 C1.3918199801635742,8.544464780273438 0.38226098016357435,9.508404780273437 0.3701848801635743,9.519144780273438 C0.3170499801635743,9.568524780273437 0.30255868016357435,9.641514780273438 0.3339564801635743,9.705924780273438 C0.36535438016357435,9.770324780273437 0.43298098016357434,9.808974780273438 0.5102679801635743,9.808974780273438 C2.111559980163574,9.808974780273438 3.3119199801635744,9.126264780273438 3.9060699801635743,8.705484780273437 C4.695849980163574,8.969544780273438 5.572569980163574,9.121974780273437 6.500019980163574,9.121974780273437 C9.915139980163575,9.121974780273437 12.682949980163574,7.1232447802734375 12.682949980163574,4.656494780273437 C12.682949980163574,2.1897547802734376 9.915139980163575,0.1910247802734375 6.500019980163574,0.1910247802734375 z'
      id='svg_1'
      class=''
    />
  </Svg>
);

export const arrowUp = props => (
  <Svg
    viewBox='0 0 32 32'
    version='1.1'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      width: props.width,
      height: props.height,
      fill: props.fill
    }}
  >
    <Path
      id='arrow-up'
      d='M16,11.05l-12.021,12.021c-0.391,0.39 -1.024,0.39 -1.415,0c-0.39,-0.39 -0.39,-1.024 0,-1.414l12.728,-12.728c0.196,-0.195 0.452,-0.293 0.708,-0.293c0.256,0 0.512,0.098 0.708,0.293l12.728,12.728c0.39,0.39 0.39,1.024 0,1.414c-0.391,0.39 -1.024,0.39 -1.415,0l-12.021,-12.021Z'
    />
  </Svg>
);
export const arrowDown = props => (
  <Svg
    viewBox='0 0 32 32'
    version='1.1'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      width: props.width,
      height: props.height,
      fill: props.fill
    }}
  >
    <Path
      id='arrow-down'
      d='M16,20.95l12.021,-12.021c0.391,-0.39 1.024,-0.39 1.415,0c0.39,0.39 0.39,1.024 0,1.414l-12.728,12.728c-0.196,0.195 -0.452,0.293 -0.708,0.293c-0.256,0 -0.512,-0.098 -0.708,-0.293l-12.728,-12.728c-0.39,-0.39 -0.39,-1.024 0,-1.414c0.391,-0.39 1.024,-0.39 1.415,0l12.021,12.021Z'
    />
  </Svg>
);
export const file = props => (
  <Svg
    x='0px'
    y='0px'
    viewBox='0 0 512 512'
    style={{ fill: props.fill, height: props.height, width: props.width }}
  >
    <G>
      <G>
        <G>
          <Path
            d='M459.36,100.64l-96-96C360.341,1.645,356.253-0.024,352,0H96c-26.51,0-48,21.49-48,48v416c0,26.51,21.49,48,48,48h320
				c26.51,0,48-21.49,48-48V112C464.025,107.747,462.355,103.66,459.36,100.64z M432,464c0,8.837-7.163,16-16,16H96
				c-8.837,0-16-7.163-16-16V48c0-8.837,7.163-16,16-16h240v64c0,17.673,14.327,32,32,32h64V464z'
          />
          <Rect x='368' y='384' width='32' height='32' />
          <Rect x='112' y='224' width='288' height='32' />
          <Rect x='112' y='304' width='288' height='32' />
          <Rect x='112' y='384' width='224' height='32' />
        </G>
      </G>
    </G>
  </Svg>
);
export const image = props => (
  <Svg
    viewBox='0 -64 512 512'
    style={{ fill: props.fill, height: props.height, width: props.width }}
  >
    <Path d='m149.332031 106.667969c0 23.5625-19.101562 42.664062-42.664062 42.664062-23.566407 0-42.667969-19.101562-42.667969-42.664062 0-23.566407 19.101562-42.667969 42.667969-42.667969 23.5625 0 42.664062 19.101562 42.664062 42.667969zm0 0' />
    <Path d='m448 0h-384c-35.285156 0-64 28.714844-64 64v256c0 1.195312.296875 2.324219.363281 3.519531-.300781 2.558594-.171875 5.140625.765625 7.574219 5.269532 29.996094 31.382813 52.90625 62.871094 52.90625h384c35.285156 0 64-28.714844 64-64v-256c0-35.285156-28.714844-64-64-64zm-384 42.667969h384c11.753906 0 21.332031 9.578125 21.332031 21.332031v169.367188l-112.210937-112.214844c-14.59375-14.59375-38.335938-14.59375-52.90625 0l-101.546875 101.546875-26.882813-26.878907c-14.589844-14.59375-38.335937-14.59375-52.90625 0l-80.210937 80.210938v-212.03125c0-11.753906 9.578125-21.332031 21.332031-21.332031zm0 0' />
  </Svg>
);
export const video = props => (
  <Svg
    x='0px'
    y='0px'
    viewBox='0 0 467.968 467.968'
    style={{ fill: props.fill, height: props.height, width: props.width }}
    // style='enable-background:new 0 0 467.968 467.968;'
  >
    <G>
      <G>
        <Path
          d='M264.704,96.512H51.2c-28.16,0-51.2,23.04-51.2,51.2v172.544c0,28.16,23.04,51.2,51.2,51.2h213.504
			c28.16,0,51.2-23.04,51.2-51.2V147.712C315.904,119.04,292.864,96.512,264.704,96.512z'
        />
      </G>
    </G>
    <G>
      <G>
        <Path
          d='M430.08,124.672c-3.072,0.512-6.144,2.048-8.704,3.584l-79.872,46.08V293.12l80.384,46.08
			c14.848,8.704,33.28,3.584,41.984-11.264c2.56-4.608,4.096-9.728,4.096-15.36V154.368
			C467.968,135.424,450.048,120.064,430.08,124.672z'
        />
      </G>
    </G>
  </Svg>
);