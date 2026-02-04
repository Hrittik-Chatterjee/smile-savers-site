/**
 * Smile Savers Flow - Router
 * 
 * Analyzes user requests and routes to appropriate agent(s)
 * 
 * @module orchestration/router
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface RoutingDecision {
    mode: 'single' | 'swarm' | 'sequential';
    agents: string[];
    priority: 'high' | 'medium' | 'low';
    context: Record<string, unknown>;
}

export interface RoutingRule {
    keywords: string[];
    agent: string;
    weight: number;
}

/**
 * Routing rules for task classification
 */
const ROUTING_RULES: RoutingRule[] = [
    // Astro-specific
    { keywords: ['astro', '.astro', 'component', 'page', 'layout', 'island'], agent: 'astro-oracle', weight: 10 },
    { keywords: ['content collection', 'content layer', 'getCollection', 'defineCollection'], agent: 'astro-oracle', weight: 10 },
    { keywords: ['server island', 'ssr', 'adapter', 'middleware'], agent: 'astro-oracle', weight: 10 },
    { keywords: ['astro action', 'astro.config', 'endpoint'], agent: 'astro-oracle', weight: 10 },

    // Styling
    { keywords: ['tailwind', 'css', 'style', '@theme', 'design token'], agent: 'tailwind-architect', weight: 9 },
    { keywords: ['color', 'oklch', 'typography', 'spacing'], agent: 'tailwind-architect', weight: 8 },
    { keywords: ['daisyui', 'component class', 'theme'], agent: 'daisyui-expert', weight: 9 },

    // Design & UX
    { keywords: ['design', 'layout', 'ui', 'ux', 'responsive'], agent: 'design-expert', weight: 9 },
    { keywords: ['color palette', 'visual hierarchy', 'accessibility'], agent: 'design-expert', weight: 8 },
    { keywords: ['mobile', 'desktop', 'touch target', 'contrast'], agent: 'design-expert', weight: 7 },

    // Autonomous Development
    { keywords: ['implement', 'build', 'create feature', 'autonomous'], agent: 'ai-pilot', weight: 10 },
    { keywords: ['end-to-end', 'full feature', 'complete implementation'], agent: 'ai-pilot', weight: 9 },

    // Compliance
    { keywords: ['hipaa', 'ada', 'wcag', 'accessibility', 'compliance'], agent: 'compliance-officer', weight: 10 },
    { keywords: ['privacy', 'consent', 'phi', 'protected health'], agent: 'compliance-officer', weight: 10 },

    // Development
    { keywords: ['debug', 'error', 'fix', 'broken'], agent: 'systematic-debugging', weight: 7 },
    { keywords: ['test', 'vitest', 'playwright'], agent: 'testing-patterns', weight: 7 },
    { keywords: ['deploy', 'build', 'production'], agent: 'deployment-procedures', weight: 7 },
];

/**
 * Analyze user request and determine routing
 */
export function analyzeRequest(userRequest: string): RoutingDecision {
    const normalizedRequest = userRequest.toLowerCase();
    const agentScores = new Map<string, number>();

    // Score each agent based on keyword matches
    for (const rule of ROUTING_RULES) {
        for (const keyword of rule.keywords) {
            if (normalizedRequest.includes(keyword)) {
                const currentScore = agentScores.get(rule.agent) || 0;
                agentScores.set(rule.agent, currentScore + rule.weight);
            }
        }
    }

    // Sort agents by score
    const sortedAgents = Array.from(agentScores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([agent]) => agent);

    // Determine mode
    let mode: 'single' | 'swarm' | 'sequential' = 'single';
    let agents: string[] = [];

    if (sortedAgents.length === 0) {
        // No specific match, use Elite Master
        agents = ['elite-master'];
    } else if (sortedAgents.length === 1) {
        // Single agent
        agents = sortedAgents;
    } else if (sortedAgents.length >= 2) {
        // Multiple agents - check if they can work in parallel
        const topAgents = sortedAgents.slice(0, 3);

        // If request mentions "plan", "implement", "verify" → sequential
        if (/plan|implement|verify|deploy/i.test(userRequest)) {
            mode = 'sequential';
            agents = ['elite-master', ...topAgents];
        } else {
            // Otherwise, use swarm for parallel execution
            mode = 'swarm';
            agents = topAgents;
        }
    }

    // Determine priority
    const priority = determinePriority(normalizedRequest);

    return {
        mode,
        agents,
        priority,
        context: {
            originalRequest: userRequest,
            matchedKeywords: extractMatchedKeywords(normalizedRequest),
            timestamp: new Date().toISOString(),
        },
    };
}

/**
 * Determine task priority based on keywords
 */
function determinePriority(request: string): 'high' | 'medium' | 'low' {
    if (/urgent|critical|broken|error|fix/i.test(request)) {
        return 'high';
    }
    if (/refactor|optimize|improve/i.test(request)) {
        return 'medium';
    }
    return 'low';
}

/**
 * Extract matched keywords from request
 */
function extractMatchedKeywords(request: string): string[] {
    const matched: string[] = [];
    for (const rule of ROUTING_RULES) {
        for (const keyword of rule.keywords) {
            if (request.includes(keyword) && !matched.includes(keyword)) {
                matched.push(keyword);
            }
        }
    }
    return matched;
}

/**
 * Get agent skill path
 */
export function getAgentSkillPath(agentName: string): string {
    const skillsDir = join(__dirname, '..', 'skills');
    return join(skillsDir, agentName, 'SKILL.md');
}

/**
 * Format routing decision for display
 */
export function formatRoutingDecision(decision: RoutingDecision): string {
    const keywords = (decision.context.matchedKeywords as string[]) || [];
    return `
🎯 Routing Decision:
  Mode: ${decision.mode}
  Agents: ${decision.agents.join(', ')}
  Priority: ${decision.priority}
  Matched Keywords: ${keywords.length > 0 ? keywords.join(', ') : 'none'}
  `.trim();
}
