// LLMService.test.ts
import { LLMService } from "./LLMService";
import { Emotion } from "./enums";

// Simple test function
async function testLLMService() {
    console.log("🧪 Testing LLM Service...\n");

    // Step 1: Initialize
    const llmService = new LLMService("");
    // Step 2: Create test context
    const testContext = {
        currentEmotion: Emotion.ANGRY,
        recentEmotions: [Emotion.ANGRY, Emotion.SAD, Emotion.ANGRY],
        currentDifficulty: "HARD",
        currentColor: "RED",
        currentSound: "SoundHorror",
        currentPopup: "VISIBLE"
    };

    // Step 3: Get suggestion
    const response = await llmService.getSuggestion(testContext);

    // Step 4: Verify response
    console.log("📊 Response received:");
    console.log("  - Action:", response.suggestedAction);
    console.log("  - Rationale:", response.rationale);
    console.log("  - Confidence:", response.confidence);

    console.log("\n✅ Test completed successfully!");
}

// Run the test
testLLMService().catch(console.error);
