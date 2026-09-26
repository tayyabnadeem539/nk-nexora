/**
 * FandomVerse - Pre-scripted Rule-based AI Chatbot Guide
 * SRS & Prompt Compliance:
 * - Purely frontend rule-based/pre-scripted knowledge base.
 * - NO external AI API, operates 100% offline from local JSON/JS data.
 * - Floating launcher across all pages.
 * - Suggested quick-reply chips for all 12 SRS questions.
 * - Direct navigation action buttons for smooth portal exploration.
 */

const Chatbot = {
  isOpen: false,
  hasInitialized: false,

  init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    this.renderWelcome();
    this.setupChipsHoverScroll();
  },

  // Auto-scrolls the quick-reply chips strip left/right based on
  // where the mouse is hovering inside it (right half = scroll right,
  // left half = scroll left). Lets users reach chips that overflow
  // the visible strip without needing a visible scrollbar.
  setupChipsHoverScroll() {
    const strip = document.getElementById('chatQuickRepliesStrip');
    if (!strip || strip._hoverScrollBound) return;
    strip._hoverScrollBound = true;

    let rafId = null;
    let scrollSpeed = 0;
    const maxSpeed = 5; // px per frame at the strip's edge
    const deadZone = 0.12; // fraction near center with no movement

    const step = () => {
      if (scrollSpeed !== 0) {
        strip.scrollLeft += scrollSpeed;
      }
      rafId = requestAnimationFrame(step);
    };

    strip.addEventListener('mousemove', (e) => {
      const rect = strip.getBoundingClientRect();
      if (rect.width === 0) return;
      const x = e.clientX - rect.left;
      const half = rect.width / 2;
      let offset = (x - half) / half; // -1 (far left) .. 1 (far right)

      if (Math.abs(offset) < deadZone) {
        scrollSpeed = 0;
      } else {
        scrollSpeed = offset * maxSpeed;
      }
    });

    strip.addEventListener('mouseenter', () => {
      if (!rafId) rafId = requestAnimationFrame(step);
    });

    strip.addEventListener('mouseleave', () => {
      scrollSpeed = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('chatbotWindow');
    const dot = document.querySelector('.chat-unread-dot');

    if (win) {
      if (this.isOpen) {
        win.classList.add('active');
        if (dot) dot.style.display = 'none';
        if (!this.hasInitialized) {
          this.init();
        }
        // Focus input
        setTimeout(() => {
          const input = document.getElementById('chatTextInput');
          if (input) input.focus();
        }, 300);
      } else {
        win.classList.remove('active');
      }
    }
  },

  renderWelcome() {
    const stream = document.getElementById('chatbotMessagesArea');
    const chipsStrip = document.getElementById('chatQuickRepliesStrip');
    if (!stream) return;

    const data = window.FANDOM_DATA?.chatbot || {};
    const welcome = data.welcomeMessage || "Hi! I'm the FandomVerse Guide. What would you like to explore?";

    // Initial greeting
    this.appendBotMessage(welcome);

    // Predefined chips
    if (chipsStrip && data.predefinedQuestions) {
      chipsStrip.innerHTML = data.predefinedQuestions.map(q => `
        <button type="button" class="chat-chip" onclick="Chatbot.handleChipClick('${q.id}')">
          ${q.question}
        </button>
      `).join('');
    }
  },

  handleChipClick(questionId) {
    const data = window.FANDOM_DATA?.chatbot || {};
    const item = data.predefinedQuestions?.find(q => q.id === questionId);
    if (!item) return;

    // Display user question
    this.appendUserMessage(item.question);

    // Simulate natural typing delay (250ms)
    setTimeout(() => {
      this.appendBotMessage(item.answer, item.action);
    }, 250);
  },

  handleUserInput() {
    const input = document.getElementById('chatTextInput');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    this.appendUserMessage(query);

    // Rule-based matching engine
    setTimeout(() => {
      this.processQuery(query);
    }, 300);
  },

  processQuery(rawQuery) {
    const query = rawQuery.toLowerCase();
    const data = window.FANDOM_DATA?.chatbot || {};

    // 1. Direct question match
    const exact = data.predefinedQuestions?.find(q =>
      query.includes(q.question.toLowerCase()) || q.question.toLowerCase().includes(query)
    );

    if (exact) {
      this.appendBotMessage(exact.answer, exact.action);
      return;
    }

    // 2. Keyword trigger matching
    const keywords = data.keywords || [];
    for (const kw of keywords) {
      if (kw.words.some(w => query.includes(w))) {
        this.appendBotMessage(kw.response, kw.action);
        return;
      }
    }

    // 3. Fallback smart response
    const fallbackAnswer = `I can help you explore FandomVerse! You can ask about our 7 hubs (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga), characters, trailers, merchandise cart, or search.`;
    this.appendBotMessage(fallbackAnswer, { label: "Explore All Categories", route: "#home" });
  },

  appendUserMessage(text) {
    const stream = document.getElementById('chatbotMessagesArea');
    if (!stream) return;

    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-user';
    div.textContent = text;
    stream.appendChild(div);
    this.scrollToBottom();
  },

  appendBotMessage(text, action = null) {
    const stream = document.getElementById('chatbotMessagesArea');
    if (!stream) return;

    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-bot';
    
    let html = `<p>${text}</p>`;
    if (action && action.label && action.route) {
      html += `
        <a href="${action.route}" class="chat-action-btn" onclick="Chatbot.toggle()">
          ${action.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      `;
    }

    div.innerHTML = html;
    stream.appendChild(div);
    this.scrollToBottom();
  },

  scrollToBottom() {
    const stream = document.getElementById('chatbotMessagesArea');
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  }
};

window.Chatbot = Chatbot;