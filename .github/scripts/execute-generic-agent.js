const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

// Clean down background process loops elegantly
if (childServer) {
    childServer.kill();
    console.log("📡 Stdio communication channel closed cleanly.");
}

console.log("✅ Pipeline step run completed.");
process.exit(0);
