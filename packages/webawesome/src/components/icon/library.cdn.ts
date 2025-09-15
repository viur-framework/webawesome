import { getKitCode } from '../../utilities/base-path.js';
import type { IconLibrary } from './library.js';

const FA_VERSION = '7.0.1';

function getIconUrl(name: string, family: string, variant: string) {
  const kitCode = getKitCode();
  const isPro = kitCode.length > 0;
  let folder = 'solid';

  // Notdog (Pro+)
  if (family === 'notdog') {
    if (variant === 'solid') folder = 'solid';
    if (variant === 'duo-solid') folder = 'duo-solid';
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/notdog-${folder}/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Chisel (Pro+)
  if (family === 'chisel') {
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/chisel-regular/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Etch (Pro+)
  if (family === 'etch') {
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/etch-solid/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Jelly (Pro+)
  if (family === 'jelly') {
    if (variant === 'regular') folder = 'regular';
    if (variant === 'duo-regular') folder = 'duo-regular';
    if (variant === 'fill-regular') folder = 'fill-regular';
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/jelly-${folder}/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Slab (Pro+)
  if (family === 'slab') {
    if (variant === 'solid' || variant === 'regular') folder = 'regular';
    if (variant === 'press-regular') folder = 'press-regular';
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/slab-${folder}/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Thumbprint (Pro+)
  if (family === 'thumbprint') {
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/thumbprint-light/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

  // Whiteboard (Pro+)
  if (family === 'whiteboard') {
    return `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/whiteboard-semibold/${name}.svg?token=${encodeURIComponent(kitCode)}`;
  }

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

  // Use the default CDN
  return isPro
    ? `https://ka-p.fontawesome.com/releases/v${FA_VERSION}/svgs/${folder}/${name}.svg?token=${encodeURIComponent(kitCode)}`
    : `https://ka-f.fontawesome.com/releases/v${FA_VERSION}/svgs/${folder}/${name}.svg`;
}

const cdnLibrary: IconLibrary = {
  name: 'cdn',
  resolver: (name: string, family = 'classic', variant = 'solid') => {
    return getIconUrl(name, family, variant);
  },
};

export default cdnLibrary;
