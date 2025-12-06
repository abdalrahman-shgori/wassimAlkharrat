import 'swiper/react';
import type { SwiperOptions } from 'swiper/types';

declare module 'swiper/react' {
  import type { FC, ReactNode } from 'react';
  
  export interface SwiperProps extends SwiperOptions {
    children?: ReactNode;
    className?: string;
  }
  
  export interface SwiperSlideProps {
    children?: ReactNode;
    className?: string;
  }
  
  export const Swiper: FC<SwiperProps>;
  export const SwiperSlide: FC<SwiperSlideProps>;
}

