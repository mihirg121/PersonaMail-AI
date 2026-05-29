import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body: { persona?: unknown; campaign?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { persona, campaign } = body as {
      persona: Record<string, string>;
      campaign: Record<string, string>;
    };

    if (!persona || !campaign) {
      return NextResponse.json(
        { error: "Missing required fields: persona and campaign" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error: Please verify your GROQ_API_KEY is defined in .env.local." },
        { status: 500 }
      );
    }

    // ✅ Initialize AFTER the env check
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a marketing strategist specializing in the finance industry. 

Given this audience persona and campaign brief, produce:
1. MESSAGING STRATEGY (recommended angle, audience psychology, suggested positioning, tone recommendation)
2. EMAIL TEMPLATE (3-5 subject lines, preview text, then full email with: hook, main value proposition, supporting copy, CTA section, closing)
3. WHY THIS WORKS (bullet points explaining why this messaging fits this persona)

PERSONA:
- Name: ${persona.name}
- Audience Type: ${persona.audienceType}
- Age Range: ${persona.ageRange}
- Pain Points: ${persona.painPoints}
- Goals/Motivations: ${persona.goals}
- Knowledge Level: ${persona.knowledgeLevel}
- Tone Preference: ${persona.tone}
- Common Objections: ${persona.objections || "None provided"}

CAMPAIGN BRIEF:
- Email Goal: ${campaign.emailGoal}
- Email Content: ${campaign.content}
- Call to Action: ${campaign.cta || "None specified"}

Format your response in clear sections with headers. Be specific and strategic, not generic.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Groq.APIError) {
      console.error("Groq API error:", error.status, error.message);
      return NextResponse.json(
        { error: `Groq error: ${error.message}` },
        { status: error.status ?? 502 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}