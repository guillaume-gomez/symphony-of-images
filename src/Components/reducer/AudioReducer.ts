type Play = { type: 'play' };
type Pause = { type: 'pause' };
type ImportMp3 = { type: 'importMp3', payload: string }
type AppActions = Play | Pause | ImportMp3;

interface AppState {
  audio: null | HTMLAudioElement;
}


function AudioReducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'play':
      if(!audio) {
        return state;
      }
      state.audio.play();
    case 'pause':
      if(!audio) {
        return state;
      }
      state.audio.pause();
      return state;
    case 'importMp3':
      const audio = new Audio();
      audio.src = action.payload;
      audio.autoplay=false;

      return { audio }
    default:
      return state;
  }
}


export default AudioReducer;