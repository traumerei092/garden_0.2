declare module 'react-slick'{
  import React from 'react';

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    // 他の設定も必要に応じて追加
  }

  export default class Slider extends React.Component<Settings> {
    slickGoTo: (slide: number) => void;
  }
}