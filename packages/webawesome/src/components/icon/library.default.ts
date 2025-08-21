import { getBasePath } from '../../utilities/base-path.js';
import type { IconLibrary } from './library.js';

const library: IconLibrary = {
  name: 'default',
  resolver: (name: string, family = 'classic', variant = 'solid') => {
    let folder = variant;
    // Classic
    if (family === 'classic') {
      if (variant === 'thin') folder = 'thin';
      if (variant === 'light') folder = 'light';
      if (variant === 'regular') folder = 'regular';
      if (variant === 'solid') folder = 'solid';
    }

    // Sharp
    if (family === 'sharp') {
      if (variant === 'thin') folder = 'sharp-thin';
      if (variant === 'light') folder = 'sharp-light';
      if (variant === 'regular') folder = 'sharp-regular';
      if (variant === 'solid') folder = 'sharp-solid';
    }

    // Duotone
    if (family === 'duotone') {
      if (variant === 'thin') folder = 'duotone-thin';
      if (variant === 'light') folder = 'duotone-light';
      if (variant === 'regular') folder = 'duotone-regular';
      if (variant === 'solid') folder = 'duotone';
    }

    // Sharp Duotone
    if (family === 'sharp-duotone') {
      if (variant === 'thin') folder = 'sharp-duotone-thin';
      if (variant === 'light') folder = 'sharp-duotone-light';
      if (variant === 'regular') folder = 'sharp-duotone-regular';
      if (variant === 'solid') folder = 'sharp-duotone-solid';
    }

    // Brands
    if (family === 'brands') {
      folder = 'brands';
    }

    return getBasePath(`assets/icons/${folder}/${name}.svg`);
  },
};

export default library;
