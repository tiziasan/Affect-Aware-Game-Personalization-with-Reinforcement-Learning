// AdaptationCon.ts
import { Actions, QLearner } from "./Qlearner";
import { GameElement } from './GameElement';
import { GetAction, RecordData } from './Visualizer/MeanCalculator';
import { ColorOFNPC, Sound, Popup, Gamedifficulty, Emotion } from "./enums";
import { createContext, useContext, useEffect, useState } from "react";
import { SendData } from "./DataContext"
import {ExperimentIteration} from "./Visualizer/Experiment"
import {ExperimentMFRL} from "./Visualizer/ExperimentMFRL"
import { LLMService } from './LLMService';
import { Recorder } from "./Visualizer/Recorder";
import { ExperimentConfig } from "./ExperimentConfig";



export enum adaptionModes {
    FIRST_MFRL,
    SECOND_MFRL,
    THIRD_MFRL,
}

const adaptionModesList = [
    adaptionModes.FIRST_MFRL,
    adaptionModes.SECOND_MFRL,
    adaptionModes.THIRD_MFRL
];

const GameElements: GameElement[] = [
    new GameElement(Object.keys(ColorOFNPC).length / 2, ColorOFNPC.GREEN, "ColorOFNPC"),
    new GameElement(Object.keys(Gamedifficulty).length / 2, Gamedifficulty.Regular, "Gamedifficulty"),
    new GameElement(Object.keys(Sound).length / 2, Sound.SoundNormal, "Sound"),
    new GameElement(Object.keys(Popup).length / 2, Popup.HIDDEN, "Popup"),
];

let flag = false;
let Qlearner: QLearner | null = null;

const initializeRLAgent = () => {
    if (Qlearner === null) {
        ExperimentConfig.printConfig();

        if (!ExperimentConfig.shouldUseRL()) {
            console.log("📊 Baseline mode - No RL agent initialized");
            return;
        }

        const llmService = ExperimentConfig.shouldUseLLM()
            ? new LLMService(ExperimentConfig.getAPIKey())
            : undefined;

        Qlearner = new QLearner(GameElements, llmService);

        if (ExperimentConfig.shouldUseLLM() && llmService) {
            console.log("🤖 Q-Learning initialized WITH LLM guidance (70% Q / 25% LLM / 5% Random)");
        } else {
            console.log("📊 Q-Learning initialized WITHOUT LLM - Pure RL (90% Q / 10% Random)");
        }
    }
};

export const updateEmotionMFRL = (emotion: Emotion) => {
    initializeRLAgent();

    if (!ExperimentConfig.shouldUseRL()) {
        console.log(`😊 Emotion recorded: ${emotion} (Baseline - No adaptation)`);
        return;
    }

    if (!Qlearner) return;
    Qlearner.addInputEmotion(emotion);

    if (!Qlearner) throw new Error("Reinforcement Learning Agent not initialized");

    if(flag === false){
        ExperimentIteration.reset();
        ExperimentIteration.setUser();
        flag = true;
        StartIterations(Qlearner);
    }
};

const StartIterations = (Qlearner : any) => {
    const currentExperiment = adaptionModesList[ExperimentIteration.getExperimentIteration()];
    switch(currentExperiment) {
        case adaptionModes.FIRST_MFRL:
            if (localStorage.getItem("qtable") !== null) {
                Qlearner.setQ_Values(JSON.parse(localStorage.getItem("qtable") as string));
            }
            Qlearner.run(QlearnerSendState);
            break;
        case adaptionModes.SECOND_MFRL:
            if (localStorage.getItem("qtable") !== null) {
                Qlearner.setQ_Values(JSON.parse(localStorage.getItem("qtable") as string));
            }
            Qlearner.run(QlearnerSendState);
            break;
        case adaptionModes.THIRD_MFRL:
            if (localStorage.getItem("qtable") !== null) {
                Qlearner.setQ_Values(JSON.parse(localStorage.getItem("qtable") as string));
            }
            Qlearner.run(QlearnerSendState);
            break;
    }
};

export const stopQlearning = () => {
    if (!ExperimentConfig.shouldUseRL()) {
        console.log("📊 Baseline mode - No Q-learner to stop");
        return;
    }

    if (!Qlearner) {
        console.warn("⚠️ Q-learner not initialized yet");
        return;
    }

    Qlearner.stop();
    localStorage.setItem("qtable", JSON.stringify(Qlearner.getQ_values()));
    console.log("✅ Q-learner stopped and Q-table saved");
};

export const setupExperiment = () => {
    ExperimentIteration.incrementExperimentIteration();

    if (!ExperimentConfig.shouldUseRL()) {
        console.log(`📊 Baseline Iteration ${ExperimentIteration.getExperimentIteration() + 1} - No adaptations`);
        return;
    }

    if (ExperimentIteration.getExperimentIteration() < adaptionModesList.length) {
        StartIterations(Qlearner);
    } else {
        console.log("All iterations completed");
    }
};

const recordAdaption = (Name: string) => {
    Recorder.addAdaptation({
        Name: Name,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    });
};

const QlearnerSendState = (action_index: Actions) => {
    switch (action_index) {
        case Actions.Hard:
            SendData(Actions.Hard);
            RecordData(Actions.Hard);
            recordAdaption("Actions.Hard");
            break;
        case Actions.Regular:
            SendData(Actions.Regular);
            RecordData(Actions.Regular);
            recordAdaption("Actions.Regular");
            break;
        case Actions.Easy:
            SendData(Actions.Easy);
            RecordData(Actions.Easy);
            recordAdaption("Actions.Easy");
            break;
        case Actions.Colorred:
            SendData(Actions.Colorred);
            RecordData(Actions.Colorred);
            recordAdaption("Actions.Colorred");
            break;
        case Actions.Colorgreen:
            SendData(Actions.Colorgreen);
            RecordData(Actions.Colorgreen);
            recordAdaption("Actions.Colorgreen");
            break;
        case Actions.Popuphidden:
            SendData(Actions.Popuphidden);
            RecordData(Actions.Popuphidden);
            recordAdaption("Actions.Popuphidden");
            break;
        case Actions.PopupVisible:
            SendData(Actions.PopupVisible);
            RecordData(Actions.PopupVisible);
            recordAdaption("Actions.PopupVisible");
            break;
        case Actions.SoundHorror:
            SendData(Actions.SoundHorror);
            RecordData(Actions.SoundHorror);
            recordAdaption("Actions.SoundHorror");
            break;
        case Actions.SoundNormal:
            SendData(Actions.SoundNormal);
            RecordData(Actions.SoundNormal);
            recordAdaption("Actions.SoundNormal");
            break;
        case Actions.DoNothing:
            RecordData(Actions.DoNothing);
            recordAdaption("ActionsDoNothing");
            break;
    }
};
