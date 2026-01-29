import { Recorder } from "./Recorder";
import { ExperimentConfig } from "../ExperimentConfig";

export class ExperimentMFRL {
  public static writeObjectsToCsvFile(
    UserId: any,
    ExperimentIteration: number,
    Adaptation: any[],
    Emotion: any[],
    level: number,
    ZombieKills: number,
    fileName: string
  ): void {
    const allData = Adaptation.concat(Emotion);

    allData.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.timesliceStart);
      const dateB = new Date(b.timestamp || b.timesliceStart);
      return dateA.getTime() - dateB.getTime();
    });

      const headerRow = [
          "UserId",
          "ExperimentCondition",
          "ExperimentIteration",
          "level",
          "ZombieKills"
      ];    const emotionColumns = Object.keys(Recorder.emotionResults[0]);
    const adaptationColumns: string[] = Adaptation.map((data) => data.Name);
    const allColumns = [
      ...emotionColumns,
      "Adaptation name",
      "Adaptation time",
    ];

    headerRow.push(...allColumns);

    const dataRows = allData.map((data, index) => {
      const row = [
        UserId,
          ExperimentConfig.getConditionName(),
        ExperimentIteration,
        level,
        ZombieKills,
        ...emotionColumns.map((column) => {
          const previousData = index > 0 ? allData[index - 1][column] : null;
          return data[column] || previousData || "";
        }),
        ...adaptationColumns.map(() => ""),
        "",
        "",
      ];

      if (Adaptation.includes(data)) {
        const adaptationIndex = allColumns.indexOf("Adaptation name");
        row[5 + adaptationIndex] = data.Name;
        row[5 + adaptationIndex + 1] = data.timestamp || "";
      }

      return row;
    });

    const rows = [headerRow, ...dataRows];
    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

      link.download = `${ExperimentConfig.getConditionName()}-${fileName}-Iter${ExperimentIteration}.csv`;    link.click();

    URL.revokeObjectURL(url);
  }
}
