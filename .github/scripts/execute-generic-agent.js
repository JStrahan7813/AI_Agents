const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ➕ Import the official OpenAI SDK wrapper
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
    if (key.startsWith('AGENT_') || key.startsWith('MCP_')) {
        const val = process.env[key];
        const masked = val.length > 4 ? `${val.substring(0, 4)}****` : '****';
        console.log(`   - ${key}: ${masked}`);
    }
});

let childServer = null;

if (mcpPackage) {
    console.log(`🔌 Dynamic MCP Package requested: ${mcpPackage}. Launching stdio bridge...`);
    
    // Spawns the decoupled package requested on the fly via the step configuration block
    childServer = spawn('npx', ['-y', mcpPackage], {
        env: { ...process.env }
    });

    childServer.stderr.on('data', (data) => {
        console.log(`[MCP Server Output]: ${data.toString().trim()}`);
    });
} else {
    console.log("ℹ️ No target MCP package declared. Proceeding with standard rule execution layout.");
}

// Read the targeted markdown specification playbook file
const fullPath = path.resolve(agentPath);
if (!fs.existsSync(fullPath)) {
    console.error(`❌ Target verification playbook missing at path: ${fullPath}`);
    if (childServer) childServer.kill();
    process.exit(1);
}

// Read the agent instructions inside the CI pipeline container environment
const agentRules = fs.readFileSync(fullPath, 'utf8');
console.log(`🤖 Executing Agent Persona Architecture: ${path.basename(fullPath)}`);

// 🚀 --- NEW LIVE AI PIPELINE ENGINE EXECUTION STEP ---
async function contactAIEngine() {
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ Error: OPENAI_API_KEY is not defined in the step environment.");
        return;
    }

    try {
        console.log("🧠 Sending persona payload instructions to OpenAI...");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: "You are an automated code generator inside a Playwright CI/CD pipeline. Your output MUST be raw, executable JavaScript Playwright test code. Do not wrap code blocks in markdown fences like ```javascript or write conversational commentary. Output pure JS code only." 
                },
                { 
                    role: "user", 
                    content: `Please follow these specialized instruction behaviors and generate our automated testing suite scripts:\n\n${agentRules}` 
                }
            ],
            temperature: 0.2
        });

        const generatedCode = completion.choices[0].message.content.trim();
        
        // 💾 Save the generated response directly onto the disk root workspace for Step 3 to read
        const targetOutputFilename = 'generated_test.spec.js';
        fs.writeFileSync(targetOutputFilename, generatedCode, 'utf8');
        console.log(`💾 Success! Agent script execution generated and saved cleanly to: ${targetOutputFilename}`);

    } catch (apiError) {
        console.error("❌ Failed to gather code construction parameters from OpenAI:", apiError.message);
    }
}

// Wrap the completion execution loop safely inside an async context frame 
(async () => {
    await contactAIEngine();

    // Clean down background process loops elegantly
    if (childServer) {
        childServer.kill();
        console.log("📡 Stdio communication channel closed cleanly.");
    }

    console.log("✅ Pipeline step run completed.");
    process.exit(0);
})();
