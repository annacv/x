import { forEach, isObject } from '@empathyco/x-utils';
import { TailwindHelpers } from '../types';

const variablesPrefix = '--x';
const joinKeys = (...keys: string[]): string => [variablesPrefix, ...keys].join('-');

/**
 * Flatten object preserving the path in the keys.
 *
 * @param object - The object to flatten.
 * @param keys - Array containing keys to prepend to path.
 * @param joinFn - Method to join the keys, by default uses join('-').
 * @returns A flattened object.
 *
 * @example
 * ```ts
 *  const colors = {
 *     transparent: 'transparent',
 *     neutral: {
 *       0: '#FFFFFF',
 *       50: '#404040',
 *       100: '#000000',
 *       DEFAULT: '#808080'
 *     }
 *  }
 *  deepFlat(colors,['--x','color']);
 *
 *  // Result will be:
 *  {
 *    --x-color-transparent: 'transparent',
 *    --x-color-neutral-0: '#FFFFFF',
 *    --x-color-neutral-50: '#404040',
 *    --x-color-neutral-100: '#000000',
 *    --x-color-neutral-DEFAULT: '#808080'
 *  }
 * ```
 *
 *
 */
const deepFlat = (
  object: Record<string, unknown>,
  keys: string[] = [],
  joinFn: (...keys: string[]) => string = (...keys) => keys.join('-')
): { [key: string]: string } => {
  const flattenedObject = {};
  forEach(object, (key, value) => {
    if (isObject(value)) {
      Object.assign(flattenedObject, deepFlat(value, [...keys, key], joinFn));
    } else {
      Object.assign(flattenedObject, { [joinFn(...keys, key)]: value });
    }
  });
  return flattenedObject;
};

/**
 * Extract CSS variants for theme colors.
 *
 * @param root0 - Theme.
 * @returns All the styles for each utility and the values they are going to be generated with.
 *
 * @public
 */
export default function extractVariants({ theme }: Partial<TailwindHelpers>) {
  const filterColorKeys = (keys: string[]): string[] => keys.filter(key => key !== 'DEFAULT');
  const joinColorKeys = (...keys: string[]): string =>
    joinKeys('color-base', ...filterColorKeys(keys));

  // Get colors from theme
  const colors: Record<string, unknown> = theme('colors');

  // Get spacing from theme
  // const spacing: Record<string, any> = theme('spacing');

  // TODO: Create CSS Vars for sizes, typography and borders

  return {
    ':root': deepFlat(colors, [], joinColorKeys)
  };
}

/**
 * The return type of {@link extractVariants}.
 *
 * @public
 */
export type ReturnOfExtractVariants = ReturnType<typeof extractVariants>;
