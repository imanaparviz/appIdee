import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = "project-idea" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt ist erforderlich" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let systemPrompt = "";

    switch (type) {
      case "project-idea":
        systemPrompt = `Du bist ein erfahrener Fullstack-Entwickler-Assistent. 
        Erstelle basierend auf der Benutzereingabe:
        1. Eine detaillierte Projektidee
        2. Eine klare Mind Map Struktur (in JSON Format)
        3. Eine Roadmap mit Phasen von 0-100%
        4. Konkrete Tasks für jede Phase
        
        Antworte im JSON Format:
        {
          "projectIdea": "Detaillierte Projektbeschreibung",
          "mindMap": {
            "center": "Hauptthema",
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
              "duration": "1-2 Wochen"
            }
          ],
          "techStack": ["React", "Next.js", "Node.js"],
          "estimatedTime": "4-6 Wochen"
        }`;
        break;

      case "roadmap":
        systemPrompt = `Erstelle eine detaillierte Roadmap für das gegebene Projekt.
        Teile es in klare Phasen auf von 0-100% mit konkreten Tasks und Zeitschätzungen.`;
        break;

      case "tasks":
        systemPrompt = `Erstelle eine detaillierte Task-Liste für die gegebene Projektphase.
        Jeder Task sollte konkret und umsetzbar sein.`;
        break;
    }

    const result = await model.generateContent([
      systemPrompt,
      `Benutzereingabe: ${prompt}`,
    ]);

    const response = await result.response;
    const text = response.text();

    // Versuche JSON zu parsen, falls nicht möglich, gib Text zurück
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
      { error: "Fehler bei der AI-Generierung" },
      { status: 500 }
    );
  }
}
