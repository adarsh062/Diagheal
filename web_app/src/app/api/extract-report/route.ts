import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/extract-report
 * Accepts: multipart/form-data with a "file" field (JPG / PNG / WebP image)
 * Returns: { Age, Gender, TB, DB, Alkphos, Sgpt, Sgot, TP, ALB, AG_Ratio }
 *
 * Uses Groq's vision model (meta-llama/llama-4-scout-17b-16e-instruct)
 * to OCR the uploaded liver report image and extract structured biomarker data.
 */
export async function POST(req: NextRequest) {
  // ── API key guard ─────────────────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.error("[extract-report] GROQ_API_KEY is not set in .env.local");
    return NextResponse.json(
      { error: "Server configuration error: GROQ_API_KEY is missing. Add it to .env.local and restart the dev server." },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Groq vision accepts JPEG, PNG, WebP, GIF as base64 data URLs
    const mimeType = file.type === "image/jpg" ? "image/jpeg" : (file.type || "image/jpeg");
    const supported = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!supported.includes(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported file type: "${file.type}". Please upload a JPG, PNG, or WebP image of your report. PDFs must be converted to an image first.` },
        { status: 400 }
      );
    }

    console.log(`[extract-report] File: ${file.name} | ${mimeType} | ${(file.size / 1024).toFixed(1)} KB`);

    // Convert to base64 data URL
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // ── Groq vision call ──────────────────────────────────────────
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a medical OCR assistant for Liver Function Tests (LFT).

Read this lab report image carefully and extract these 10 fields:

| Key       | What to look for                                              | Unit    |
|-----------|---------------------------------------------------------------|---------|
| Age       | Patient age — see AGE RULES below                             | years   |
| Gender    | Patient sex — output EXACTLY "Male" or "Female"               | —       |
| TB        | Total Bilirubin  [T. Bil / Total Bil]                         | mg/dL   |
| DB        | Direct Bilirubin [D. Bil / Direct Bil / Conjugated Bil]       | mg/dL   |
| Alkphos   | Alkaline Phosphatase [ALP / Alk Phos / ALKP]                  | IU/L    |
| Sgpt      | SGPT / ALT / Alanine Aminotransferase                         | IU/L    |
| Sgot      | SGOT / AST / Aspartate Aminotransferase                       | IU/L    |
| TP        | Total Protein [Serum Protein / Total Proteins]                | g/dL    |
| ALB       | Albumin [Alb / Serum Albumin]                                 | g/dL    |
| AG_Ratio  | A/G Ratio [Albumin/Globulin Ratio / A:G]                      | ratio   |

AGE RULES (very important):
- Always output Age as a decimal number in YEARS
- If the report says the age in YEARS (e.g. "45Y", "45 Yrs", "45 Years") → use that number directly: 45
- If the report says the age in MONTHS (e.g. "2M", "2 Months", "2/12") → divide by 12 and round to 2 decimal places
  Examples: 2 months → 0.17 | 6 months → 0.5 | 18 months → 1.5 | 9 months → 0.75
- If the report says the age in DAYS (e.g. "10D", "10 Days") → divide by 365 and round to 2 decimal places
  Examples: 30 days → 0.08 | 90 days → 0.25
- If the report shows COMBINED age like "1Y 6M" or "1 Year 6 Months" → convert all parts to years and add: 1 + 6/12 = 1.5
- If ONLY a bare number is written (e.g. "2") with NO unit label anywhere near it:
  - Check the context: if the patient appears to be a child (e.g. pediatric ward, neonatal section, very small child) and the number is ≤ 12, assume MONTHS and divide by 12
  - Otherwise assume YEARS

STRICT RULES:
- Output ONLY a raw JSON object — zero markdown, zero backticks, zero explanation
- Numbers → JSON number type (not string). Gender → JSON string. Missing → JSON null
- Use the RESULT column value, not the reference range

Example output:
{"Age":0.17,"Gender":"Male","TB":1.1,"DB":0.3,"Alkphos":187,"Sgpt":45,"Sgot":38,"TP":7.2,"ALB":3.8,"AG_Ratio":1.1}`,
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      temperature: 0,          // deterministic — we want consistent extraction
      max_tokens: 256,
      response_format: { type: "text" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    console.log("[extract-report] Groq response:", raw);

    // Strip any accidental markdown fences
    const cleaned = raw
      .replace(/^```(?:json)?\s*/im, "")
      .replace(/\s*```\s*$/m, "")
      .trim();

    // Parse JSON
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[extract-report] JSON parse failed. Raw:", cleaned);
      return NextResponse.json(
        { error: "The AI could not read structured data from this image. Please try a clearer, higher-resolution scan." },
        { status: 422 }
      );
    }

    // Ensure all 10 keys exist; fill missing with null
    const KEYS = ["Age", "Gender", "TB", "DB", "Alkphos", "Sgpt", "Sgot", "TP", "ALB", "AG_Ratio"];
    const sanitized: Record<string, string | number | null> = {};
    for (const key of KEYS) {
      const val = parsed[key];
      sanitized[key] = val !== undefined && val !== "" ? (val as string | number) : null;
    }

    console.log("[extract-report] Extracted values:", sanitized);
    return NextResponse.json(sanitized);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[extract-report] Groq API error:", msg);

    if (msg.includes("401") || msg.toLowerCase().includes("api key") || msg.includes("Unauthorized")) {
      return NextResponse.json({ error: "Invalid Groq API key. Check GROQ_API_KEY in .env.local." }, { status: 401 });
    }
    if (msg.includes("429")) {
      return NextResponse.json({ error: "Groq rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    if (msg.includes("413") || msg.includes("too large")) {
      return NextResponse.json({ error: "Image file is too large. Please compress it below 4 MB and try again." }, { status: 413 });
    }

    return NextResponse.json({ error: `Extraction failed: ${msg}` }, { status: 500 });
  }
}
