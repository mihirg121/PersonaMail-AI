"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [persona, setPersona] = useState({
    name: "",
    audienceType: "",
    ageRange: "",
    painPoints: "",
    goals: "",
    knowledgeLevel: "",
    tone: "",
    objections: "",
  });

  const [campaign, setCampaign] = useState({
    emailGoal: "",
    content: "",
    cta: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, campaign }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("API error:", err);
        setResult(`Error: ${err.error ?? "Unknown server error"}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error("Fetch error:", error);
      setResult("Error generating email. Check your API key and try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">PersonaMail AI</h1>
        <p className="text-slate-600 mb-8">
          Turn audience insights into personalized marketing emails.
        </p>

        {/* STEP 1: PERSONA INPUT */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Persona Input</h2>
          <div className="space-y-4">
            <div>
              <Label>Persona Name</Label>
              <Input
                placeholder="e.g. John Doe"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Audience Type</Label>
              <Select onValueChange={(val) => setPersona({ ...persona, audienceType: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2B Buyer">B2B Buyer</SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Age Range</Label>
              <Select onValueChange={(val) => setPersona({ ...persona, ageRange: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20-25">20-25</SelectItem>
                  <SelectItem value="26-30">26-30</SelectItem>
                  <SelectItem value="30-40">30-40</SelectItem>
                  <SelectItem value="40+">40+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pain Points</Label>
              <Textarea
                placeholder="What problems does this persona face?"
                value={persona.painPoints}
                onChange={(e) => setPersona({ ...persona, painPoints: e.target.value })}
              />
            </div>

            <div>
              <Label>Goals / Motivations</Label>
              <Textarea
                placeholder="What does this persona want to achieve?"
                value={persona.goals}
                onChange={(e) => setPersona({ ...persona, goals: e.target.value })}
              />
            </div>

            <div>
              <Label>Knowledge Level</Label>
              <Select onValueChange={(val) => setPersona({ ...persona, knowledgeLevel: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select knowledge level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tone Preference</Label>
              <Select onValueChange={(val) => setPersona({ ...persona, tone: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Analytical">Analytical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Common Objections (optional)</Label>
              <Textarea
                placeholder="What might prevent them from taking action?"
                value={persona.objections}
                onChange={(e) => setPersona({ ...persona, objections: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* STEP 2: CAMPAIGN BRIEF */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Campaign Brief</h2>
          <div className="space-y-4">
            <div>
              <Label>Email Goal</Label>
              <Select onValueChange={(val) => setCampaign({ ...campaign, emailGoal: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Awareness">Awareness</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                  <SelectItem value="Conversion">Conversion</SelectItem>
                  <SelectItem value="Retention">Retention</SelectItem>
                  <SelectItem value="Upsell">Upsell</SelectItem>
                  <SelectItem value="Event signup">Event signup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>What Should This Email Contain?</Label>
              <Textarea
                placeholder="Describe what the email should communicate..."
                className="min-h-[100px]"
                value={campaign.content}
                onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
              />
            </div>

            <div>
              <Label>Call to Action (optional)</Label>
              <Input
                placeholder="e.g. Register for webinar"
                value={campaign.cta}
                onChange={(e) => setCampaign({ ...campaign, cta: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Button
          onClick={handleGenerate}
          className="w-full mb-6"
          size="lg"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Email Strategy"}
        </Button>

        {/* RESULT OUTPUT */}
        {result && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Email Strategy</h2>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              {result.split(/\n(?=## )/).map((section, i) => {
                const [header, ...body] = section.split("\n");
                const title = header.replace("## ", "").trim();
                const content = body.join("\n").trim();

                return (
                  <div key={i} className="border-b pb-6 last:border-0 last:pb-0">
                    <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
                    <div className="space-y-2">
                      {content.split("\n").filter(Boolean).map((line, j) => {
                        const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                        return (
                          <p
                            key={j}
                            className={line.startsWith("•") ? "flex gap-2" : ""}
                            dangerouslySetInnerHTML={{ __html: formatted }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}