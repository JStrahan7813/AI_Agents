const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Import the official OpenAI SDK wrapper
let OpenAI;
try {
    OpenAI = require('openai').OpenAI;
} catch (e) {
    console.error("❌ Error: 'openai' package is missing. Run 'npm install openai' in your project root.");
    process.exit(1);
}

const agentPath = process.argv[2];
const mcpPackage = process.env.MCP_PACKAGE_TARGET; 

if (!agentPath) {
    console.error("❌ Error: Missing configuration agent target file path.");
    process.exit(1);
} 

console.log("⚙️ Initializing decoupled automation context wrapper...");
console.log("📊 Active Environmental Variables registered inside this step runtime:");

// Print available system variables (hiding credentials securely)
Object.keys(process.env).forEach(key => {
    if (key.startsWith('AGENT_') || key.startsWith('MCP_') || key.endsWith('_API_KEY')) {
        const val = process.env[key];
        const masked = val.length > 4 ? `${val.substring(0, 4)}****` : '****';
        console.log(`   - ${key}: ${masked}`);
    }
});

let childServer = null;

if (mcpPackage) {
    console.log(`🔌 Dynamic MCP Package requested: ${mcpPackage}. Launching stdio bridge...`);
    childServer = spawn('npx', ['-y', mcpPackage], { env: { ...process.env } });
    childServer.stderr.on('data', (data) => { console.log(`[MCP Server Output]: ${data.toString().trim()}`); });
} else {
    console.log("ℹ️ No target MCP package declared. Proceeding with standard rule execution layout.");
}

const fullPath = path.resolve(agentPath);
if (!fs.existsSync(fullPath)) {
    console.error(`❌ Target verification playbook missing at path: ${fullPath}`);
    if (childServer) childServer.kill();
    process.exit(1);
}

const agentRules = fs.readFileSync(fullPath, 'utf8');
console.log(`🤖 Executing Agent Persona Architecture: ${path.basename(fullPath)}`);

// --- LIVE AI PIPELINE ENGINE ---
async function contactAIEngine() {
    const targetOutputFilename = 'generated_test.spec.mjs';
    const systemPrompt = "You are an automated code generator inside a Playwright CI/CD pipeline. Your output MUST be raw, executable JavaScript Playwright test code. Do not wrap code blocks in markdown fences like ```javascript or write conversational commentary. Output pure JS code only.";
    const userPrompt = `Please follow these specialized instruction behaviors and generate our automated testing suite scripts:\n\n${agentRules}`;

    // 🌟 ROUTE TO GEMINI IF AVAILABLE
    if (process.env.GEMINI_API_KEY) {
        try {
            console.log("🧠 Sending payload to Google Gemini (Free Tier)...");
            const { GoogleGenAI } = require('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [systemPrompt, userPrompt],
                config: { temperature: 0.2 }
            });

            let generatedCode = response.text.trim();

            // 🧼 CLEANER: Strip away any rogue markdown backticks if Gemini added them
            generatedCode = generatedCode.replace(/^```[a-zA-Z]*\n/gm, '').replace(/```$/gm, '').trim();

            fs.writeFileSync(targetOutputFilename, generatedCode, 'utf8');
            console.log(`💾 Success via Gemini! Cleaned and saved to: ${targetOutputFilename}`);
            return;
        } catch (geminiError) {
            console.error("❌ Gemini generation failed:", geminiError.message);
            return;
        }
    }

    // 🔄 FALLBACK TO OPENAI
    if (process.env.OPENAI_API_KEY) {
        try {
            console.log("🧠 Sending payload to OpenAI...");
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            });

            let generatedCode = completion.choices[0].message.content.trim();

            // 🧼 CLEANER: Strip away any rogue markdown backticks if OpenAI added them
            generatedCode = generatedCode.replace(/^```[a-zA-Z]*\n/gm, '').replace(/```$/gm, '').trim();

            fs.writeFileSync(targetOutputFilename, generatedCode, 'utf8');
            console.log(`💾 Success via OpenAI! Cleaned and saved to: ${targetOutputFilename}`);
        } catch (apiError) {
            console.error("❌ OpenAI generation failed:", apiError.message);
        }
        return;
    }

    console.error("❌ Error: Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured.");
}

(async () => {
    await contactAIEngine();
    if (childServer) { childServer.kill(); console.log("📡 Stdio communication channel closed cleanly."); }
    console.log("✅ Pipeline step run completed.");
    process.exit(0);
})();
