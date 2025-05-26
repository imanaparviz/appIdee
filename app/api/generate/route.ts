import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = "project-idea" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let systemPrompt = "";

    switch (type) {
      case "project-idea":
        systemPrompt = `You are an experienced fullstack developer assistant. 
        Create based on the user input:
        1. A detailed project idea
        2. A clear mind map structure (in JSON format)
        3. A roadmap with phases from 0-100%
        4. Concrete tasks for each phase
        
        Respond in JSON format:
        {
          "projectIdea": "Detailed project description",
          "mindMap": {
            "center": "Main topic",
            "branches": [
              {
                "title": "Frontend",
                "subtopics": ["React/Next.js", "TypeScript", "Tailwind CSS"]
              },
              {
                "title": "Backend", 
                "subtopics": ["Node.js/Express", "Database", "APIs"]
              }
            ]
          },
          "roadmap": [
            {
              "phase": 1,
              "title": "Setup & Planning",
              "percentage": "0-20%",
              "tasks": ["Task 1", "Task 2"],
              "duration": "1-2 weeks"
            }
          ],
          "techStack": ["React", "Next.js", "Node.js"],
          "estimatedTime": "4-6 weeks"
        }`;
        break;

      case "roadmap":
        systemPrompt = `Create a detailed roadmap for the given project.
        Divide it into clear phases from 0-100% with concrete tasks and time estimates.`;
        break;

      case "tasks":
        systemPrompt = `Create a detailed task list for the given project phase.
        Each task should be concrete and actionable.`;
        break;
    }

    const result = await model.generateContent([
      systemPrompt,
      `User input: ${prompt}`,
    ]);

    const response = await result.response;
    const text = response.text();

    // Try to parse JSON, if not possible, return text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      parsedResponse = { response: text };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Error in AI generation" },
      { status: 500 }
    );
  }
}
