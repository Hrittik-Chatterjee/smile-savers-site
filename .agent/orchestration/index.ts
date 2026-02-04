/**
 * Smile Savers Flow - Main Orchestrator
 * 
 * Coordinates Router, Swarm, and Memory for intelligent agent orchestration
 * 
 * @module orchestration
 */

import { analyzeRequest, formatRoutingDecision, type RoutingDecision } from './router.js';
import { memory } from './memory.js';

export interface OrchestrationResult {
    success: boolean;
    agents: string[];
    mode: string;
    message: string;
    context: Record<string, unknown>;
}

/**
 * Main orchestration function
 */
export async function orchestrate(userRequest: string): Promise<OrchestrationResult> {
    console.log('🚀 Smile Savers Flow: Analyzing request...\n');

    // Step 1: Analyze and route
    const routing = analyzeRequest(userRequest);
    console.log(formatRoutingDecision(routing));
    console.log('');

    // Step 2: Record in memory
    memory.addMessage('user', userRequest);
    routing.agents.forEach(agent => memory.recordAgentUsage(agent));

    // Step 3: Execute based on mode
    let result: OrchestrationResult;

    switch (routing.mode) {
        case 'single':
            result = await executeSingleAgent(routing);
            break;
        case 'swarm':
            result = await executeSwarm(routing);
            break;
        case 'sequential':
            result = await executeSequential(routing);
            break;
        default:
            result = {
                success: false,
                agents: [],
                mode: 'unknown',
                message: 'Unknown routing mode',
                context: {},
            };
    }

    // Step 4: Record outcome
    memory.addMessage('agent', result.message, result.agents[0]);

    return result;
}

/**
 * Execute single agent
 */
async function executeSingleAgent(routing: RoutingDecision): Promise<OrchestrationResult> {
    const agent = routing.agents[0];

    console.log(`✨ Activating: ${agent}\n`);

    return {
        success: true,
        agents: [agent],
        mode: 'single',
        message: `Task routed to ${agent}. Use the skill activation phrase or continue with your request.`,
        context: routing.context,
    };
}

/**
 * Execute swarm (parallel agents)
 */
async function executeSwarm(routing: RoutingDecision): Promise<OrchestrationResult> {
    console.log(`🐝 Swarm Mode: Coordinating ${routing.agents.length} agents\n`);

    routing.agents.forEach(agent => {
        console.log(`  - ${agent}`);
    });
    console.log('');

    return {
        success: true,
        agents: routing.agents,
        mode: 'swarm',
        message: `Swarm activated with ${routing.agents.length} agents. They will work in parallel on different aspects of your request.`,
        context: routing.context,
    };
}

/**
 * Execute sequential (pipeline)
 */
async function executeSequential(routing: RoutingDecision): Promise<OrchestrationResult> {
    console.log(`📋 Sequential Mode: Pipeline execution\n`);

    routing.agents.forEach((agent, index) => {
        console.log(`  ${index + 1}. ${agent}`);
    });
    console.log('');

    return {
        success: true,
        agents: routing.agents,
        mode: 'sequential',
        message: `Sequential pipeline created. Agents will execute in order: ${routing.agents.join(' → ')}`,
        context: routing.context,
    };
}

/**
 * Get memory statistics
 */
export function getMemoryStats() {
    const context = memory.getContext();
    const prefs = memory.getPreferences();
    const learning = memory.getLearningData();

    return {
        sessionId: context.sessionId,
        messageCount: context.messages.length,
        completedTasks: context.completedTasks.length,
        mostUsedAgent: Object.entries(prefs.preferredAgents)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none',
        totalTaskOutcomes: learning.taskOutcomes.length,
        successRate: calculateSuccessRate(learning.taskOutcomes),
    };
}

function calculateSuccessRate(outcomes: Array<{ success: boolean }>): string {
    if (outcomes.length === 0) return '0%';
    const successful = outcomes.filter(o => o.success).length;
    return `${Math.round((successful / outcomes.length) * 100)}%`;
}
