/**
 * Smile Savers Flow - Learning Loop
 * 
 * Continuous improvement system that learns from task outcomes
 * 
 * @module orchestration/learning
 */

import { memory, type LearningData } from './memory.js';

interface ImprovementSuggestion {
    type: 'routing' | 'prompt' | 'workflow';
    description: string;
    confidence: number;
}

export class LearningLoop {
    /**
     * Analyze recent performance and generate improvements
     */
    analyzePerformance(): ImprovementSuggestion[] {
        const data = memory.getLearningData();
        const suggestions: ImprovementSuggestion[] = [];

        // Analyze error patterns
        const highFreqErrors = Object.entries(data.errorPatterns)
            .filter(([_, count]) => count > 3)
            .sort(([_, a], [__, b]) => b - a);

        if (highFreqErrors.length > 0) {
            highFreqErrors.forEach(([error, count]) => {
                suggestions.push({
                    type: 'workflow',
                    description: `Frequent error detected: "${error}" (${count} times). Consider creating a specific validation rule or recovery agent.`,
                    confidence: 0.9
                });
            });
        }

        // Analyze task success rates
        const agentPerformance = this.calculateAgentSuccessRates(data);

        Object.entries(agentPerformance).forEach(([agent, rate]) => {
            if (rate < 0.6) {
                suggestions.push({
                    type: 'prompt',
                    description: `Agent "${agent}" has low success rate (${Math.round(rate * 100)}%). Review its system prompt and tool definitions.`,
                    confidence: 0.85
                });
            }
        });

        return suggestions;
    }

    /**
     * Calculate success rates per agent
     */
    private calculateAgentSuccessRates(data: LearningData): Record<string, number> {
        const agentStats: Record<string, { total: number; success: number }> = {};

        data.taskOutcomes.forEach(outcome => {
            if (!agentStats[outcome.agent]) {
                agentStats[outcome.agent] = { total: 0, success: 0 };
            }
            agentStats[outcome.agent].total++;
            if (outcome.success) agentStats[outcome.agent].success++;
        });

        const rates: Record<string, number> = {};
        Object.keys(agentStats).forEach(agent => {
            const stats = agentStats[agent];
            rates[agent] = stats.success / stats.total;
        });

        return rates;
    }

    /**
     * Feedback loop integration
     */
    processFeedback(taskId: string, wasHelpful: boolean, details?: string): void {
        console.log(`🔄 Learning Loop: Processing feedback for task ${taskId}`);

        if (!wasHelpful) {
            // Analyze what went wrong and update error patterns
            if (details) {
                memory.recordError(details);
            }
        }

        // Trigger analysis
        const improvements = this.analyzePerformance();
        if (improvements.length > 0) {
            console.log('💡 Suggested Improvements:');
            improvements.forEach(imp => console.log(`  - [${imp.type}] ${imp.description}`));
        }
    }

    /**
     * Explicitly record a technical insight
     */
    recordInsight(category: string, insight: string): void {
        console.log(`🧠 Learning Loop: New technical insight [${category}]: ${insight}`);
        memory.recordTechnicalInsight(category, insight);
    }
}

export const learning = new LearningLoop();
