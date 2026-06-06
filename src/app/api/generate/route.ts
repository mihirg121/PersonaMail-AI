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

const prompt = `You are a subscriber acquisition marketing strategist specializing in premium financial research and investment audiences.

Your goal is to generate high-converting, trust-building email campaigns tailored to specific investor personas and stages of the subscriber lifecycle.

BRAND CONTEXT:

* The company sells premium macroeconomic, investment, and market research subscriptions.
* Messaging should feel intelligent, differentiated, credible, and insight-driven.
* Avoid hype, sensationalism, or overly promotional language.
* Prioritize trust, clarity, exclusivity, and actionable value.
* Tone should reflect a premium finance brand similar to Hedgeye.

Given this audience persona and campaign brief, produce exactly the following, nothing more:

1. MESSAGING STRATEGY
   Write exactly 2 to 3 sentences covering:

* Recommended messaging angle
* Audience psychology and decision drivers
* Tone recommendation
* Suggested conversion objective

2. EMAIL TEMPLATE

* 3 subject lines (numbered list)
* 1 line of preview text
* Full email with clearly labeled sections:
  Hook,
  Main Value Proposition,
  Supporting Copy,
  CTA Section,
  Closing

EMAIL REQUIREMENTS:

* Tailor messaging to investor sophistication level.
* Adapt language to subscriber lifecycle stage.
* Prioritize insight and credibility over promotional language.
* Emphasize differentiated research, market clarity, investing edge, or actionable insight when relevant.
* Address objections naturally in messaging.
* CTA should match funnel stage (newsletter signup, webinar, trial, paid subscription, upgrade, re-engagement, etc.).
* This email should only be 200 words maximum with the hook, value prop, supporting copy, and CTA

3. WHY THIS WORKS
   Exactly 3 bullet points (use • symbol).
   Each bullet should be a bold label followed by one sentence explanation.

PERSONA:

* Name: ${persona.name}
* Audience Type: ${persona.audienceType}
* Age Range: ${persona.ageRange}
* Pain Points: ${persona.painPoints}
* Goals/Motivations: ${persona.goals}
* Knowledge Level: ${persona.knowledgeLevel}
* Tone Preference: ${persona.tone}
* Common Objections: ${persona.objections || "None provided"}
* Investor Sophistication: ${persona.investorLevel || "General Investor"}
* Subscriber Stage: ${persona.lifecycleStage || "Prospect"}

CAMPAIGN BRIEF:

* Email Goal: ${campaign.emailGoal}
* Email Content: ${campaign.content}
* Call to Action: ${campaign.cta || "None specified"}

Formatting Rules:

* Use clean section headers
* Bold section titles
* Be highly specific and strategic, never generic
* Avoid filler language
* Output only requested sections`;


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