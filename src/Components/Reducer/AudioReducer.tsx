import { useReducer, createContext } from "react";

type Play = { type: 'play' };
type Pause = { type: 'pause' };
type ImportMp3 = { type: 'importMp3', payload: string }
type AllowMicrophone = { type: 'allowMic', payload: AnalyserNode }
type AppActions = Play | Pause | ImportMp3 | AllowMicrophone;

interface AppState {
  audio: null | HTMLAudioElement;
  frequencySize: number;
  analyzer: null |  AnalyserNode;
  typeOfPlay: 'mp3' | 'microphone' | 'none';
  paused: boolean;
}

const initialState : AppState = { audio: null, frequencySize: 256, analyzer: null, typeOfPlay: 'none', paused: true };

function AudioReducer(state: AppState, action: AppActions) {
  console.log("reducer", action)
  switch (action.type) {
    case 'play':
      if(!state.audio) {
        return state;
      }
      state.audio.play();
      return { ...state, paused: false, audio: state.audio };
    case 'pause':
      if(!state.audio) {
        return state;
      }
      state.audio.pause();
      return { ...state, paused: true, audio: state.audio };
    case 'importMp3':
      const audio = new Audio();
      audio.src = action.payload;
      audio.autoplay = false;

      const analyzer = createAnalyser(audio, state.frequencySize);
      return { ...state, typeOfPlay: "mp3", audio, analyzer }
    case 'allowMic':
        return { ...state, paused: false, typeOfPlay: 'microphone', analyzer: action.payload };
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
  console.log(state)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
