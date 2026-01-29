export class ExperimentIteration {

    private static HARDCODED_USER_ID = "User1";

    public static setUser() {
        localStorage.setItem("userID", this.HARDCODED_USER_ID);
    }

    public static getUser() {
        const currentUser = localStorage.getItem("userID");
        return currentUser;
    }

    public static getExperimentIteration(): number {
        const currentCount = localStorage.getItem("experimentIteration");
        if (currentCount) {
            return parseInt(currentCount);
        }
        return 0;
    }

    public static reset() {
        localStorage.setItem("experimentIteration", (0).toString());
    }

    public static incrementExperimentIteration(): void {
        const currentCount = this.getExperimentIteration();
        localStorage.setItem("experimentIteration", (currentCount + 1).toString());
    }
}
