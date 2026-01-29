import { addEntry } from "./ExperimentTable";
import { Actions } from "../Qlearner";
import { clearTempArray, getTempArray } from "../InputEmotion";

let AllEmotions = [];
let Act = [];

let HardArray: [string, number][][] = [];
let RegularArray: any[][] = [];
let EasyArray: any[][] = [];
let popupArray: any[][] = [];
let RedColorArray: any[][] = [];
let GreenColorArray: any[][] = [];
let SoundArray: any[][] = [];
let Soundoff: any[][] = [];
let PopHid: any[][] = [];
let DoNothing: any[][] = [];

const calcMean = (GetEmotion: [string, number][][]): Record<string, number> => {
  const counts: { [key: string]: number } = {
    neutral: 0,
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
  };

  if (GetEmotion && GetEmotion.length > 0 && GetEmotion[0].length > 0) {
    GetEmotion.forEach((emotionArr) => {
      emotionArr.forEach((emotion) => {
        const [name, value] = emotion;
        counts[name] += value;
      });
    });

    const totalCount = GetEmotion.length * GetEmotion[0].length;

    return {
      neutral: counts.neutral / totalCount,
      happy: counts.happy / totalCount,
      sad: counts.sad / totalCount,
      angry: counts.angry / totalCount,
      fearful: counts.fearful / totalCount,
      disgusted: counts.disgusted / totalCount,
      surprised: counts.surprised / totalCount,
    };
  } else {
    return {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    };
  }
};

export const SetAllEmotions = (GetEmotion: [string, any][]) => {
  AllEmotions.push(GetEmotion);
};

export const GetAction = (Action: string) => {
  Act.push(Action);
};
let meancalc;
export const RecordData = async (action_index: number) => {
  switch (action_index) {
    case Actions.Hard:
      HardArray = await takeinparam();
      meancalc = calcMean(HardArray);
      addEntry(
        "Actions.Hard",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.Regular:
      RegularArray = await takeinparam();
      meancalc = calcMean(RegularArray);
      addEntry(
        "Actions.Regular",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );
      break;
    case Actions.Easy:
      EasyArray = await takeinparam();
      meancalc = calcMean(EasyArray);
      addEntry(
        "Actions.Easy",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.Colorred:
      RedColorArray = await takeinparam();
      meancalc = calcMean(RedColorArray);
      addEntry(
        "Actions.Colorred",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );
      break;
    case Actions.Colorgreen:
      GreenColorArray = await takeinparam();
      meancalc = calcMean(GreenColorArray);
      addEntry(
        "Actions.Colorgreen",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.Popuphidden:
      PopHid = await takeinparam();
      meancalc = calcMean(PopHid);
      addEntry(
        "Actions.Popuphidden",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.PopupVisible:
      popupArray = await takeinparam();
      meancalc = calcMean(popupArray);
      addEntry(
        "Actions.PopupVisible",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.SoundHorror:
      SoundArray = await takeinparam();
      meancalc = calcMean(SoundArray);
      addEntry(
        "Actions.SoundON",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.SoundNormal:
      Soundoff = await takeinparam();
      meancalc = calcMean(Soundoff);
      addEntry(
        "Actions.Soundoff",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
    case Actions.DoNothing:
      DoNothing = await takeinparam();
      meancalc = calcMean(DoNothing);
      addEntry(
        "Actions.DoNothing",
        meancalc.neutral,
        meancalc.happy,
        meancalc.sad,
        meancalc.angry,
        meancalc.fearful,
        meancalc.disgusted,
        meancalc.surprised
      );

      break;
  }
};

const takeinparam = async () => {
  clearTempArray();
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 28000);
  });

  return getTempArray();
};


