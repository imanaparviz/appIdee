"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  Brain,
  MessageSquare,
  Home,
  Settings,
  FileText,
  BarChart3,
  Rocket,
  Code,
  Lightbulb,
  MapPin,
  CheckSquare,
  Clock,
} from "lucide-react";
import { MindMap } from "@/components/MindMap";
import { ProjectRoadmap } from "@/components/ProjectRoadmap";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ProjectIdea {
  projectIdea: string;
  mindMap: {
    center: string;
    branches: Array<{
      title: string;
      subtopics: string[];
    }>;
  };
  roadmap: Array<{
    phase: number;
    title: string;
    percentage: string;
    tasks: string[];
    duration: string;
  }>;
  techStack: string[];
  estimatedTime: string;
}

const navigationItems = [
  { title: "🏠 Home", icon: Home, url: "#", id: "home" },
  { title: "💡 Projekt Ideen", icon: Lightbulb, url: "#", id: "ideas" },
  { title: "🗺️ Roadmaps", icon: MapPin, url: "#", id: "roadmaps" },
  { title: "✅ Task Manager", icon: CheckSquare, url: "#", id: "tasks" },
  { title: "📊 Analytics", icon: BarChart3, url: "#", id: "analytics" },
  { title: "⚙️ Settings", icon: Settings, url: "#", id: "settings" },
];

// Client-side timestamp component to avoid hydration issues
function ClientTimestamp({ timestamp }: { timestamp: Date }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>--:--:--</span>;
  }

  return <span>{timestamp.toLocaleTimeString()}</span>;
}

