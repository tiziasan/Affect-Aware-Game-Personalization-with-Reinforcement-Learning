import { GameElement } from "./GameElement";
import { State } from "./State";
import { Gamedifficulty, Popup, Emotion, Sound, ColorOFNPC } from "./enums";
import { LLMService } from "./LLMService";
import { LLMTracker } from "./LLMTracker";



export enum Actions {
  Hard,
  Regular,
  Easy,
  Colorred,
  Colorgreen,
  Popuphidden,
  PopupVisible,
  SoundHorror,
  SoundNormal,
  DoNothing
}

 export class QLearner {
   i = 0;
  private emotionalState:State = new State();
  private GameElement:GameElement[] = [];
  private gamma:number;
  private alpha:number;
  private epsilon:number;
  private qTable:any[] = [];
  private rewardTable:any[] = [];
  private actions:string[] = []

  private intervalID:(NodeJS.Timer|undefined);
  private inputEmotions:number[] = []
  private action_index:number;
  private llmService?: LLMService;
  private fearStartTime: number | null = null;
  private fearThreshold: number = 10000;


     constructor(gameElements: GameElement[], llmService?: LLMService) {
      this.alpha = 0.9;
      this.gamma = 0.9;
      this.epsilon = 0.9;
      this.action_index = 999;
      this.GameElement = gameElements;
      this.llmService = llmService;

      this.setupAgent()
    }

  private getGameElement = (element:number) => {
    return this.GameElement[element];
  }
  private getGameElements = ():GameElement[] => {
    return this.GameElement;
  }
  private getEmotionalState = ():State => {
    return this.emotionalState;
  }
  private setRewardsTable = (rewardsArr:any[]) => {
    this.rewardTable = rewardsArr;
  }
  public setQ_Values = (qtable:any[]) => {
    this.qTable = qtable;
  }
  public getQ_values = ():any[] => {
    return this.qTable;
  }
  private setActions = (actions:string[]) => {
    this.actions = actions;
  }


  public getEmotion = () => {
    return this.emotionalState
  }
     private getGameContext = () => {
         const emotionNames = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgusted", "Surprised"];

         return {
             currentEmotion: this.emotionalState.getCurrentEmotion(),
             recentEmotions: this.inputEmotions.slice(-5), // Last 5 emotions
             currentDifficulty: this.getGameElement(1).getState() === 0 ? "EASY" :
                 this.getGameElement(1).getState() === 1 ? "REGULAR" : "HARD",
             currentColor: this.getGameElement(0).getState() === 0 ? "RED" : "GREEN",
             currentSound: this.getGameElement(2).getState() === 0 ? "SoundHorror" : "SoundNormal",
             currentPopup: this.getGameElement(3).getState() === 0 ? "HIDDEN" : "VISIBLE"
         };
     };






     public addInputEmotion = (emotion:number) => {
    this.inputEmotions.push(emotion)
  }

  private FindValueOfCurrentState = (currentLayer: any[], depth: number):[] => {
    if (depth <= this.GameElement.length - 1) {
      return this.FindValueOfCurrentState(currentLayer[this.getGameElement(depth).getState()], depth + 1);
    } else {
      return currentLayer[this.getEmotionalState().getCurrentEmotion()];
    }
  }


     private update_user_emotion = async () => {
         const mostOccuringEmotion = (arr:number[]) => {
             return arr.sort((a,b) =>
                 arr.filter(v => v===a).length
                 - arr.filter(v => v===b).length
             ).pop()
         }

         let emotion = mostOccuringEmotion(this.inputEmotions)
         if(emotion !== undefined && emotion >= 0){
             const previousEmotion = this.getEmotionalState().getCurrentEmotion();
             this.getEmotionalState().setCurrentEmotionalState(emotion)

             // Track fear duration
             if(emotion === 4) { // Fearful
                 if(previousEmotion !== 4) {
                     // Just started feeling fear
                     this.fearStartTime = Date.now();
                 }
             } else {
                 // No longer fearful, reset timer
                 this.fearStartTime = null;
             }
         }

         this.inputEmotions = []
     }
     private getFearReward = (): number => {
         if(this.fearStartTime === null) {
             return 2; // Default short thrill
         }

         const fearDuration = Date.now() - this.fearStartTime;

         if(fearDuration < this.fearThreshold) {
             // Short thrill window - positive excitement
             return 2;
         } else {
             // Persistent and high fear - negative experience
             return -3;
         }
     }

// NEW CODE - with tracking:
     private next_action = (epsilon: number): number => {
         const emotionNames = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgusted", "Surprised"];
         const actionNames = ["Hard", "Regular", "Easy", "Colorred", "Colorgreen",
             "Popuphidden", "PopupVisible", "SoundHorror", "SoundNormal", "DoNothing"];

         const context = this.getGameContext();
         const currentEmotion = this.emotionalState.getCurrentEmotion();
         let random = Math.random();

         if(random < epsilon){
             // Q-table exploitation
             const qValues = this.FindValueOfCurrentState(this.qTable, 0);
             let index_of_best_action = qValues.reduce((iMax:any, x:any, i:any, arr:any) => x > arr[iMax] ? i : iMax, 0);

             console.log("🎯 Using Q-table action:", index_of_best_action);

             LLMTracker.recordDecision({
                 timestamp: new Date().toISOString(),
                 decisionSource: "Q-table",
                 action: index_of_best_action,
                 actionName: actionNames[index_of_best_action],
                 currentEmotion,
                 emotionName: emotionNames[currentEmotion],
                 qValue: qValues[index_of_best_action],
                 gameState: {
                     difficulty: context.currentDifficulty,
                     color: context.currentColor,
                     sound: context.currentSound,
                     popup: context.currentPopup
                 }
             });

             return index_of_best_action;
         } else {
             // Random exploration
             const randomAction = Math.floor(Math.random() * this.actions.length);

             console.log("🎲 Using random exploration:", randomAction);

             LLMTracker.recordDecision({
                 timestamp: new Date().toISOString(),
                 decisionSource: "Random",
                 action: randomAction,
                 actionName: actionNames[randomAction],
                 currentEmotion,
                 emotionName: emotionNames[currentEmotion],
                 gameState: {
                     difficulty: context.currentDifficulty,
                     color: context.currentColor,
                     sound: context.currentSound,
                     popup: context.currentPopup
                 }
             });

             return randomAction;
         }
     }

     private next_action_with_llm = async (epsilon: number): Promise<number> => {
         const random = Math.random();
         const emotionNames = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgusted", "Surprised"];
         const actionNames = ["Hard", "Regular", "Easy", "Colorred", "Colorgreen",
             "Popuphidden", "PopupVisible", "SoundHorror", "SoundNormal", "DoNothing"];

         // Get current context for tracking
         const context = this.getGameContext();
         const currentEmotion = this.emotionalState.getCurrentEmotion();

         // 70% Q-table exploitation
         if (random < epsilon * 0.7) {
             const qValues = this.FindValueOfCurrentState(this.qTable, 0);  // ✅ Get Q-values
             const index_of_best_action = qValues.reduce(
                 (iMax: any, x: any, i: any, arr: any) => x > arr[iMax] ? i : iMax,
                 0
             );

             console.log("🎯 Using Q-table action:", index_of_best_action);

             LLMTracker.recordDecision({
                 timestamp: new Date().toISOString(),
                 decisionSource: "Q-table",
                 action: index_of_best_action,
                 actionName: actionNames[index_of_best_action],
                 currentEmotion,
                 emotionName: emotionNames[currentEmotion],
                 qValue: qValues[index_of_best_action],
                 gameState: {
                     difficulty: context.currentDifficulty,
                     color: context.currentColor,
                     sound: context.currentSound,
                     popup: context.currentPopup
                 }
             });

             return index_of_best_action;
         }


         else if (random < epsilon * 0.7 + 0.25 && this.llmService) {
             try {
                 const context = this.getGameContext();
                 const llmResponse = await this.llmService.getSuggestion(context);
                 console.log("🤖 Using LLM suggestion:", llmResponse.suggestedAction,
                     "- Rationale:", llmResponse.rationale);

                 LLMTracker.recordDecision({
                     timestamp: new Date().toISOString(),
                     decisionSource: "LLM",
                     action: llmResponse.suggestedAction,
                     actionName: actionNames[llmResponse.suggestedAction],
                     currentEmotion,
                     emotionName: emotionNames[currentEmotion],
                     llmRationale: llmResponse.rationale,
                     llmConfidence: llmResponse.confidence,
                     gameState: {
                         difficulty: context.currentDifficulty,
                         color: context.currentColor,
                         sound: context.currentSound,
                         popup: context.currentPopup
                     }
                 });


                 return llmResponse.suggestedAction;
             } catch (error) {
                 console.error("❌ LLM failed, falling back to Q-table");
                 return this.next_action(epsilon);
             }
         }

         else {
             const randomAction = Math.floor(Math.random() * this.actions.length);
             console.log("🎲 Using random exploration:", randomAction);
             LLMTracker.recordDecision({
                 timestamp: new Date().toISOString(),
                 decisionSource: "Random",
                 action: randomAction,
                 actionName: actionNames[randomAction],
                 currentEmotion,
                 emotionName: emotionNames[currentEmotion],
                 gameState: {
                     difficulty: context.currentDifficulty,
                     color: context.currentColor,
                     sound: context.currentSound,
                     popup: context.currentPopup
                 }
             });
             return randomAction;
         }
     };


     private next_state = async (action_index:number) => {

    for (let i = 0; i < this.getGameElements().length; i++) {
      let element = this.getGameElement(i);

      for (let j = 0; j < element.getState_Count(); j++) {

        if(this.actions[action_index] === `${element.getName()}_action${j}`){

          if(element.getState() !== j){
            this.action_index = action_index
            element.setState(j)
          } else {
              await this.next_state(
                  this.llmService
                      ? await this.next_action_with_llm(this.epsilon)
                      : this.next_action(this.epsilon)
              )
          }
        }
      }
    }

    if(this.actions[action_index] === 'do_Nothing'){
      this.action_index = action_index
    }

    this.update_user_emotion();
  }



  private makeArray(dimensions:any) {
    if (dimensions.length > 0) {
      let dim = dimensions[0];
      let rest = dimensions.slice(1);
      let newArray = new Array();
      for (let i = 0; i < dim; i++) {
        newArray[i] = this.makeArray(rest);
      }
      return newArray;
    } else {
      return 0;
    }
   }

  private setupActions = () => {
    let actionsArr:string[] = []
    for (let i = 0; i < this.getGameElements().length; i++) {
      let element = this.getGameElement(i);
      for (let j = 0; j < element.getState_Count(); j++) {
        actionsArr.push(`${element.getName()}_action${j}`)
      }
    }
    actionsArr.push('do_Nothing');
    this.setActions(actionsArr);
  }

  private setupQtable = () => {
    if (localStorage.getItem('qTable') === null) {
      const arr: number[] = []

      for (let i = 0; i < this.GameElement.length; i++) {
        arr.push(this.GameElement[i].getState_Count());
      }
      arr.push(this.getEmotionalState().getAvailableState_Count());
      arr.push(this.actions.length)

      //@ts-ignore
      this.setQ_Values(this.makeArray(arr))

    }
  }

  private setupRewards = () => {

    const arr: number[] = []
    for (let i = 0; i < this.GameElement.length; i++) {
      arr.push(this.GameElement[i].getState_Count());
    }
    arr.push(this.getEmotionalState().getAvailableState_Count());

    //@ts-ignore
    this.setRewardsTable(this.makeArray(arr))

      const emotionValues: Record<number, number> = {
          0: 0,   // Neutral
          1: 5,   // Happy
          2: -3,  // Sad
          3: -4,  // Angry
          4: 2,   // Fearful
          5: -5,  // Disgusted
          6: 3    // Surprised
      };

    const SetRewards = (currentLayer: any[]) => {
      if (!Array.isArray(currentLayer[0])) {
        const keys = Object.keys(emotionValues);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = emotionValues[+key];

          currentLayer[i] = value;
        }
      } else {
        for (let i = 0; i < currentLayer.length; i++) {
          SetRewards(currentLayer[i]);
        }
      }
    }
    SetRewards(this.rewardTable);
  }


  private populateQtable = () => {

    for (let i = 0; i < this.GameElement[0].getState_Count(); i++) {  //ColorOFNPC
      for (let j = 0; j < this.GameElement[1].getState_Count(); j++) { //Gamedifficulty
        for (let k = 0; k < this.GameElement[2].getState_Count(); k++) { // Sound
          for (let l=0; l < this.GameElement[3].getState_Count(); l++){ // Popup

              this.qTable[i][j][k][Popup.VISIBLE][Emotion.ANGRY][Actions.Popuphidden] = 10;
              this.qTable[i][j][k][Popup.VISIBLE][Emotion.DISGUSTED][Actions.Popuphidden] = 10;
              this.qTable[i][j][k][Popup.VISIBLE][Emotion.SAD][Actions.Popuphidden] = 10;

              this.qTable[i][j][Sound.SoundHorror][k][Emotion.ANGRY][Actions.SoundNormal] = 10;
              this.qTable[i][j][Sound.SoundHorror][k][Emotion.DISGUSTED][Actions.SoundNormal] = 10;
              this.qTable[i][j][Sound.SoundHorror][k][Emotion.SAD][Actions.SoundNormal] = 10;

              this.qTable[i][Gamedifficulty.HARD][k][l][Emotion.ANGRY][Actions.Regular] = 10;
              this.qTable[i][Gamedifficulty.HARD][k][l][Emotion.DISGUSTED][Actions.Regular] = 10;
              this.qTable[i][Gamedifficulty.HARD][k][l][Emotion.SAD][Actions.Regular] = 10;

          }

        }
      }
    }
    }


  private setupAgent = () => {
    this.setupActions();
    this.setupQtable();
    this.populateQtable();
    this.setupRewards();
  }

   public run = async (callback: (index_of_last_action:number) => void): Promise<void> => {

    await this.update_user_emotion();

    this.intervalID = setInterval( async () => {

        this.action_index = this.llmService
            ? await this.next_action_with_llm(this.epsilon)
            : this.next_action(this.epsilon);

      const oldStates: number[] = [];
      for (let i = 0; i < this.GameElement.length; i++) {
        oldStates.push(this.getGameElement(i).getState());
      }
      oldStates.push(this.getEmotionalState().getCurrentEmotion());

      this.next_state(this.action_index)

      oldStates.push(this.action_index)

      const getQTableValue = (currentLayer: any[], depth: number): number => {
        if (depth < oldStates.length - 1) {
          return getQTableValue(currentLayer[oldStates[depth]], depth + 1);
        }
        return currentLayer[oldStates[depth]];
      }

      const setQTableValue = (currentLayer: any[], depth: number, value: number): void => {
        if (depth < oldStates.length - 1) {
          return setQTableValue(currentLayer[oldStates[depth]], depth + 1, value);
        }
        // @ts-ignore
        currentLayer[oldStates[depth]] = value;
      }


        let reward = this.FindValueOfCurrentState(this.rewardTable, 0) as unknown as number;

        if(this.getEmotionalState().getCurrentEmotion() === 4) {
            reward = this.getFearReward();
        }

        // @ts-ignore
      let old_q_value = getQTableValue(this.qTable, 0);

      // @ts-ignore
      let temporal_difference = reward + (this.gamma * Math.max(...this.FindValueOfCurrentState(this.qTable, 0))) - old_q_value


      let new_q_value = old_q_value + (this.alpha * temporal_difference)



      setQTableValue(this.qTable, 0, new_q_value)

      callback(this.action_index);

    }, 1000 * 30)
  }

  public stop = () => {
    if(this.intervalID) {
      clearInterval(this.intervalID)
    }
  }










}



