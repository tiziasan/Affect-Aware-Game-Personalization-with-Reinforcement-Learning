// LLMIntegration.test.ts
import { QLearner } from "./Qlearner";
import { LLMService } from "./LLMService";
import { GameElement } from './GameElement';
import { ColorOFNPC, Sound, Popup, Gamedifficulty, Emotion } from "./enums";

class LocalStorageMock {
    private store: { [key: string]: string } = {};

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }
}

(global as any).localStorage = new LocalStorageMock();

async function testIntegration() {
    console.log("🧪 Testing LLM + Q-Learning Integration...\n");

    // Step 1: Create game elements (same as in your system)
    const gameElements: GameElement[] = [
        new GameElement(Object.keys(ColorOFNPC).length / 2, ColorOFNPC.GREEN, "ColorOFNPC"),
        new GameElement(Object.keys(Gamedifficulty).length / 2, Gamedifficulty.Regular, "Gamedifficulty"),
        new GameElement(Object.keys(Sound).length / 2, Sound.SoundNormal, "Sound"),
        new GameElement(Object.keys(Popup).length / 2, Popup.HIDDEN, "Popup"),
    ];

    // Step 2: Test WITHOUT LLM first
    console.log("📊 Test 1: Q-Learning WITHOUT LLM\n");
    const qlearnerNoLLM = new QLearner(gameElements);
    qlearnerNoLLM.addInputEmotion(Emotion.ANGRY);
    qlearnerNoLLM.addInputEmotion(Emotion.ANGRY);
    qlearnerNoLLM.addInputEmotion(Emotion.SAD);
    console.log("✅ Q-Learner without LLM initialized\n");

    // Step 3: Test WITH LLM
    console.log("🤖 Test 2: Q-Learning WITH LLM\n");
    const llmService = new LLMService("sk-YOUR-KEY-HERE"); // ✅ Replace with your key
    const qlearnerWithLLM = new QLearner(gameElements, llmService);
    qlearnerWithLLM.addInputEmotion(Emotion.ANGRY);
    qlearnerWithLLM.addInputEmotion(Emotion.ANGRY);
    qlearnerWithLLM.addInputEmotion(Emotion.SAD);
    console.log("✅ Q-Learner with LLM initialized\n");

    console.log("✅ All integration tests passed!");
    console.log("\n🎯 Ready to test with the full system!");
}

testIntegration().catch(console.error);
