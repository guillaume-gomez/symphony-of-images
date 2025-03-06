import { useReducer, createContext } from "react";

type Play = { type: 'play' };
type Pause = { type: 'pause' };
type ImportMp3 = { type: 'importMp3', payload: string }
type AppActions = Play | Pause | ImportMp3;

interface AppState {
  audio: null | HTMLAudioElement;
}

const initialState = { audio: null };

function AudioReducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'play':
      if(!audio) {
        return state;
      }
      state.audio.play();
      return state;
    case 'pause':
      if(!audio) {
        return state;
      }
      state.audio.pause();
      return state;
    case 'importMp3':
      const audio = new Audio();
      audio.src = action.payload;
      audio.autoplay = false;

      return { audio }
    default:
      return state;
  }
}



export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppActions>;
}>({
  state: initialState,
  dispatch: () => null
});

// Define the provider component
function AppContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(AudioReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