export default function FullstackDevAssistant() {
  const [activeSection, setActiveSection] = useState("home");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hallo! Ich bin dein Fullstack Development Assistant! 🚀 Erzähl mir von deiner Projektidee und ich helfe dir mit Mind Maps, Roadmaps und detaillierten Tasks!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [projectIdea, setProjectIdea] = useState<ProjectIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");

    // Quick AI response for chat
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Gib eine kurze, hilfreiche Antwort auf: ${currentInput}. Halte es unter 100 Wörtern und bleibe im Kontext von Webentwicklung.`,
          type: "chat",
        }),
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          data.response ||
          `Verstehe! "${currentInput}" - Das klingt interessant! Gib deine Idee im Hauptbereich ein, damit ich dir eine vollständige Projektanalyse mit Mind Map und Roadmap erstellen kann! 💡`,
        sender: "bot",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Entschuldigung, es gab einen Fehler. Probiere es nochmal! 🔄",
        sender: "bot",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleProjectIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: "project-idea",
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProjectIdea(data);

      // Success message in chat
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `🎉 Perfekt! Ich habe eine vollständige Projektanalyse für "${aiPrompt}" erstellt. Schau dir die Mind Map und Roadmap unten an!`,
        sender: "bot",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error:", error);

      // Error fallback with demo data
      setProjectIdea({
        projectIdea: `Austrian Market Webcrawler\n\nEin intelligentes System für lokale Unternehmen, um Konkurrenz-Events und Aktionen in 15km Umkreis automatisch zu finden.`,
        mindMap: {
          center: "AT Crawler",
          branches: [
            {
              title: "Crawling",
              subtopics: ["Web Scraping", "API", "Automation"],
            },
            {
              title: "Targeting",
              subtopics: ["Bäckerei", "Fleischerei", "Lokale", "Events"],
            },
            {
              title: "Location",
              subtopics: ["15km Radius", "GPS", "Maps"],
            },
            {
              title: "Results",
              subtopics: ["Aktionen", "News", "Events", "Konkurrenz"],
            },
          ],
        },
        roadmap: [
          {
            phase: 1,
            title: "Setup & Planning",
            percentage: "0-25%",
            tasks: [
              "Projekt Repository erstellen",
              "Next.js App initialisieren",
              "TypeScript konfigurieren",
              "Tailwind CSS einrichten",
              "Projekt Struktur planen",
            ],
            duration: "1-2 Wochen",
          },
          {
            phase: 2,
            title: "Frontend Development",
            percentage: "25-60%",
            tasks: [
              "UI Komponenten entwickeln",
              "Routing implementieren",
              "State Management einrichten",
              "API Integration",
              "Responsive Design",
            ],
            duration: "3-4 Wochen",
          },
          {
            phase: 3,
            title: "Backend Development",
            percentage: "60-85%",
            tasks: [
              "Express Server aufsetzen",
              "Database Schema erstellen",
              "API Endpoints entwickeln",
              "Authentication implementieren",
              "Testing & Validation",
            ],
            duration: "2-3 Wochen",
          },
          {
            phase: 4,
            title: "Deployment & Launch",
            percentage: "85-100%",
            tasks: [
              "Production Build",
              "Database Migration",
              "Environment Configuration",
              "Domain & SSL Setup",
              "Monitoring & Analytics",
            ],
            duration: "1 Woche",
          },
        ],
        techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
        estimatedTime: "7-10 Wochen",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Rocket className="w-8 h-8 mr-3 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Fullstack Developer Assistant
                </span>
              </h1>
              <p className="text-gray-300 text-lg">
                Dein intelligenter Begleiter für Webentwicklung - von der Idee
                bis zum Launch! 🚀
              </p>
            </div>

            {/* AI Prompt Input */}
            <Card className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-gray-600 shadow-2xl card-hover glow-on-hover">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Brain className="w-6 h-6" />
                  </div>
                  <span>💡 Deine Projektidee transformieren</span>
                </CardTitle>
                <p className="text-blue-100 mt-2">
                  Beschreibe deine Vision und ich erstelle eine komplette
                  Projektanalyse mit Mind Map und Roadmap!
                </p>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800/50 backdrop-blur-sm">
                <form onSubmit={handleProjectIdeaSubmit} className="space-y-6">
                  <div className="relative">
                    <Textarea
                      placeholder="🚀 Beschreibe deine Projektidee hier... 

Beispiele:
• 'Ich möchte eine E-Commerce Website für Bücher mit Bewertungen und Empfehlungen erstellen'
• 'Eine Social Media App für Fotografen mit Portfolio-Sharing und Kollaboration'  
• 'Ein Task-Management Tool für Teams mit Zeiterfassung und Reporting'
• 'Eine Lern-App für Sprachen mit KI-gestützten Übungen'"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="min-h-[140px] resize-none border-2 border-gray-600 focus:border-blue-400 rounded-xl text-lg bg-gray-700 text-white placeholder-gray-400"
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                      {aiPrompt.length}/500 Zeichen
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !aiPrompt.trim()}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-500 hover:border-blue-400"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        🤖 AI generiert Projektplan...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        🚀 Projektplan mit AI erstellen
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Project Analysis Display */}
            {projectIdea && (
              <div className="space-y-6">
                {/* Project Overview */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>📋 Projekt Übersicht</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-gray-700 p-4 rounded-lg border border-gray-600">
                          {projectIdea.projectIdea}
                        </pre>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-semibold text-gray-300">
                          Tech Stack:
                        </span>
                        {projectIdea.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-400" />
                          Geschätzte Zeit: {projectIdea.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mind Map */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>🧠 Projekt Mind Map</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MindMap data={projectIdea.mindMap} />
                  </CardContent>
                </Card>

                {/* Roadmap */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <span>🗺️ Entwicklungs-Roadmap</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectRoadmap
                      roadmap={projectIdea.roadmap}
                      projectTitle={projectIdea.mindMap.center}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Funktion in Entwicklung
              </h3>
              <p className="text-gray-400">
                Diese Sektion wird bald verfügbar sein!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Left Sidebar - Navigation */}
        <Sidebar className="w-64 border-r border-gray-700 bg-gray-800">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-semibold text-white mb-4">
                🚀 Developer Assistant
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="w-full justify-start"
                        isActive={activeSection === item.id}
                      >
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
                            activeSection === item.id
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 pr-[340px]">
          {renderContent()}
        </div>

        {/* Right Sidebar - AI Chat Assistant */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 flex flex-col fixed right-0 top-0 h-screen z-10">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span>🤖 AI Assistant</span>
            </h2>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === "user" && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          <ClientTimestamp timestamp={message.timestamp} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <Input
                placeholder="Frag mich alles über Entwicklung..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
