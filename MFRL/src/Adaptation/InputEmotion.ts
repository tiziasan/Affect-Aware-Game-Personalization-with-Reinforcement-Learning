import { WithFaceExpressions, FaceDetection, FaceExpressions } from "face-api.js";
import { updateEmotionMFRL } from "./AdaptationCon";
import { GetAction, SetAllEmotions } from './Visualizer/MeanCalculator';
import { Recorder } from "./Visualizer/Recorder";

let tempArray: any[][] = [];

const timesliceLength = 1000; // ms - track emotion every 1 second
export let timesliceStart = +new Date();

export const getEmoji = async (
    detectionsWithExpressions: WithFaceExpressions<{
        detection: FaceDetection;
        expressions: FaceExpressions;
    }>[]
) => {
    detectionsWithExpressions.map((detectionsWithExpression) => {
        const Array = Object.entries(detectionsWithExpression.expressions);
        const scoresArray = Array.map((i) => i[1]);
        const expressionsArray = Array.map((i) => i[0]);
        const max = Math.max.apply(null, scoresArray);
        const index = scoresArray.findIndex((score) => score === max);

        if (max > 0.90) {
            const currentTime = +(new Date());

            if (currentTime - timesliceStart >= timesliceLength) {
                Recorder.GetEmotion([Array], timesliceStart, new Date(currentTime));

                const expression = expressionsArray[index];
                recordEmotion(expression);
                processArray(Array);
                updateEmotionMFRL(index);

                timesliceStart = currentTime;
            }
        }
    });
};

const recordEmotion = (EmotionName: string) => {
    Recorder.addEmotion({
        Name: EmotionName,
        timestamp: +(new Date())
    });
};

export const clearEmotion = () => {
    timesliceStart = +new Date();
};

export const processArray = (arr: any[]) => {
    tempArray.push(arr);
};

export const getTempArray = () => {
    return tempArray;
};

export const clearTempArray = () => {
    tempArray = [];
};
