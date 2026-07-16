import { createContext, useReducer, useEffect } from 'react';

export const SpotifyContext = createContext();

const spotifyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload
      };

    case 'LOGOUT_SPOTIFY':
      return {
        token: null
      };

    default:
      return state;
  }
};

export const SpotifyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    spotifyReducer,
    {
      token: null
    }
  );

  // Load token from localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem(
      'spotify_token'
    );

    if (token) {
      dispatch({
        type: 'SET_TOKEN',
        payload: token
      });
    }
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};