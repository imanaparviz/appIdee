"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  X,
  Lightbulb,
  Code,
  CheckCircle,
  Clock,
  FileText,
  Github,
  Terminal,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "code" | "checklist" | "resource";
}

interface TaskAIChatProps {
  task: string;
  phase: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  color: string;
}

const getPhaseQuickActions = (phase: number, task: string): QuickAction[] => {
  const baseActions = [
    {
      id: "explain",
      title: "📝 Explain Task",
      description: "Detailed task explanation",
      icon: FileText,
      prompt: `Explain this task step by step: "${task}"`,
      color: "bg-blue-500",
    },
    {
      id: "code",
      title: "💻 Code Examples",
      description: "Practical code snippets",
      icon: Code,
      prompt: `Show me code examples for: "${task}"`,
      color: "bg-green-500",
    },
    {
      id: "checklist",
      title: "✅ Checklist",
      description: "Step-by-step checklist",
      icon: CheckCircle,
      prompt: `Create a detailed checklist for: "${task}"`,
      color: "bg-purple-500",
    },
    {
      id: "resources",
      title: "📚 Resources",
      description: "Helpful links and tools",
      icon: BookOpen,
      prompt: `What tools and resources do I need for: "${task}"?`,
      color: "bg-orange-500",
    },
  ];

  const phaseSpecificActions = {
    1: [
      {
        id: "requirements",
        title: "📋 Requirements",
        description: "Define requirements",
        icon: HelpCircle,
        prompt: `Help me define requirements for "${task}"`,
        color: "bg-cyan-500",
      },
    ],
    2: [
      {
        id: "setup",
        title: "⚙️ Setup Guide",
        description: "Development environment",
        icon: Terminal,
        prompt: `How do I set up the development environment for "${task}"?`,
        color: "bg-yellow-500",
      },
    ],
    3: [
      {
        id: "testing",
        title: "🧪 Testing",
        description: "Test strategies",
        icon: Zap,
        prompt: `How do I test "${task}" properly?`,
        color: "bg-red-500",
      },
    ],
    4: [
      {
        id: "deployment",
        title: "🚀 Deployment",
        description: "Deployment guide",
        icon: Github,
        prompt: `How do I deploy "${task}" to production?`,
        color: "bg-indigo-500",
      },
    ],
  };

  return [
    ...baseActions,
    ...(phaseSpecificActions[phase as keyof typeof phaseSpecificActions] || []),
  ];
};

const generateTaskSpecificGuidance = (
  task: string,
  phase: number,
  projectTitle: string
) => {
  const phaseNames = ["Planning", "Development", "Testing", "Deployment"];
  const currentPhase = phaseNames[phase - 1] || "Development";

  const taskKeywords = task.toLowerCase();
  const isAPI =
    taskKeywords.includes("api") || taskKeywords.includes("backend");
  const isUI =
    taskKeywords.includes("ui") ||
    taskKeywords.includes("frontend") ||
    taskKeywords.includes("design");
  const isDatabase =
    taskKeywords.includes("database") || taskKeywords.includes("datenbank");
  const isAuth =
    taskKeywords.includes("auth") || taskKeywords.includes("login");

  let specificTips = "";

  if (isAPI) {
    specificTips = `\n🔧 **API-specific Tips:**
• Define clear endpoints and HTTP methods
• Implement error handling and validation
• Document with OpenAPI/Swagger
• Test with Postman or Thunder Client`;
  } else if (isUI) {
    specificTips = `\n🎨 **UI-specific Tips:**
• Use React components and hooks
• Implement responsive design
• Focus on accessibility (a11y)
• Test on different screen sizes`;
  } else if (isDatabase) {
    specificTips = `\n🗄️ **Database-specific Tips:**
• Plan database structure in advance
• Use migrations for schema changes
• Implement indexes for performance
• Consider data validation and constraints`;
  } else if (isAuth) {
    specificTips = `\n🔐 **Authentication-specific Tips:**
• Use secure password hashing (bcrypt)
• Implement JWT or session-based auth
• Follow OWASP security guidelines
• Test edge cases (wrong credentials, etc.)`;
  }

  return `🤖 **AI Assistant for "${task}"**

**Phase:** ${currentPhase} (${phase}/4)
**Project:** ${projectTitle}

💡 **What I can do for you:**
• Provide step-by-step instructions
• Show code examples and best practices
• Help solve problems and debug
• Recommend tools and resources
• Set time estimates and priorities${specificTips}

🚀 **Let's get started!** Choose a Quick Action or ask me directly about this task!`;
};

