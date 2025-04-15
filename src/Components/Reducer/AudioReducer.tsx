import { useReducer, createContext, ReactNode, Dispatch } from "react";

type Play = { type: 'play' };
type Pause = { type: 'pause' };
type ImportMp3 = { type: 'importMp3', payload: string }
type AllowMicrophone = { type: 'allowMic', payload: { analyzer: AnalyserNode, source: MediaStreamAudioSourceNode, audioContext: AudioContext } }
type DisableMicrophone = { type: 'disableMic'};
type AppActions = Play | Pause | ImportMp3 | AllowMicrophone | DisableMicrophone;

interface AppState {
  audio: null | HTMLAudioElement;
  frequencySize: number;
  analyzer: null |  AnalyserNode;
  audioContext: null | AudioContext;
  source: null | MediaElementAudioSourceNode | MediaStreamAudioSourceNode;
  typeOfPlay: 'mp3' | 'microphone' | 'none';
  paused: boolean;
}

const initialState : AppState = {
  audio: null,
  frequencySize: 256,
  analyzer: null,
  audioContext: null,
  source: null,
  typeOfPlay: 'none',
  paused: true
};

function AudioReducer(state: AppState, action: AppActions) : AppState {
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
      {
        const audio = new Audio();
        audio.src = action.payload;
        audio.autoplay = false;


        {/* @ts-ignore: window.webkitAudioContext exist */}
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyzer = audioContext.createAnalyser();
        let source = audioContext.createMediaElementSource(audio);
        source.connect(analyzer);
        analyzer.fftSize = state.frequencySize;

        return { ...state, typeOfPlay: "mp3", audio, analyzer, audioContext, source }
      }
    case 'allowMic':
      {
        if(state.audio) {
          state.audio.pause();
        }
        const { analyzer, audioContext, source } = action.payload;
        return { ...state, paused: false, typeOfPlay: 'microphone', analyzer, audioContext, source };
      }  
    case 'disableMic':
        {/* @ts-ignore: window.localStream exist \°/ */}
        if(window.localStream) {
          {/* @ts-ignore: window.webkitAudioContext exist */}
          window.localStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
            track.stop();
          });
        }
        const { source, audioContext } = state;
        if(source) {
          source.disconnect();

        }
        if(audioContext && audioContext.state !== "closed") {
          audioContext.close();
        }
        return { ...state, paused: true, typeOfPlay: 'none', analyzer: null, audioContext: null, source: null };
    default:
      return state;
  }
}

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppActions>;
}>({
  state: initialState,
  dispatch: () => null
});

type ContextProviderProps = {
  children: ReactNode,
};

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
