// LLMTracker.ts
import { Actions } from "./Qlearner";
import { Emotion } from "./enums";

interface DecisionRecord {
    timestamp: string;
    decisionSource: "Q-table" | "LLM" | "Random";
    action: Actions;
    actionName: string;
    currentEmotion: Emotion;
    emotionName: string;
    llmRationale?: string;
    llmConfidence?: number;
    qValue?: number;
    gameState: {
        difficulty: string;
        color: string;
        sound: string;
        popup: string;
    };
}

export class LLMTracker {
    private static decisions: DecisionRecord[] = [];

    static recordDecision(record: DecisionRecord): void {
        this.decisions.push(record);

        // Pretty print to console
        console.log("\n" + "=".repeat(60));
        console.log(`📊 Decision #${this.decisions.length} - ${record.decisionSource}`);
        console.log("=".repeat(60));
        console.log(`⏰ Time: ${record.timestamp}`);
        console.log(`😊 Emotion: ${record.emotionName} (${record.currentEmotion})`);
        console.log(`🎮 Game State: ${JSON.stringify(record.gameState)}`);
        console.log(`🎯 Action: ${record.actionName} (${record.action})`);

        if (record.decisionSource === "LLM") {
            console.log(`🤖 LLM Rationale: ${record.llmRationale}`);
            console.log(`📈 LLM Confidence: ${record.llmConfidence}`);
        } else if (record.decisionSource === "Q-table") {
            console.log(`📊 Q-Value: ${record.qValue}`);
        }

        console.log("=".repeat(60) + "\n");
    }

    static getStatistics() {
        const total = this.decisions.length;
        const qTableCount = this.decisions.filter(d => d.decisionSource === "Q-table").length;
        const llmCount = this.decisions.filter(d => d.decisionSource === "LLM").length;
        const randomCount = this.decisions.filter(d => d.decisionSource === "Random").length;

        return {
            total,
            qTableCount,
            llmCount,
            randomCount,
            qTablePercent: (qTableCount / total * 100).toFixed(1),
            llmPercent: (llmCount / total * 100).toFixed(1),
            randomPercent: (randomCount / total * 100).toFixed(1)
        };
    }

    static printStatistics(): void {
        const stats = this.getStatistics();

        console.log("\n" + "📊 DECISION STATISTICS " + "=".repeat(40));
        console.log(`Total Decisions: ${stats.total}`);
        console.log(`Q-Table: ${stats.qTableCount} (${stats.qTablePercent}%)`);
        console.log(`LLM: ${stats.llmCount} (${stats.llmPercent}%)`);
        console.log(`Random: ${stats.randomCount} (${stats.randomPercent}%)`);
        console.log("=".repeat(63) + "\n");
    }

    static getAllDecisions(): DecisionRecord[] {
        return this.decisions;
    }

    static clear(): void {
        this.decisions = [];
    }

    static exportToCSV(): string {
        const headers = [
            "timestamp",
            "decisionSource",
            "action",
            "actionName",
            "emotion",
            "emotionName",
            "llmRationale",
            "llmConfidence",
            "qValue",
            "difficulty",
            "color",
            "sound",
            "popup"
        ];

        const rows = this.decisions.map(d => [
            d.timestamp,
            d.decisionSource,
            d.action,
            d.actionName,
            d.currentEmotion,
            d.emotionName,
            d.llmRationale || "",
            d.llmConfidence || "",
            d.qValue || "",
            d.gameState.difficulty,
            d.gameState.color,
            d.gameState.sound,
            d.gameState.popup
        ]);

        return [headers, ...rows].map(row => row.join(",")).join("\n");
    }
}