const generateAIResponse = async (
  message: string,
  task: string,
  phase: number,
  projectTitle: string
): Promise<ChatMessage> => {
  // Simulate API call with intelligent responses
  const lowerMessage = message.toLowerCase();

  let response = "";
  let messageType: "text" | "code" | "checklist" | "resource" = "text";

  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("example") ||
    lowerMessage.includes("snippet")
  ) {
    messageType = "code";
    response = `🔧 **Code Example for "${task}":**

\`\`\`typescript
// Example implementation for ${task}
const handle${task.replace(/\s+/g, "")} = async () => {
  try {
    // TODO: Implement the logic here
    console.log('${task} is running...');
    
    // Example for ${
      phase === 1
        ? "Planning"
        : phase === 2
        ? "Development"
        : phase === 3
        ? "Testing"
        : "Deployment"
    }
    ${
      phase === 1
        ? "// Define requirements and data structures"
        : phase === 2
        ? "// Implement core functionality"
        : phase === 3
        ? "// Write tests and validate"
        : "// Prepare for production deployment"
    }
    
    return { success: true, message: '${task} completed successfully!' };
  } catch (error) {
    console.error('Error in ${task}:', error);
    throw error;
  }
};
\`\`\`

💡 **Next Steps:**
1. Adapt the code to your specific requirements
2. Add error handling
3. Test the functionality
4. Document the code`;
  } else if (
    lowerMessage.includes("checklist") ||
    lowerMessage.includes("steps") ||
    lowerMessage.includes("plan")
  ) {
    messageType = "checklist";
    response = `✅ **Detailed Checklist for "${task}":**

**🎯 Preparation:**
- [ ] Understand the exact requirements
- [ ] Gather all necessary assets/data
- [ ] Define acceptance criteria
- [ ] Estimate time effort

**⚡ Implementation:**
- [ ] Create the basic structure
- [ ] Implement core functionality
- [ ] Add error handling
- [ ] Document the code

**🧪 Testing & Quality:**
- [ ] Write unit tests
- [ ] Test edge cases
- [ ] Check performance
- [ ] Conduct code review

**🚀 Finalization:**
- [ ] Test integration
- [ ] Update documentation
- [ ] Ready for ${phase === 4 ? "production" : "next phase"}

⏱️ **Estimated Time:** ${
      phase === 1
        ? "2-4 hours"
        : phase === 2
        ? "4-8 hours"
        : phase === 3
        ? "2-3 hours"
        : "1-2 hours"
    }`;
  } else if (
    lowerMessage.includes("resource") ||
    lowerMessage.includes("tool") ||
    lowerMessage.includes("link")
  ) {
    messageType = "resource";
    response = `📚 **Helpful Resources for "${task}":**

**🛠️ Tools & Libraries:**
• VS Code Extensions for better productivity
• React DevTools for debugging
• Postman for API testing
• Github Copilot for code assistance

**📖 Documentation:**
• [MDN Web Docs](https://developer.mozilla.org) - Web Standards
• [React Docs](https://react.dev) - React Framework
• [Next.js Docs](https://nextjs.org/docs) - Next.js Features
• [TypeScript Handbook](https://www.typescriptlang.org/docs)

**🎥 Learning Resources:**
• YouTube Tutorials for ${task}
• FreeCodeCamp Guides
• Dev.to Articles
• Stack Overflow Community

**💡 Best Practices:**
• Clean Code Principles
• SOLID Design Patterns
• Test-Driven Development
• Agile Methodologies`;
  } else {
    // General intelligent response
    const responses = [
      `For "${task}" in Phase ${phase} I recommend the following approach:

**🎯 Main Focus:**
${
  phase === 1
    ? "Detailed planning and requirements definition"
    : phase === 2
    ? "Clean implementation and code quality"
    : phase === 3
    ? "Comprehensive testing and bug fixing"
    : "Stable deployment and monitoring"
}

**📋 Concrete Steps:**
1. **Start:** ${
        phase === 1
          ? "Analyze existing requirements"
          : phase === 2
          ? "Set up development environment"
          : phase === 3
          ? "Define test cases"
          : "Prepare production environment"
      }
2. **Core:** ${
        phase === 1
          ? "Create detailed specifications"
          : phase === 2
          ? "Implement step by step"
          : phase === 3
          ? "Run all tests"
          : "Deploy and monitor"
      }
3. **Finish:** ${
        phase === 1
          ? "Get review and approval"
          : phase === 2
          ? "Code review and refactoring"
          : phase === 3
          ? "Fix bugs and optimize"
          : "Document deployment"
      }

⚡ **Important Tip:** ${
        phase === 1
          ? "Take time for thorough planning - it saves time later!"
          : phase === 2
          ? "Write clean, documented code!"
          : phase === 3
          ? "Test edge cases and error scenarios too!"
          : "Monitor the application after launch!"
      }

🤔 **Do you need help with a specific part?**`,

      `Here's a detailed guide for "${task}":

**🚀 Quick Start Guide:**
• **Understand:** What exactly needs to be achieved?
• **Plan:** What steps are necessary?
• **Implement:** Proceed step by step
• **Test:** Check functionality and edge cases

**🎯 Phase-specific Tips:**
${
  phase === 1
    ? "📋 In planning phase: Gather all requirements, create user stories, define acceptance criteria"
    : phase === 2
    ? "💻 In development phase: Implement incrementally, write clean code, document"
    : phase === 3
    ? "🧪 In testing phase: Test thoroughly, automate tests, fix all bugs"
    : "🚀 In deployment phase: Deploy safely, monitor performance, gather user feedback"
}

**💡 Pro Tip:** For ${projectTitle} it's especially important that ${task} is ${
        phase === 1
          ? "well planned"
          : phase === 2
          ? "performantly implemented"
          : phase === 3
          ? "thoroughly tested"
          : "stably deployed"
      }.

❓ **Do you have specific questions or need help with a particular aspect?**`,
    ];

    response = responses[Math.floor(Math.random() * responses.length)];
  }

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  return {
    id: (Date.now() + Math.random()).toString(),
    content: response,
    sender: "bot",
    timestamp: new Date(),
    type: messageType,
  };
};

