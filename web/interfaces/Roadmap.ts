export type Roadmap = {
    id: string;
    userId: string;
    chatId: string;
    topic: string;
    title: string;
    description: string;
    claimableNFT?: string | null;
    createdAt: Date;
}

export type RoadmapStep = {
    id: string;
    roadmapId: string;
    prompt: string;
    title: string;
    description: string;
    time: number;
    done?: boolean;
    subSteps: RoadmapSubStep[];
    progress: RoadmapStepProgress;
    createdAt: Date;
}

export type RoadmapSubStep = {
    id: string;
    stepId: string;
    title: string;
    description: string;
    context: string;
    sortOrder: number;
    done: boolean;
    completedAt: Date | null;
    createdAt: Date;
}

export type RoadmapStepProgress = {
    completedSubSteps: number;
    totalSubSteps: number;
    percentage: number;
}

export type RoadmapProgress = {
    completedSubSteps: number;
    totalSubSteps: number;
    completedSteps: number;
    totalSteps: number;
    percentage: number;
}

export type RoadmapWithSteps = {
    roadmap: Roadmap;
    steps: RoadmapStep[];
    progress: RoadmapProgress;
}

export type GenerateRoadmapDto = {
    userId: string;
    topic: string;
}

export type StartRoadmapStepDto = {
    userId: string;
    mode?: "sync" | "background";
}

export type StartRoadmapStepSyncResponse = {
    step: RoadmapStep;
    userMessage: {
        id: string;
        role: string;
        content: { text: string };
        createdAt: Date;
        chatId: string;
    };
    aiResponse: {
        id: string;
        role: string;
        content: { text: string };
        createdAt: Date;
        chatId: string;
    };
    nftAwarded?: boolean;
}

export type StartRoadmapStepBackgroundResponse = {
    status: "queued" | "already_started";
    chatId: string;
    roadmapId: string;
    step: RoadmapStep;
    message: string;
}

export type StartRoadmapStepResponse =
    | StartRoadmapStepSyncResponse
    | StartRoadmapStepBackgroundResponse;

export type RoadmapVerificationQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export type StartRoadmapVerificationResponse = {
    quiz: {
        id: string;
        roadmapId: string;
        stepId: string;
        subStepId: string;
        questions: RoadmapVerificationQuestion[];
        createdAt: Date;
    };
    passingScore: number;
    totalQuestions: number;
}

export type SubmitRoadmapVerificationAnswer = {
    questionIndex: number;
    selectedAnswer: string;
}

export type SubmitRoadmapVerificationDto = {
    userId: string;
    answers: SubmitRoadmapVerificationAnswer[];
}

export type SubmitRoadmapVerificationResponse = {
    score: number;
    totalQuestions: number;
    passed: boolean;
    passingScore: number;
    results: Array<{
        questionIndex: number;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
    subStep?: RoadmapSubStep;
    step?: RoadmapStep;
}




