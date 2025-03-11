import { useReducer, createContext } from "react";

type Play = { type: 'play' };
type Pause = { type: 'pause' };
type ImportMp3 = { type: 'importMp3', payload: string }
type AppActions = Play | Pause | ImportMp3;

interface AppState {
  audio: null | HTMLAudioElement;
  frequencySize: number;
  analyzer: null |  AnalyserNode;
}

const initialState : AppState = { audio: null, frequencySize: 256, analyzer: null };

function AudioReducer(state: AppState, action: AppActions) {
  console.log(action)
  switch (action.type) {
    case 'play':
      if(!state.audio) {
        return state;
      }
      state.audio.play();
      console.log(state.audio.paused)
      return { ...state, audio: state.audio };
    case 'pause':
      if(!state.audio) {
        return state;
      }
      state.audio.pause();
      console.log(state.audio.paused)
      return { ...state, audio: state.audio };
    case 'importMp3':
      const audio = new Audio();
      audio.src = action.payload;
      audio.autoplay = false;

      const analyzer = createAnalyser(audio, state.frequencySize);
      return { ...state, audio, analyzer }
    default:
      return state;
  }
}


function createAnalyser(audio: AudioNode, frequencySize: number) {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyzer = audioContext.createAnalyser();
    let source = audioContext.createMediaElementSource(audio);
    source.connect(analyzer);
    //analyzer.current.connect(context.destination);

    analyzer.fftSize = frequencySize;
    return analyzer;
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
