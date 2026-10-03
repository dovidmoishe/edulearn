import httpClient from "../utils/httpClient";
import { createClient } from "../utils/supabase/client";

export type Message = {
    id: string;
    createdAt: Date;
    chatId: string;
    role: string;
    content: unknown;
}

const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export class AIService {
    async getTitle(message: Message) {
        try {
            const response = await httpClient.post('/ai/title', message);
            return response.data;
        } catch (error) {
            console.error("Error generating title:", error);
            throw error;
        }
    }

    async generateMessages(dto: {
        messages: Array<Message>;
        chatId: string;
        userId: string;
    }) {
        try {
            const response = await httpClient.post('/ai/message', dto);
            
            
            return response.data;
        } catch (error) {
            console.error("Error generating messages:", error);
            throw error;
        }
    }

    async generateQuiz(dto: { chatId: string; userId: string }) {
        try {
            const response = await httpClient.post('/ai/quiz', dto);
            if (response.data && typeof response.data === 'string' && response.data.includes('Error:')) {
                throw new Error(response.data);
            }
            
            if (response.data && response.data.message && response.data.message.includes('Error:')) {
                throw new Error(response.data.message);
            }
            
            return response.data;
        } catch (error: any) {
            console.error("Error generating quiz:", error);
            
            let errorMessage = "Failed to generate quiz. Please try again later.";
            
            if (error.message && error.message.includes('Not enough conversation content')) {
                errorMessage = "Not enough conversation content. Have at least 2 exchanges with the AI to generate a meaningful quiz.";
            } else if (error.message && error.message.includes('already been tested')) {
                errorMessage = "This chat has already been used for a quiz. Each conversation can only generate one quiz.";
            } else if (error.message && error.message.includes('No quiz attempts left')) {
                errorMessage = "You've reached your daily quiz limit. Quiz attempts reset daily.";
            } else if (error.message && error.message.includes('Insufficient credits')) {
                errorMessage = "You need at least 0.5 credits to generate a quiz. Purchase more credits to continue.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                if (error.response?.status === 403) {
                    errorMessage = "You don't have permission to generate a quiz from this chat, or you've run out of quiz attempts for today.";
                } else if (error.response?.status === 404) {
                    errorMessage = "Chat not found. Please try refreshing the app.";
                } else if (error.response?.status === 400) {
                    errorMessage = "Invalid request. Please check your internet connection and try again.";
                } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    errorMessage = "Request timed out. The AI service is taking longer than usual. Please try again.";
                } else if (error.message?.includes('Network Error') || !error.response) {
                    errorMessage = "Network error. Please check your internet connection and try again.";
                }
            }
            
            const processedError = new Error(errorMessage);
            processedError.name = 'QuizGenerationError';
            throw processedError;
        }
    }

    async generateSuggestions(dto: { userId: string }) {
        try {
            const response = await httpClient.post('/ai/suggestions', dto);
            console.log('Suggestions:', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error generating suggestions:", error);
            
            let errorMessage = "Failed to generate suggestions. Please try again later.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                if (error.response?.status === 404) {
                    errorMessage = "User not found. Please try refreshing the app.";
                } else if (error.response?.status === 400) {
                    errorMessage = "Invalid request. Please check your internet connection and try again.";
                } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    errorMessage = "Request timed out. The AI service is taking longer than usual. Please try again.";
                } else if (error.message?.includes('Network Error') || !error.response) {
                    errorMessage = "Network error. Please check your internet connection and try again.";
                }
            }
            
            const processedError = new Error(errorMessage);
            processedError.name = 'SuggestionsGenerationError';
            throw processedError;
        }
    }

    async generateMessagesStream(
        dto: {
            messages: Array<Message>;
            chatId: string;
            userId: string;
        },
        onToken: (token: string, type?: string) => void,
        onComplete: (fullMessage: Message) => void,
        onError: (error: Error) => void,
        onStreamReady?: (cleanup: () => void) => void,
    ) {
        let abortController: AbortController | null = null;
        const clientStreamStartedAtMs = Date.now();
        let firstSseChunkAtMs: number | null = null;
        let firstTokenRenderedAtMs: number | null = null;

        try {
            const initResponse = await httpClient.post("/ai/message-stream/init", dto);
            const { streamId } = initResponse.data;

            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const supabase = createClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error("No access token found. Please log in again.");
            }

            abortController = new AbortController();
            const cleanup = () => {
                abortController?.abort();
            };
            onStreamReady?.(cleanup);

            void (async () => {
                try {
                    const response = await fetch(
                        `${API_URL}ai/message-stream/${streamId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.access_token}`,
                                Accept: "text/event-stream",
                                "x-no-compression": "1",
                            },
                            signal: abortController?.signal,
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();

                    if (!reader) {
                        throw new Error("No response body");
                    }

                    let fullResponse = "";
                    let buffer = "";

                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            break;
                        }
                        if (!firstSseChunkAtMs) {
                            firstSseChunkAtMs = Date.now();
                            console.log(
                                JSON.stringify({
                                    aiStreamClientLatency: true,
                                    stage: "first_sse_chunk_received",
                                    streamId,
                                    sinceStartMs:
                                        firstSseChunkAtMs -
                                        clientStreamStartedAtMs,
                                }),
                            );
                        }

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            if (line.startsWith("data: ")) {
                                const data = line.slice(6);

                                if (data === "[DONE]") {
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);

                                    if (parsed.token) {
                                        if (!firstTokenRenderedAtMs) {
                                            firstTokenRenderedAtMs = Date.now();
                                            console.log(
                                                JSON.stringify({
                                                    aiStreamClientLatency: true,
                                                    stage: "first_token_rendered",
                                                    streamId,
                                                    sinceStartMs:
                                                        firstTokenRenderedAtMs -
                                                        clientStreamStartedAtMs,
                                                }),
                                            );
                                        }
                                        fullResponse += parsed.token;
                                        onToken(parsed.token, parsed.type);
                                    }
                                } catch (e) {
                                    console.error(
                                        "Failed to parse SSE data:",
                                        data,
                                        e,
                                    );
                                }
                            }
                        }
                    }

                    onComplete({
                        id: generateUUID(),
                        role: "assistant",
                        content: fullResponse,
                        createdAt: new Date(),
                        chatId: dto.chatId,
                    });
                    console.log(
                        JSON.stringify({
                            aiStreamClientLatency: true,
                            stage: "stream_completed",
                            streamId,
                            totalMs: Date.now() - clientStreamStartedAtMs,
                            firstSseChunkMs:
                                firstSseChunkAtMs !== null
                                    ? firstSseChunkAtMs -
                                      clientStreamStartedAtMs
                                    : null,
                            firstTokenRenderedMs:
                                firstTokenRenderedAtMs !== null
                                    ? firstTokenRenderedAtMs -
                                      clientStreamStartedAtMs
                                    : null,
                        }),
                    );
                } catch (error: any) {
                    if (error?.name === "AbortError") {
                        return;
                    }

                    console.error("Error in streaming messages:", error);

                    let errorMessage = "Failed to generate response. Please try again.";

                    if (error?.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error?.message) {
                        errorMessage = error.message;
                    }

                    onError(new Error(errorMessage));
                }
            })();

            return cleanup;
        } catch (error: any) {
            if (error?.name === "AbortError") {
                return () => {};
            }

            console.error("Error in streaming messages:", error);

            let errorMessage = "Failed to generate response. Please try again.";

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            onError(new Error(errorMessage));
            return () => {
                abortController?.abort();
            };
        }
    }
}
