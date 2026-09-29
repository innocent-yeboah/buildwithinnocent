import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withBackoff } from "@/lib/retry";
import { screenPublicWrite } from "@/lib/abuse";
import {
  normalizeScorecardContact,
  parseAnswers,
  resultPlainText,
  scoreAnswers,
  validateScorecard,
  type ScorecardAnswers,
  type ScorecardResult,
} from "@/lib/scorecard";
import { recommendOffer, type OfferRecommendation } from "@/lib/offers";
import { site } from "@/lib/site";
import type { LeadInput } from "@/lib/leads";
import {
  sendOwnerEmail,
  sendScorecardResultEmail,
  sendWhatsAppNotification,
} from "@/lib/notifications";

export const runtime = "nodejs";

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readUtm(value: unknown): Record<string, string> | null {
  if (typeof value !== "object" || value === null) return null;
  const source = value as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
    const item = source[key];
    if (typeof item === "string" && item.trim()) {
      utm[key] = item.trim().slice(0, 200);
    }
  }
  return Object.keys(utm).length > 0 ? utm : null;
}

function resultPayload(result: ScorecardResult, recommendation: OfferRecommendation) {
  return {
    salesScore: result.salesScore,
    aiScore: result.aiScore,
    revenueScore: result.revenueScore,
    total: result.total,
    tier: result.tier,
    startHere: result.startHere,
    nextSteps: result.nextSteps,
    recommendedTier: recommendation.name,
    recommendation: recommendation.sentence,
    sections: [
      { label: "Sales process", score: result.salesScore, max: 6 },
      { label: "AI adoption", score: result.aiScore, max: 6 },
      { label: "Revenue goals", score: result.revenueScore, max: 8 },
    ],
  };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const raw = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json(
        { message: "We could not read that submission. Let's try that again together?" },
        { status: 400 },
      );
    }
    body = raw as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "We could not read that submission. Let's try that again together?" },
      { status: 400 },
    );
  }

  const screened = await screenPublicWrite(request, body);
  if (screened) return screened;

  const contact = normalizeScorecardContact({
    fullName: readString(body.fullName),
    email: readString(body.email),
    businessName: readString(body.businessName),
    phone: readString(body.phone),
  });
  const answers = parseAnswers(body.answers);
  const errors = validateScorecard(contact, answers ?? {});
  if (!answers || Object.values(errors).some(Boolean)) {
    return NextResponse.json(
      { message: "A few details need another look before we can score this.", errors },
      { status: 422 },
    );
  }

  const result = scoreAnswers(answers);
  const recommendation = recommendOffer(result);
  const utm = readUtm(body.utm);
  const referrer = readString(body.referrer).trim().slice(0, 500) || null;

  const saved = await saveScorecard({ contact, answers, result, recommendation, utm, referrer });
  await notify({ contact, result, recommendation, saved });

  return NextResponse.json(
    {
      saved,
      result: resultPayload(result, recommendation),
      message: saved
        ? "Your result is ready."
        : "Your result is ready on this page. A copy was not saved.",
    },
    { status: saved ? 201 : 200 },
  );
}

