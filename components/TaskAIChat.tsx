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
      title: "📝 Task erklären",
      description: "Detaillierte Erklärung der Aufgabe",
      icon: FileText,
      prompt: `Erkläre mir diese Aufgabe Schritt für Schritt: "${task}"`,
      color: "bg-blue-500",
    },
    {
      id: "code",
      title: "💻 Code Beispiele",
      description: "Praktische Code-Snippets",
      icon: Code,
      prompt: `Zeige mir Code-Beispiele für: "${task}"`,
      color: "bg-green-500",
    },
    {
      id: "checklist",
      title: "✅ Checkliste",
      description: "Step-by-step Checkliste",
      icon: CheckCircle,
      prompt: `Erstelle eine detaillierte Checkliste für: "${task}"`,
      color: "bg-purple-500",
    },
    {
      id: "resources",
      title: "📚 Ressourcen",
      description: "Hilfreiche Links und Tools",
      icon: BookOpen,
      prompt: `Welche Tools und Ressourcen brauche ich für: "${task}"?`,
      color: "bg-orange-500",
    },
  ];

  const phaseSpecificActions = {
    1: [
      {
        id: "requirements",
        title: "📋 Requirements",
        description: "Anforderungen definieren",
        icon: HelpCircle,
        prompt: `Hilf mir die Anforderungen für "${task}" zu definieren`,
        color: "bg-cyan-500",
      },
    ],
    2: [
      {
        id: "setup",
        title: "⚙️ Setup Guide",
        description: "Entwicklungsumgebung",
        icon: Terminal,
        prompt: `Wie richte ich die Entwicklungsumgebung für "${task}" ein?`,
        color: "bg-yellow-500",
      },
    ],
    3: [
      {
        id: "testing",
        title: "🧪 Testing",
        description: "Test-Strategien",
        icon: Zap,
        prompt: `Wie teste ich "${task}" richtig?`,
        color: "bg-red-500",
      },
    ],
    4: [
      {
        id: "deployment",
        title: "🚀 Deployment",
        description: "Deployment Guide",
        icon: Github,
        prompt: `Wie deploye ich "${task}" auf Production?`,
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
  const phaseNames = ["Planung", "Development", "Testing", "Deployment"];
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
    specificTips = `\n🔧 **API-spezifische Tipps:**
• Definiere klare Endpunkte und HTTP-Methoden
• Implementiere Fehlerbehandlung und Validierung
• Dokumentiere mit OpenAPI/Swagger
• Teste mit Postman oder Thunder Client`;
  } else if (isUI) {
    specificTips = `\n🎨 **UI-spezifische Tipps:**
• Verwende React Komponenten und Hooks
• Implementiere responsives Design
• Achte auf Accessibility (a11y)
• Teste auf verschiedenen Bildschirmgrößen`;
  } else if (isDatabase) {
    specificTips = `\n🗄️ **Datenbank-spezifische Tipps:**
• Plane die Datenbankstruktur im Voraus
• Verwende Migrationen für Schema-Änderungen
• Implementiere Indexes für Performance
• Beachte Datenvalidierung und Constraints`;
  } else if (isAuth) {
    specificTips = `\n🔐 **Authentication-spezifische Tipps:**
• Verwende sichere Password-Hashing (bcrypt)
• Implementiere JWT oder Session-basierte Auth
• Beachte OWASP Security Guidelines
• Teste Edge Cases (falsche Credentials, etc.)`;
  }

  return `🤖 **AI-Assistent für "${task}"**

**Phase:** ${currentPhase} (${phase}/4)
**Projekt:** ${projectTitle}

💡 **Was ich für dich tun kann:**
• Schritt-für-Schritt Anleitungen geben
• Code-Beispiele und Best Practices zeigen
• Problems lösen und debuggen
• Tools und Ressourcen empfehlen
• Zeitschätzungen und Prioritäten setzen${specificTips}

🚀 **Los geht's!** Wähle eine Quick Action oder frag mich direkt etwas über diese Aufgabe!`;
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
    lowerMessage.includes("beispiel") ||
    lowerMessage.includes("snippet")
  ) {
    messageType = "code";
    response = `🔧 **Code-Beispiel für "${task}":**

\`\`\`typescript
// Beispiel Implementation für ${task}
const handle${task.replace(/\s+/g, "")} = async () => {
  try {
    // TODO: Implementiere die Logic hier
    console.log('${task} wird ausgeführt...');
    
    // Beispiel für ${
      phase === 1
        ? "Planung"
        : phase === 2
        ? "Development"
        : phase === 3
        ? "Testing"
        : "Deployment"
    }
    ${
      phase === 1
        ? "// Definiere Requirements und Datenstrukturen"
        : phase === 2
        ? "// Implementiere die Core-Funktionalität"
        : phase === 3
        ? "// Schreibe Tests und validiere"
        : "// Prepare für Production Deployment"
    }
    
    return { success: true, message: '${task} erfolgreich!' };
  } catch (error) {
    console.error('Fehler in ${task}:', error);
    throw error;
  }
};
\`\`\`

💡 **Next Steps:**
1. Passe den Code an deine spezifischen Anforderungen an
2. Füge Error Handling hinzu
3. Teste die Funktionalität
4. Dokumentiere den Code`;
  } else if (
    lowerMessage.includes("checkliste") ||
    lowerMessage.includes("schritte") ||
    lowerMessage.includes("plan")
  ) {
    messageType = "checklist";
    response = `✅ **Detaillierte Checkliste für "${task}":**

**🎯 Vorbereitung:**
- [ ] Verstehe die genauen Anforderungen
- [ ] Sammle alle notwendigen Assets/Daten
- [ ] Definiere Akzeptanzkriterien
- [ ] Schätze den Zeitaufwand

**⚡ Implementation:**
- [ ] Erstelle die Grundstruktur
- [ ] Implementiere die Core-Funktionalität
- [ ] Füge Error Handling hinzu
- [ ] Dokumentiere den Code

**🧪 Testing & Quality:**
- [ ] Schreibe Unit Tests
- [ ] Teste Edge Cases
- [ ] Prüfe Performance
- [ ] Code Review durchführen

**🚀 Finalisierung:**
- [ ] Integration testen
- [ ] Dokumentation aktualisieren
- [ ] Ready für ${phase === 4 ? "Production" : "nächste Phase"}

⏱️ **Geschätzte Zeit:** ${
      phase === 1
        ? "2-4 Stunden"
        : phase === 2
        ? "4-8 Stunden"
        : phase === 3
        ? "2-3 Stunden"
        : "1-2 Stunden"
    }`;
  } else if (
    lowerMessage.includes("ressource") ||
    lowerMessage.includes("tool") ||
    lowerMessage.includes("link")
  ) {
    messageType = "resource";
    response = `📚 **Hilfreiche Ressourcen für "${task}":**

**🛠️ Tools & Libraries:**
• VS Code Extensions für bessere Productivity
• React DevTools für Debugging
• Postman für API Testing
• Github Copilot für Code-Assistance

**📖 Dokumentation:**
• [MDN Web Docs](https://developer.mozilla.org) - Web Standards
• [React Docs](https://react.dev) - React Framework
• [Next.js Docs](https://nextjs.org/docs) - Next.js Features
• [TypeScript Handbook](https://www.typescriptlang.org/docs)

**🎥 Learning Resources:**
• YouTube Tutorials zu ${task}
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
      `Für "${task}" in Phase ${phase} empfehle ich folgendes Vorgehen:

**🎯 Hauptfokus:**
${
  phase === 1
    ? "Detaillierte Planung und Requirements-Definition"
    : phase === 2
    ? "Saubere Implementation und Code-Qualität"
    : phase === 3
    ? "Umfassendes Testing und Bug-Fixing"
    : "Stable Deployment und Monitoring"
}

**📋 Konkrete Schritte:**
1. **Start:** ${
        phase === 1
          ? "Analysiere bestehende Anforderungen"
          : phase === 2
          ? "Richte Entwicklungsumgebung ein"
          : phase === 3
          ? "Definiere Test-Cases"
          : "Prepare Production Environment"
      }
2. **Core:** ${
        phase === 1
          ? "Erstelle detaillierte Spezifikationen"
          : phase === 2
          ? "Implementiere Schritt für Schritt"
          : phase === 3
          ? "Führe alle Tests durch"
          : "Deploy and Monitor"
      }
3. **Finish:** ${
        phase === 1
          ? "Review und Approval einholen"
          : phase === 2
          ? "Code Review und Refactoring"
          : phase === 3
          ? "Fix Bugs und optimiere"
          : "Dokumentiere Deployment"
      }

⚡ **Wichtiger Tipp:** ${
        phase === 1
          ? "Nimm dir Zeit für gründliche Planung - das spart später Zeit!"
          : phase === 2
          ? "Schreibe sauberen, dokumentierten Code!"
          : phase === 3
          ? "Teste auch Edge Cases und Error Scenarios!"
          : "Monitor die Application nach dem Launch!"
      }

🤔 **Brauchst du Hilfe bei einem spezifischen Teil?**`,

      `Hier eine detaillierte Anleitung für "${task}":

**🚀 Quick Start Guide:**
• **Verstehen:** Was genau soll erreicht werden?
• **Planen:** Welche Schritte sind notwendig?
• **Implementieren:** Schritt für Schritt vorgehen
• **Testen:** Functionality und Edge Cases prüfen

**🎯 Phase-spezifische Tipps:**
${
  phase === 1
    ? "📋 In der Planungsphase: Sammle alle Requirements, erstelle User Stories, definiere Akzeptanzkriterien"
    : phase === 2
    ? "💻 In der Development-Phase: Implementiere incrementell, schreibe sauberen Code, dokumentiere"
    : phase === 3
    ? "🧪 In der Testing-Phase: Teste gründlich, automatisiere Tests, fix alle Bugs"
    : "🚀 In der Deployment-Phase: Deploye sicher, monitore Performance, sammle User Feedback"
}

**💡 Pro-Tipp:** Für ${projectTitle} ist besonders wichtig, dass ${task} ${
        phase === 1
          ? "gut geplant"
          : phase === 2
          ? "performant implementiert"
          : phase === 3
          ? "thoroughly getestet"
          : "stable deployed"
      } wird.

❓ **Hast du spezifische Fragen oder brauchst du Hilfe bei einem bestimmten Aspekt?**`,
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
          "Entschuldigung, es gab einen Fehler. Bitte versuche es nochmal! 🔄",
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
              placeholder="Frag mich alles über diese Aufgabe..."
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
