import { stopQlearning, setupExperiment } from "./AdaptationCon";
import { ExperimentIteration } from "./Visualizer/Experiment";
import { ExperimentMFRL } from "./Visualizer/ExperimentMFRL";
import { Recorder } from "./Visualizer/Recorder";
import { clearEmotion} from "./InputEmotion"
import { LLMTracker } from "./LLMTracker";
import {ExperimentConfig} from "./ExperimentConfig";

const serverUrl = "ws://localhost:8080";
let lastMessageTime = 0;
const messageDebounceTime = 5000;

const clientId = Math.random().toString(36).substr(2, 9);

// Send data to the server
export const SendData = async (data: any) => {
  try {
    const response = await fetch("http://localhost:8080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, clientId }),
    });
    const result = await response.json();
  
  } catch (error) {
    console.error("Error:", error);
  }
};

// Receive data from the server
const ws = new WebSocket(serverUrl);


ws.addEventListener("open", () => {
  console.log("WebSocket connection opened");
});

ws.addEventListener("message", (event) => {
    const now = Date.now();
    if (now - lastMessageTime > messageDebounceTime) {
        lastMessageTime = now;
        const parsedMessage = JSON.parse(event.data);

        if (parsedMessage.clientId !== clientId) {
            if (ExperimentConfig.shouldUseRL()) {
                stopQlearning();
            }
            console.log("\n🎮 GAME OVER - Generating Statistics...\n");
            if (ExperimentConfig.shouldUseLLM()) {
                LLMTracker.printStatistics();
            }
            const { kills, level } = parsedMessage.data;

            if (ExperimentConfig.shouldUseLLM()) {
                const decisionsCSV = LLMTracker.exportToCSV();
                const blob = new Blob([decisionsCSV], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${ExperimentConfig.getConditionName()}-decisions-iteration${ExperimentIteration.getExperimentIteration() + 1}.csv`;
                link.click();
                URL.revokeObjectURL(url);
            }

            ExperimentMFRL.writeObjectsToCsvFile(
                ExperimentIteration.getUser(),
                ExperimentIteration.getExperimentIteration() + 1,
                Recorder.getAdaption(),
                Recorder.emotionResults,
                level,
                kills,
                "Iteration"
            );

            Recorder.clearAdaption();
            Recorder.clearEmotions();
            Recorder.clearEmotionArray();
            if (ExperimentConfig.shouldUseLLM()) {
                LLMTracker.clear();
            }
            setupExperiment();
        }
    }
});
ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});
