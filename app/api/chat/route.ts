import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are Planr AI, an expert assistant on the Planr platform — a marketplace connecting people who want to build homes, restaurants, hotels, and other construction projects with the right professionals in Sri Lanka.

You help users with:
- Architecture and building design questions
- Interior design and space planning
- Landscape architecture and garden design
- Construction processes, timelines, and site management
- Structural engineering concepts
- Building permits and approvals
- Cost estimation and budgeting
- Working with contractors and managing builds
- Quantity surveying and bill of quantities
- Urban design and planning

Guidelines:
- Be concise and practical. Use bullet points or numbered steps when listing information.
- Give specific, actionable guidance rather than vague generalities.
- When a question requires hands-on professional assessment, recommend booking a consultation with one of Planr's verified professionals.
- Keep answers focused on construction, architecture, design, and related fields. Politely decline to answer unrelated topics.
- Do not make up specific prices — give realistic ranges and explain what factors affect cost.`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
      cancel() {
        stream.abort()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Chat API error:", msg)
    return new Response(msg, { status: 500 })
  }
}
