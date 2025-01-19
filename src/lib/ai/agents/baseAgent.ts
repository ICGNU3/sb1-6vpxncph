/**
 * Base Agent Class
 * Foundation for specialized AI agents
 */
import type { ProcessedInput } from '../quantum/inputProcessor';

export interface AgentConfig {
  id: string;
  type: string;
  capabilities: string[];
  parameters: Record<string, any>;
}

export interface AgentState {
  status: 'idle' | 'processing' | 'error';
  lastUpdate: number;
  context: Record<string, any>;
  memory: Map<string, any>;
}

export interface AgentResponse {
  success: boolean;
  data: any;
  metadata: {
    timestamp: number;
    confidence: number;
    processingTime: number;
  };
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected state: AgentState;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.state = {
      status: 'idle',
      lastUpdate: Date.now(),
      context: {},
      memory: new Map()
    };
  }

  abstract process(input: ProcessedInput): Promise<AgentResponse>;
  
  protected async preProcess(input: ProcessedInput): Promise<void> {
    this.state.status = 'processing';
    this.state.lastUpdate = Date.now();
    await this.updateContext(input);
  }

  protected async postProcess(response: AgentResponse): Promise<void> {
    this.state.status = 'idle';
    this.state.lastUpdate = Date.now();
    await this.updateMemory(response);
  }

  protected async handleError(error: Error): Promise<AgentResponse> {
    this.state.status = 'error';
    return {
      success: false,
      data: null,
      metadata: {
        timestamp: Date.now(),
        confidence: 0,
        processingTime: 0
      }
    };
  }

  private async updateContext(input: ProcessedInput): Promise<void> {
    this.state.context = {
      ...this.state.context,
      lastInput: input.id,
      inputType: input.context.type,
      timestamp: Date.now()
    };
  }

  private async updateMemory(response: AgentResponse): Promise<void> {
    const key = `response_${Date.now()}`;
    this.state.memory.set(key, {
      response,
      timestamp: Date.now()
    });

    // Maintain memory size
    if (this.state.memory.size > 1000) {
      const oldestKey = Array.from(this.state.memory.keys())[0];
      this.state.memory.delete(oldestKey);
    }
  }

  public getState(): AgentState {
    return { ...this.state };
  }

  public getConfig(): AgentConfig {
    return { ...this.config };
  }
}