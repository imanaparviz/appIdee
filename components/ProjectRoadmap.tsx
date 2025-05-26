"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Users,
  Code,
  Rocket,
  Target,
  ChevronRight,
  ChevronDown,
  Star,
  Zap,
  Bot,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  X,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TaskAIChat } from "@/components/TaskAIChat";

interface RoadmapPhase {
  phase: number;
  title: string;
  percentage: string;
  tasks: string[];
  duration: string;
  completed?: boolean;
}

interface ProjectRoadmapProps {
  roadmap: RoadmapPhase[];
  projectTitle: string;
}

interface TaskAIAssistant {
  taskId: string;
  task: string;
  phase: number;
  isOpen: boolean;
}

const getPhaseIcon = (phase: number) => {
  switch (phase) {
    case 1:
      return Target;
    case 2:
      return Code;
    case 3:
      return Users;
    case 4:
      return Rocket;
    default:
      return Circle;
  }
};

const getPhaseConfig = (phase: number) => {
  const configs = [
    {
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-blue-300",
      borderColor: "border-blue-500",
      accent: "bg-blue-500",
      glow: "shadow-blue-500/20",
    },
    {
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-green-300",
      borderColor: "border-green-500",
      accent: "bg-green-500",
      glow: "shadow-green-500/20",
    },
    {
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-purple-300",
      borderColor: "border-purple-500",
      accent: "bg-purple-500",
      glow: "shadow-purple-500/20",
    },
    {
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-orange-300",
      borderColor: "border-orange-500",
      accent: "bg-orange-500",
      glow: "shadow-orange-500/20",
    },
  ];
  return configs[(phase - 1) % configs.length];
};

