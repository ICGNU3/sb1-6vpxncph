/**
 * Optimized AI System
 */
import { QuantumInputProcessor, type QuantumInput } from './quantum/inputProcessor';
import { ContentAgent } from './agents/contentAgent';
import { AnalysisAgent } from './agents/analysisAgent';
import { IntegrationLayer } from './hybrid/integrationLayer';

// Use singleton pattern for AI system
export class AISystem {
  private static instance: AISystem;
  private processor: QuantumInputProcessor;
  private contentAgent: ContentAgent;
  private analysisAgent: AnalysisAgent;
  private integrationLayer: IntegrationLayer;

  private constructor() {
    this.processor = new QuantumInputProcessor();
    this.contentAgent = new ContentAgent({
      id: 'content-agent',
      type: 'content',
      capabilities: ['text-generation', 'content-optimization'],
      parameters: { temperature: 0.7 }
    });
    this.analysisAgent = new AnalysisAgent({
      id: 'analysis-agent',
      type: 'analysis',
      capabilities: ['data-analysis', 'insight-generation'],
      parameters: { confidenceThreshold: 0.8 }
    });
    this.integrationLayer = new IntegrationLayer();
  }

  static getInstance(): AISystem {
    if (!AISystem.instance) {
      AISystem.instance = new AISystem();
    }
    return AISystem.instance;
  }

  async process(input: QuantumInput) {
    try {
      const processedInput = await this.processor.processInput(input);
      const [contentResponse, analysisResponse] = await Promise.all([
        this.contentAgent.process(processedInput),
        this.analysisAgent.process(processedInput)
      ]);
      return this.integrationLayer.integrate(processedInput, [contentResponse, analysisResponse]);
    } catch (error) {
      console.error('AI System Error:', error);
      throw error;
    }
  }

  static createTextInput(text: string): QuantumInput {
    const encoder = new TextEncoder();
    return {
      type: 'text',
      data: encoder.encode(text),
      metadata: {
        timestamp: Date.now(),
        source: 'user',
        format: 'text/plain'
      }
    };
  }
}