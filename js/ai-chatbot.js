/**
 * AI Chatbot Class
 * Complete chatbot functionality with OpenAI integration
 */
class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.isLoading = false;
        this.isFullscreen = false;
        this.chatHistory = [];
        this.maxHistoryLength = 50;
        this.elements = {};
    }

    /**
     * Initialize the chatbot
     */
    async init() {
        this.createChatbotHTML();
        this.bindEvents();
        await this.initializeAPI();
    }

    /**
     * Create the complete HTML structure
     */
    createChatbotHTML() {
        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'ai-chatbot-toggle';
        toggleButton.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>AI Assistant</span>
        `;
        toggleButton.setAttribute('aria-label', 'Open AI Assistant');

        // Create main container
        const container = document.createElement('div');
        container.className = 'ai-chatbot-container';
        container.innerHTML = `
            <div class="ai-chatbot-header">
                <div class="ai-chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>AI Assistant</span>
                </div>
                <div class="ai-chatbot-actions">
                    <button class="ai-chatbot-fullscreen" aria-label="Toggle fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="ai-chatbot-close" aria-label="Close chatbot">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="ai-chatbot-messages">
                <div class="ai-chatbot-welcome">
                    <h3>Welcome! 🤖</h3>
                    <p>I'm your AI Assistant. I can help you with:</p>
                    <ul>
                        <li>Product information</li>
                        <li>General questions</li>
                        <li>Support and assistance</li>
                        <li>And much more!</li>
                    </ul>
                    <p>How can I assist you today?</p>
                </div>
            </div>
            <div class="ai-chatbot-input-area">
                <div class="ai-chatbot-input-group">
                    <input type="text" class="ai-chatbot-input" placeholder="Ask me anything ..." aria-label="Chat input">
                    <button class="ai-chatbot-send" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="ai-chatbot-quick-actions">
                    <button class="ai-chatbot-quick-btn" data-action="products">Products</button>
                    <button class="ai-chatbot-quick-btn" data-action="services">Services</button>
                    <button class="ai-chatbot-quick-btn" data-action="support">Support</button>
                    <button class="ai-chatbot-quick-btn" data-action="contact">Contact</button>
                </div>
            </div>
            <div class="ai-chatbot-status">
                <span class="ai-chatbot-status-text">Initializing...</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        // Store element references
        this.elements = {
            toggleButton,
            container,
            messages: container.querySelector('.ai-chatbot-messages'),
            input: container.querySelector('.ai-chatbot-input'),
            sendButton: container.querySelector('.ai-chatbot-send'),
            closeButton: container.querySelector('.ai-chatbot-close'),
            fullscreenButton: container.querySelector('.ai-chatbot-fullscreen'),
            status: container.querySelector('.ai-chatbot-status-text'),
            quickButtons: container.querySelectorAll('.ai-chatbot-quick-btn')
        };
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Toggle chatbot
        this.elements.toggleButton.addEventListener('click', () => this.toggleChatbot());

        // Close chatbot
        this.elements.closeButton.addEventListener('click', () => this.closeChatbot());

        // Fullscreen toggle
        this.elements.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());

        // Send message
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick action buttons
        this.elements.quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }

    /**
     * Initialize API connection
     */
    async initializeAPI() {
        try {
            await window.apiConfig.initialize();
            this.updateStatus();
            this.enableInput();
        } catch (error) {
            console.error('Failed to initialize API:', error);
            this.updateStatus('API not available - using fallback responses');
        }
    }

    /**
     * Toggle chatbot visibility
     */
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.isOpen = true;
            this.elements.container.classList.add('ai-chatbot-open');
            this.elements.input.focus();
        }
    }

    /**
     * Handle fullscreen state changes
     */
    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                               document.mozFullScreenElement || document.msFullscreenElement);
        
        this.isFullscreen = isFullscreen;
        
        if (isFullscreen) {
            // Entered fullscreen
            this.elements.container.classList.add('ai-chatbot-fullscreen');
            this.elements.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            this.elements.fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            // Exited fullscreen
            this.elements.container.classList.remove('ai-chatbot-fullscreen');
            this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        }
    }

    /**
     * Close chatbot
     */
    closeChatbot() {
        this.isOpen = false;
        
        // Exit fullscreen if active
        if (this.isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this.exitCSSFullscreen();
            }
        }
        
        this.elements.container.classList.remove('ai-chatbot-open', 'ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        
        // Reset container styles
        this.elements.container.style.display = '';
        this.elements.container.style.transform = '';
    }

    /**
     * Toggle fullscreen mode
     */
    async toggleFullscreen() {
        try {
            if (!this.isFullscreen) {
                // Enter fullscreen mode
                if (this.elements.container.requestFullscreen) {
                    await this.elements.container.requestFullscreen();
                } else if (this.elements.container.webkitRequestFullscreen) {
                    await this.elements.container.webkitRequestFullscreen();
                } else if (this.elements.container.msRequestFullscreen) {
                    await this.elements.container.msRequestFullscreen();
                } else {
                    // Fallback to CSS fullscreen if browser API not supported
                    this.enterCSSFullscreen();
                }
            } else {
                // Exit fullscreen mode
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                } else {
                    // Fallback to CSS fullscreen if browser API not supported
                    this.exitCSSFullscreen();
                }
            }
        } catch (error) {
            // Fullscreen API not supported, using CSS fallback
            if (!this.isFullscreen) {
                this.enterCSSFullscreen();
            } else {
                this.exitCSSFullscreen();
            }
        }
    }

    /**
     * Enter CSS fallback fullscreen mode
     */
    enterCSSFullscreen() {
        this.isFullscreen = true;
        this.elements.container.classList.add('ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        
        // Ensure the container is visible and properly positioned
        this.elements.container.style.display = 'flex';
        this.elements.container.style.transform = 'none';
        
        // Focus on input for better UX
        setTimeout(() => {
            this.elements.input.focus();
        }, 100);
    }

    /**
     * Exit CSS fallback fullscreen mode
     */
    exitCSSFullscreen() {
        this.isFullscreen = false;
        this.elements.container.classList.remove('ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        
        // Reset container styles
        this.elements.container.style.display = '';
        this.elements.container.style.transform = '';
    }

    /**
     * Send message and get response
     */
    async sendMessage() {
        const message = this.elements.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.elements.input.value = '';

        // Show loading
        this.setLoading(true);

        try {
            const response = await this.generateResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error generating response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Generate AI response
     */
    async generateResponse(message) {
        try {
            if (window.apiConfig.isOpenAIAvailable()) {
                const prompt = this.createPrompt(message);
                return await window.apiConfig.generateText(prompt);
            } else {
                return this.getFallbackResponse(message);
            }
        } catch (error) {
            console.error('AI response error:', error);
            return this.getFallbackResponse(message);
        }
    }

    /**
     * Create context-aware prompt for OpenAI
     */
    createPrompt(message) {
        return `You are a helpful AI assistant for a company. 
Please provide clear, concise, and helpful responses to customer inquiries.
Keep responses professional but friendly. If you don't know something specific about the company, 
suggest they contact support for detailed information.

User question: ${message}`;
    }

    /**
     * Handle quick action buttons
     */
    handleQuickAction(action) {
        const actions = {
            products: "Tell me about your products",
            services: "What services do you offer?",
            support: "I need help or support",
            contact: "How can I contact you?"
        };

        const message = actions[action] || "Tell me more about this.";
        this.elements.input.value = message;
        this.sendMessage();
    }

    /**
     * Get fallback responses when AI is unavailable
     */
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Products
        if (lowerMessage.includes('product')) {
            return "Our products are designed to meet your needs with the highest quality standards. " +
                   "We offer a wide range of solutions tailored to different requirements. " +
                   "Would you like to know more about a specific product category?";
        }

        // Services
        if (lowerMessage.includes('service')) {
            return "We provide comprehensive services including consultation, support, and customization. " +
                   "Our team is dedicated to ensuring you get the best possible experience. " +
                   "What specific service are you interested in?";
        }

        // Support
        if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
            return "I'm here to help! You can reach our support team through:\n\n" +
                   "• **Email**: support@company.com\n" +
                   "• **Phone**: +1 (555) 123-4567\n" +
                   "• **Live Chat**: Available during business hours\n\n" +
                   "What specific issue can I help you with?";
        }

        // Contact
        if (lowerMessage.includes('contact')) {
            return "You can reach us through multiple channels:\n\n" +
                   "• **General Inquiries**: info@company.com\n" +
                   "• **Sales**: sales@company.com\n" +
                   "• **Support**: support@company.com\n" +
                   "• **Phone**: +1 (555) 123-4567\n\n" +
                   "We typically respond within 24 hours during business days.";
        }

        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! 👋\n\n" +
                   "How can I assist you today?";
        }

        // Thanks
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're most welcome! 🙏\n\n" +
                   "If you have more questions, feel free to ask anytime!";
        }

        // Default response
        return "Thank you for your question! 🤔\n\n" +
               "I'm here to help with information about our products, services, and support. " +
               "Could you please be more specific about what you'd like to know?";
    }

    /**
     * Add message to chat
     */
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chatbot-message ai-chatbot-message-${sender}`;
        
        const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const formattedContent = this.formatMessage(content);
        
        messageDiv.innerHTML = `
            <div class="ai-chatbot-message-icon">
                <i class="${icon}"></i>
            </div>
            <div class="ai-chatbot-message-content">
                ${formattedContent}
            </div>
        `;

        this.elements.messages.appendChild(messageDiv);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;

        // Add to history
        this.chatHistory.push({ content, sender, timestamp: new Date() });
        if (this.chatHistory.length > this.maxHistoryLength) {
            this.chatHistory.shift();
        }
    }

    /**
     * Format message content
     */
    formatMessage(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.elements.sendButton.disabled = loading;
        this.elements.input.disabled = loading;
        
        if (loading) {
            this.elements.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            this.elements.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }

    /**
     * Update status indicator
     */
    updateStatus() {
        if (window.apiConfig.isOpenAIAvailable()) {
            this.elements.status.textContent = 'AI Assistant Ready';
            this.elements.status.className = 'ai-chatbot-status-text ai-chatbot-status-ready';
        } else {
            this.elements.status.textContent = 'ChatBot is offline';
            this.elements.status.className = 'ai-chatbot-status-text ai-chatbot-status-fallback';
        }
    }

    /**
     * Enable/disable input based on AI availability
     */
    enableInput() {
        const isAvailable = window.apiConfig.isOpenAIAvailable();
        this.elements.input.placeholder = isAvailable ? 
            "Ask me anything..." : 
            "Ask me anything (offline mode)...";
    }
}

// Create global instance
window.aiChatbot = new AIChatbot(); 