// LLMService.ts
import { Actions } from "./Qlearner";
import { Emotion } from "./enums";
import OpenAI from "openai";

interface LLMResponse {
    suggestedAction: Actions;
    rationale: string;
    confidence: number;
}

interface GameContext {
    currentEmotion: Emotion;
    recentEmotions: Emotion[];
    currentDifficulty: string;
    currentColor: string;
    currentSound: string;
    currentPopup: string;
}

export class LLMService {
    private openai?: OpenAI;
    private enabled: boolean;

    constructor(apiKey: string) {
        this.enabled = apiKey !== "" && apiKey !== "test-key";

        if (this.enabled) {
            this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
            console.log("✅ LLMService initialized with OpenAI API");
        } else {
            console.log("⚠️  LLMService initialized in TEST mode (no API calls)");
        }
    }

    async getSuggestion(context: GameContext): Promise<LLMResponse> {
        console.log("🤖 LLM called with context:", context);

        // If not enabled, return dummy response
        if (!this.enabled) {
            return {
                suggestedAction: Actions.DoNothing,
                rationale: "Test mode - API not connected",
                confidence: 0.5
            };
        }
        if (!this.openai) {
            return {
                suggestedAction: Actions.DoNothing,
                rationale: "OpenAI not initialized",
                confidence: 0.5
            };
        }

        try {
            // Build the prompt
            const prompt = this.buildPrompt(context);

            console.log("📤 Sending request to OpenAI...");

            // Call OpenAI API
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini", // Fast and cheap model
                messages: [
                    {
                        role: "system",
                        content: "You are a game adaptation AI expert. Respond ONLY with valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3, // Low temperature for consistent results
                max_tokens: 200,
                response_format: { type: "json_object" }
            });

            // Parse response
            const content = response.choices[0].message.content;
            const parsed = JSON.parse(content || "{}");

            console.log("📥 LLM Response:", parsed);

            return {
                suggestedAction: this.parseAction(parsed.action),
                rationale: parsed.rationale || "No rationale provided",
                confidence: parsed.confidence || 0.5
            };

        } catch (error) {
            console.error("❌ LLM Error:", error);
            // Fallback to safe action
            return {
                suggestedAction: Actions.DoNothing,
                rationale: "Error occurred, defaulting to DoNothing",
                confidence: 0.0
            };
        }
    }

    private buildPrompt(context: GameContext): string {
        const emotionNames = ["Neutral", "Happy", "Sad", "Angry", "Fearful", "Disgusted", "Surprised"];
        const emotionName = emotionNames[context.currentEmotion];
        const recentEmotionsStr = context.recentEmotions.map(e => emotionNames[e]).join(", ");

        return `You are analyzing a zombie shooter game where a player's emotions are tracked via facial recognition.

CURRENT GAME STATE:
- Player Emotion: ${emotionName}
- Recent Emotions: ${recentEmotionsStr}
- Difficulty: ${context.currentDifficulty}
- Zombie Color: ${context.currentColor}
- Sound: ${context.currentSound}
- Popup Messages: ${context.currentPopup}

AVAILABLE ACTIONS:
0. Hard - Set difficulty to HARD
1. Regular - Set difficulty to REGULAR  
2. Easy - Set difficulty to EASY
3. Colorred - Change zombies to RED (aggressive, alarming)
4. Colorgreen - Change zombies to GREEN (calm, neutral)
5. Popuphidden - Hide popup messages
6. PopupVisible - Show motivational popup messages
7. SoundHorror - Play horror background sound
8. SoundNormal - Play normal background sound
9. DoNothing - No adaptation needed

GOAL: Suggest ONE action that will help reduce negative emotions (Angry, Sad, Fearful, Disgusted) and promote positive emotions (Happy) or keep Neutral state.

RULES:
- If player is Angry/Sad at HARD difficulty → suggest easier difficulty
- If player is Angry/Fearful with RED zombies → suggest GREEN zombies
- If player is Angry/Disgusted with Horror sound → suggest Normal sound
- If player is Angry/Sad with VISIBLE popups → suggest hidden popups
- If player is Happy/Neutral → suggest DoNothing to maintain state

Respond in JSON format:
{
  "action": "action_name",
  "rationale": "brief explanation",
  "confidence": 0.8
}`;
    }

    private parseAction(actionName: string): Actions {
        const actionMap: { [key: string]: Actions } = {
            "Hard": Actions.Hard,
            "Regular": Actions.Regular,
            "Easy": Actions.Easy,
            "Colorred": Actions.Colorred,
            "Colorgreen": Actions.Colorgreen,
            "Popuphidden": Actions.Popuphidden,
            "PopupVisible": Actions.PopupVisible,
            "SoundHorror": Actions.SoundHorror,
            "SoundNormal": Actions.SoundNormal,
            "DoNothing": Actions.DoNothing
        };

        return actionMap[actionName] ?? Actions.DoNothing;
    }
}
