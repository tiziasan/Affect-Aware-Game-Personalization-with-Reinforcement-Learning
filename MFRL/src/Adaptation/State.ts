export class State {

    private current_emotion;
    private maxAvailableStates = 7;

    constructor() {
        this.current_emotion = 0;
    }
    setCurrentEmotionalState = (emotion:number) => {
        this.current_emotion = emotion;
    }
    getCurrentEmotion = () => {
        return this.current_emotion;
    }
    getAvailableState_Count = () => {
        return this.maxAvailableStates;
    }
}

