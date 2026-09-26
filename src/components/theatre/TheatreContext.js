import { createContext, useContext } from 'react';

/**
 * Provided by the Trailers page. When present, trailer cards play inside the
 * Grand IMAX Theater instead of opening the video modal. `null` elsewhere.
 */
export const TheatreContext = createContext(null);

export const useTheatre = () => useContext(TheatreContext);
