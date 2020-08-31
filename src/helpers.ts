import { MyPayload } from './types';

/**
 * Checks JWT payload and throws error if undefined or userId key is undefined.
 * @param payload JWT payload
 */
export function checkPayload(payload: MyPayload | undefined) {
  if (!payload || (payload && typeof !payload.userId)) {
    throw new Error('not authenticated');
  }
}