async function saveScorecard(input: {
  contact: { fullName: string; email: string; businessName: string; phone: string };
  answers: ScorecardAnswers;
  result: ScorecardResult;
  recommendation: OfferRecommendation;
  utm: Record<string, string> | null;
  referrer: string | null;
}): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase is not configured — scorecard was not saved.");
    return false;
  }

  try {
    await withBackoff(async () => {
      const { error } = await supabase.from("scorecard_responses").insert({
        full_name: input.contact.fullName,
        email: input.contact.email,
        business_name: input.contact.businessName,
        phone: input.contact.phone || null,
        q1: input.answers.q1,
        q2: input.answers.q2,
        q3: input.answers.q3,
        q4: input.answers.q4,
        q5: input.answers.q5,
        q6: input.answers.q6,
        q7: input.answers.q7,
        q8: input.answers.q8,
        q9: input.answers.q9,
        q10: input.answers.q10,
        sales_score: input.result.salesScore,
        ai_score: input.result.aiScore,
        revenue_score: input.result.revenueScore,
        total_score: input.result.total,
        tier: input.result.tier,
        start_section: input.result.startHere,
        recommended_tier: input.recommendation.name,
        utm: input.utm,
        referrer: input.referrer,
      });
      if (error) throw new Error(`Scorecard insert failed: ${error.message}`);
    });
  } catch (error) {
    console.error("Failed to save scorecard response:", error);
    return false;
  }

  const lead: LeadInput = {
    fullName: input.contact.fullName,
    businessName: input.contact.businessName,
    email: input.contact.email,
    phone: input.contact.phone,
    industry: "Not collected",
    projectDetails: [
      `AI Readiness Scorecard: ${input.result.total}/20 (${input.result.tier}).`,
      `Sales process ${input.result.salesScore}/6, AI adoption ${input.result.aiScore}/6, Revenue goals ${input.result.revenueScore}/8.`,
      `Start here: ${input.result.startHere}.`,
      `Recommended: ${input.recommendation.name}.`,
    ].join(" "),
  };

  try {
    await withBackoff(async () => {
      const { error } = await supabase.from("leads").insert({
        full_name: lead.fullName,
        business_name: lead.businessName,
        email: lead.email,
        phone: lead.phone,
        industry: lead.industry,
        project_details: lead.projectDetails,
        source: "scorecard",
        status: "new",
      });
      if (error) throw new Error(`Scorecard lead insert failed: ${error.message}`);
    });
  } catch (error) {
    console.error("Scorecard response was saved, but the lead row was not:", error);
  }

  return true;
}

async function notify(input: {
  contact: { fullName: string; email: string; businessName: string; phone: string };
  result: ScorecardResult;
  recommendation: OfferRecommendation;
  saved: boolean;
}): Promise<void> {
  const lead: LeadInput = {
    fullName: input.contact.fullName,
    businessName: input.contact.businessName,
    email: input.contact.email,
    phone: input.contact.phone || "(not given)",
    industry: "Not collected",
    projectDetails: [
      `AI Readiness Scorecard ${input.result.total}/20 — ${input.result.tier}. Start here: ${input.result.startHere}. Recommended: ${input.recommendation.name}.`,
      input.saved ? "Source: scorecard." : "NOT saved to the database.",
    ].join(" "),
  };

  const tasks: Promise<unknown>[] = [
    sendScorecardResultEmail({
      to: input.contact.email,
      fullName: input.contact.fullName,
      text: resultPlainText(
        input.contact.fullName,
        input.result,
        `${site.url}/strategy-call`,
        input.recommendation,
      ),
    }),
    sendWhatsAppNotification(lead),
  ];

  if (!input.saved) {
    tasks.push(
      sendOwnerEmail(
        `Unsaved scorecard — ${input.contact.fullName}`,
        [
          "An AI Readiness Scorecard was completed but was NOT saved to the database.",
          "",
          `Name: ${input.contact.fullName}`,
          `Business: ${input.contact.businessName}`,
          `Email: ${input.contact.email}`,
          `Phone: ${input.contact.phone || "(not given)"}`,
          `Score: ${input.result.total}/20 (${input.result.tier})`,
          `Sales process: ${input.result.salesScore}/6`,
          `AI adoption: ${input.result.aiScore}/6`,
          `Revenue goals: ${input.result.revenueScore}/8`,
          `Start here: ${input.result.startHere}`,
          `Recommended: ${input.recommendation.name}`,
          input.recommendation.sentence,
        ].join("\n"),
      ),
    );
  }

  const settled = await Promise.allSettled(tasks);
  for (const item of settled) {
    if (item.status === "rejected") {
      console.error("Scorecard notification failed:", item.reason);
    }
  }
}
