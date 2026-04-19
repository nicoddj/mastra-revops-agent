# RevOps Intelligence Agent

An AI agent built with [Mastra](https://mastra.ai) and Claude (Anthropic) that answers Revenue Operations questions using real business metrics.

## What it does

Ask questions in natural language and get data-driven RevOps insights:

- **Churn risk analysis** — identify customers at risk and how much MRR is at stake
- **Customer metrics** — MRR, NRR, and health status across your customer base
- **Pipeline intelligence** — sales pipeline, weighted forecast, and deal breakdown by rep

## Example questions

- "Which customers are at risk of churning?"
- "What is our total MRR and how are our customers performing?"
- "Give me a full revenue health check"
- "Show me Sarah's pipeline"

## Tech stack

- [Mastra](https://mastra.ai) — TypeScript agent framework
- [Anthropic Claude Haiku 4.5](https://anthropic.com) — LLM
- TypeScript

## Getting started

### Prerequisites
- Node.js v20+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file at the root:
ANTHROPIC_API_KEY=your_key_here

### Run

```bash
npm run dev
```

Open [http://localhost:4111](http://localhost:4111) in your browser to interact with the agent.

## Project structure
src/mastra/
├── agents/
│   └── revops-agent.ts     # Agent definition and instructions
├── tools/
│   └── revops-tools.ts     # getCustomerMetrics, getChurnRisk, getPipelineStatus
├── data/
│   └── revops-data.ts      # Fictional customer and deal data
└── index.ts                # Mastra entry point