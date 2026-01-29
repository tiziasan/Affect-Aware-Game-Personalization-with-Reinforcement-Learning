export class Recorder {
  private static adaptions: {
    Name: string;
    timestamp: string;
  }[] = [];

  private static emotions: {
    Name: string;
    timestamp: number;
  }[] = [];

  public static addAdaptation(Name: { Name: string; timestamp: string }) {
    this.adaptions.push(Name);
  }

  public static getAdaption() {
    return this.adaptions;
  }

  public static clearAdaption() {
    this.adaptions = [];
  }

  public static addEmotion(Name: { Name: string; timestamp: number }) {
    this.emotions.push(Name);
  }

    private static formatToDecimals(value: number, decimals: number = 5): string {
        return value.toFixed(decimals);
    }

  public static GetEmotion(
    emotionsArray: [string, number][][],
    timesliceStart: number,
    timesliceEnd: Date
  ): Record<string, number> {
    const counts: Record<string, number> = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    };

    if (
      emotionsArray &&
      emotionsArray.length > 0 &&
      emotionsArray[0].length > 0
    ) {
      emotionsArray.forEach((emotionArr) => {
        emotionArr.forEach((emotion) => {
          const [name, value] = emotion;
          counts[name] += value;
        });
      });
    }

      const result: Record<string, any> = {
          neutral: this.formatToDecimals(counts.neutral),
          happy: this.formatToDecimals(counts.happy),
          sad: this.formatToDecimals(counts.sad),
          angry: this.formatToDecimals(counts.angry),
          fearful: this.formatToDecimals(counts.fearful),
          disgusted: this.formatToDecimals(counts.disgusted),
          surprised: this.formatToDecimals(counts.surprised),
          timesliceStart: new Date(timesliceStart).toLocaleString("en-US", {
              timeZone: "Europe/Copenhagen",
          }),
          timesliceEnd: new Date(timesliceEnd).toLocaleString("en-US", {
              timeZone: "Europe/Copenhagen",
          }),
      };

    Recorder.emotionResults.push(result);

    return result;
  }

  public static emotionResults: Record<string, number>[] = [];

  public static clearEmotionArray() {
    this.emotionResults = [];
  }

  public static getEmotion() {
    return this.emotions;
  }

  public static clearEmotions() {
    this.emotions = [];
  }
}