export function ProjectRoadmap({ roadmap, projectTitle }: ProjectRoadmapProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));
  const [activeAssistant, setActiveAssistant] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const togglePhase = (phase: number) => {
    const newOpen = new Set(openPhases);
    if (newOpen.has(phase)) {
      newOpen.delete(phase);
    } else {
      newOpen.add(phase);
    }
    setOpenPhases(newOpen);
  };

  const toggleTaskAssistant = (taskId: string) => {
    if (activeAssistant === taskId) {
      setActiveAssistant(null);
    } else {
      setActiveAssistant(taskId);
    }
  };

  const totalTasks = roadmap.reduce(
    (acc, phase) => acc + phase.tasks.length,
    0
  );
  const completedCount = Array.from(completedTasks).length;
  const overallProgress =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-600 shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          🗺️ Development Roadmap
        </h2>
        <h3 className="text-xl text-gray-200 font-semibold">{projectTitle}</h3>
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Badge
            variant="outline"
            className="text-sm font-semibold bg-gray-700 text-gray-200 border-gray-500"
          >
            {roadmap.length} Phasen
          </Badge>
          <Badge
            variant="outline"
            className="text-sm font-semibold bg-gray-700 text-gray-200 border-gray-500"
          >
            {totalTasks} Tasks
          </Badge>
          <Badge
            variant="outline"
            className="text-sm font-semibold bg-gray-700 text-gray-200 border-gray-500"
          >
            {Math.round(overallProgress)}% Abgeschlossen
          </Badge>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-green-500 via-purple-500 to-orange-500 rounded-full shadow-lg"></div>

        <div className="space-y-6">
          {roadmap.map((phase, index) => {
            const IconComponent = getPhaseIcon(phase.phase);
            const config = getPhaseConfig(phase.phase);
            const isOpen = openPhases.has(phase.phase);
            const phaseTasks = phase.tasks.map(
              (task, taskIndex) => `${phase.phase}-${taskIndex}`
            );
            const completedInPhase = phaseTasks.filter((taskId) =>
              completedTasks.has(taskId)
            ).length;
            const progressPercent =
              (completedInPhase / phase.tasks.length) * 100;
            const isCompleted = progressPercent === 100;

            return (
              <div key={phase.phase} className="relative">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-6 top-6 w-6 h-6 bg-gradient-to-r ${config.color} rounded-full border-4 border-gray-800 shadow-lg z-10 flex items-center justify-center`}
                >
                  {isCompleted && <Star className="w-3 h-3 text-white" />}
                </div>

                <Card
                  className={`ml-16 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    config.borderColor
                  } ${config.glow} border-2 ${
                    isOpen ? "scale-[1.02]" : ""
                  } bg-gradient-to-br from-gray-800 to-gray-900`}
                >
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => togglePhase(phase.phase)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader
                        className={`cursor-pointer transition-all duration-300 ${config.bgColor} hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-4 rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle
                                className={`text-xl ${config.textColor} flex items-center space-x-2`}
                              >
                                <span>
                                  Phase {phase.phase}: {phase.title}
                                </span>
                                {isCompleted && (
                                  <Star className="w-5 h-5 text-yellow-500" />
                                )}
                              </CardTitle>
                              <div className="flex items-center space-x-3 mt-2">
                                <Badge
                                  variant="secondary"
                                  className="font-semibold bg-gray-700 text-gray-200"
                                >
                                  {phase.percentage}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="font-semibold bg-gray-700 text-gray-200 border-gray-500"
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  {phase.duration}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="font-semibold bg-gray-700 text-gray-200 border-gray-500"
                                >
                                  {completedInPhase}/{phase.tasks.length} Tasks
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div
                                className={`text-3xl font-bold ${config.textColor}`}
                              >
                                {Math.round(progressPercent)}%
                              </div>
                              <div className="w-24 h-3 bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-gray-300">
                              {isOpen ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-gray-200 font-semibold">
                            <CheckCircle className="w-5 h-5" />
                            <span>Aufgaben & Meilensteine:</span>
                          </div>
                          <div className="grid gap-3">
                            {phase.tasks.map((task, taskIndex) => {
                              const taskId = `${phase.phase}-${taskIndex}`;
                              const isCompleted = completedTasks.has(taskId);

                              return (
                                <div key={taskIndex}>
                                  <div
                                    className={`group flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                                      isCompleted
                                        ? `${config.bgColor} ${config.borderColor} shadow-sm`
                                        : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:shadow-md"
                                    }`}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0 h-auto hover:bg-transparent"
                                      onClick={() => toggleTask(taskId)}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle
                                          className={`w-6 h-6 text-green-500`}
                                        />
                                      ) : (
                                        <Circle className="w-6 h-6 text-gray-400 group-hover:text-gray-300" />
                                      )}
                                    </Button>
                                    <span
                                      className={`flex-1 font-medium transition-all duration-200 cursor-pointer ${
                                        isCompleted
                                          ? `${config.textColor} line-through opacity-75`
                                          : "text-gray-200 group-hover:text-white"
                                      }`}
                                      onClick={() => toggleTask(taskId)}
                                    >
                                      {task}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {isCompleted && (
                                        <Badge
                                          variant="outline"
                                          className="text-green-300 border-green-500 bg-green-900/30"
                                        >
                                          ✅ Erledigt
                                        </Badge>
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ${
                                          activeAssistant === taskId
                                            ? "ring-2 ring-purple-400 bg-purple-700"
                                            : ""
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskAssistant(taskId);
                                        }}
                                      >
                                        <Bot className="w-4 h-4 mr-1" />
                                        AI-Hilfe
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Inline AI Assistant Card */}
                                  {activeAssistant === taskId && (
                                    <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                      <TaskAIChat
                                        task={task}
                                        phase={phase.phase}
                                        projectTitle={projectTitle}
                                        isOpen={true}
                                        onClose={() => setActiveAssistant(null)}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress Summary */}
      <Card className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-indigo-500 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Gesamtfortschritt
                </h3>
                <p className="text-lg text-gray-300">
                  <span className="font-semibold text-indigo-400">
                    {completedCount}
                  </span>{" "}
                  von{" "}
                  <span className="font-semibold text-purple-400">
                    {totalTasks}
                  </span>{" "}
                  Tasks abgeschlossen
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {Math.round(overallProgress)}%
              </div>
              <div className="w-32 h-4 bg-gray-600 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
