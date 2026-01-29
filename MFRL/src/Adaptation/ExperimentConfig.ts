// ExperimentConfig.ts
export enum ExperimentCondition {
    BASELINE = "BASELINE",           // No adaptation
    RL_ONLY = "RL_ONLY",             // Pure Q-learning
    RL_WITH_LLM = "RL_WITH_LLM"      // Hybrid RL + LLM
}

export class ExperimentConfig {
    // CONDITION 1: Baseline (No adaptations)

    // private static currentCondition: ExperimentCondition = ExperimentCondition.BASELINE;

// CONDITION 2: RL Only (Pure Q-learning)
    private static currentCondition: ExperimentCondition = ExperimentCondition.RL_ONLY;

// CONDITION 3: RL + LLM (Hybrid)
    //private static currentCondition: ExperimentCondition = ExperimentCondition.RL_WITH_LLM;


    // Your OpenAI API key
    private static OPENAI_API_KEY = "API_KEY";

    // Get current experimental condition
    static getCondition(): ExperimentCondition {
        return this.currentCondition;
    }

    // Set condition (for testing)
    static setCondition(condition: ExperimentCondition): void {
        this.currentCondition = condition;
        console.log(`\n${"=".repeat(60)}`);
        console.log(`🧪 EXPERIMENT CONDITION: ${condition}`);
        console.log(`${"=".repeat(60)}\n`);
    }

    // Should we use RL?
    static shouldUseRL(): boolean {
        return this.currentCondition !== ExperimentCondition.BASELINE;
    }

    // Should we use LLM?
    static shouldUseLLM(): boolean {
        return this.currentCondition === ExperimentCondition.RL_WITH_LLM;
    }

    // Get API key
    static getAPIKey(): string {
        return this.OPENAI_API_KEY;
    }

    // Get condition name for file exports
    static getConditionName(): string {
        switch (this.currentCondition) {
            case ExperimentCondition.BASELINE:
                return "Baseline-NoAdaptation";
            case ExperimentCondition.RL_ONLY:
                return "RL-Only";
            case ExperimentCondition.RL_WITH_LLM:
                return "RL-LLM-Hybrid";
            default:
                return "Unknown";
        }
    }

    // Print current configuration
    static printConfig(): void {
        console.log("\n📋 EXPERIMENT CONFIGURATION:");
        console.log(`   Condition: ${this.currentCondition}`);
        console.log(`   Use RL: ${this.shouldUseRL()}`);
        console.log(`   Use LLM: ${this.shouldUseLLM()}`);
        console.log(`   Adaptations: ${this.shouldUseRL() ? "ENABLED" : "DISABLED"}`);
        console.log("");
    }
}