export function TaskAIChat({
  task,
  phase,
  projectTitle,
  isOpen,
  onClose,
}: TaskAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = getPhaseQuickActions(phase, task);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: generateTaskSpecificGuidance(task, phase, projectTitle),
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, task, phase, projectTitle]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(
        messageText,
        task,
        phase,
        projectTitle
      );
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, there was an error. Please try again! 🔄",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500 border-2 shadow-xl animate-in slide-in-from-top-2 duration-300">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                🤖 AI Task Assistant
              </CardTitle>
              <p className="text-sm text-gray-400 font-medium">{task}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700 border-gray-600"
                >
                  Phase {phase}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700 border-gray-600"
                >
                  {projectTitle}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col p-0">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            ⚡ Quick Actions:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className={`${action.color} text-white border-none hover:opacity-80 text-xs h-16 flex flex-col items-center justify-center`}
                disabled={isLoading}
              >
                <action.icon className="w-4 h-4 mb-1" />
                <span className="font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 max-h-80 overflow-y-auto p-4 bg-gray-800/30 border-b border-gray-700">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : message.type === "code"
                      ? "bg-gray-800 border border-green-500 text-gray-100"
                      : message.type === "checklist"
                      ? "bg-gray-800 border border-purple-500 text-gray-100"
                      : message.type === "resource"
                      ? "bg-gray-800 border border-orange-500 text-gray-100"
                      : "bg-gray-700 text-gray-100 border border-gray-600"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "bot" && (
                      <Bot className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex space-x-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about this task..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
