/**
 * API Configuration Module for AI Chatbot
 * Handles OpenAI integration and API management
 */
class APIConfig {
    constructor() {
        this.config = null;
        this.openai = null;
        this.isInitialized = false;
        this.initializationPromise = null;
    }

    /**
     * Initialize the API configuration
     */
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._initialize();
        return this.initializationPromise;
    }

    async _initialize() {
        try {
            await this.loadConfig();
            await this.initializeOpenAI();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize API Config:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Load configuration from JSON file
     */
    async loadConfig() {
        try {
            const response = await fetch('../config/api-keys.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            this.config = await response.json();
        } catch (error) {
            console.error('Error loading config:', error);
            // Fallback to default config
            this.config = {
                openai: {
                    apiKey: null,
                    model: "gpt-3.5-turbo",
                    maxTokens: 500,
                    temperature: 0.7
                },
                chatbot: {
                    name: "AI Assistant",
                    welcomeMessage: "Hello! I'm your AI Assistant. How can I help you today?",
                    maxHistoryLength: 50
                }
            };
        }
    }

    /**
     * Initialize OpenAI client
     */
    async initializeOpenAI() {
        if (!this.config?.openai?.apiKey || this.config.openai.apiKey === 'your-openai-api-key-here') {
            console.warn('OpenAI API key not configured');
            return;
        }

        try {
            await this.loadOpenAILibrary();
            this.openai = new window.OpenAI({
                apiKey: this.config.openai.apiKey,
                dangerouslyAllowBrowser: true
            });
        } catch (error) {
            console.error('Failed to initialize OpenAI:', error);
        }
    }

    /**
     * Load OpenAI library from CDN
     */
    async loadOpenAILibrary() {
        return new Promise((resolve, reject) => {
            if (window.OpenAI) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/openai@4.0.0/dist/index.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load OpenAI library'));
            document.head.appendChild(script);
        });
    }

    /**
     * Get OpenAI client instance
     */
    getOpenAIClient() {
        return this.openai;
    }

    /**
     * Check if OpenAI is available
     */
    isOpenAIAvailable() {
        return this.isInitialized && this.openai && this.config?.openai?.apiKey && 
               this.config.openai.apiKey !== 'your-openai-api-key-here';
    }

    /**
     * Generate text using OpenAI
     */
    async generateText(prompt, options = {}) {
        if (!this.isOpenAIAvailable()) {
            throw new Error('OpenAI not available');
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: this.config.openai.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: options.maxTokens || this.config.openai.maxTokens,
                temperature: options.temperature || this.config.openai.temperature
            });

            return response.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    /**
     * Get chatbot configuration
     */
    getChatbotConfig() {
        return this.config?.chatbot || {};
    }
}

// Create global instance
window.apiConfig = new APIConfig(); 