/**
 * Hybrid Integration Layer
 * Manages cross-modal data integration and synchronization
 */
import type { ProcessedInput } from '../quantum/inputProcessor';
import type { AgentResponse } from '../agents/baseAgent';

interface IntegrationNode {
  id: string;
  type: string;
  data: any;
  connections: Set<string>;
  metadata: Record<string, any>;
}

export class IntegrationLayer {
  private nodes: Map<string, IntegrationNode> = new Map();
  private temporalIndex: Map<number, Set<string>> = new Map();
  
  async integrate(input: ProcessedInput, agentResponses: AgentResponse[]): Promise<any> {
    // Create integration node
    const node = await this.createNode(input, agentResponses);
    
    // Add to indexes
    this.addToIndexes(node);
    
    // Find related nodes
    const relatedNodes = await this.findRelatedNodes(node);
    
    // Merge insights
    const mergedInsights = await this.mergeInsights(node, relatedNodes);
    
    return {
      integrated: true,
      node: node.id,
      insights: mergedInsights
    };
  }

  private async createNode(
    input: ProcessedInput,
    agentResponses: AgentResponse[]
  ): Promise<IntegrationNode> {
    const node: IntegrationNode = {
      id: crypto.randomUUID(),
      type: input.context.type,
      data: {
        input,
        responses: agentResponses
      },
      connections: new Set(),
      metadata: {
        timestamp: Date.now(),
        confidence: this.calculateNodeConfidence(agentResponses)
      }
    };

    this.nodes.set(node.id, node);
    return node;
  }

  private calculateNodeConfidence(responses: AgentResponse[]): number {
    // Average confidence across all agent responses
    const confidences = responses.map(r => r.metadata.confidence);
    return confidences.reduce((a, b) => a + b, 0) / confidences.length;
  }

  private addToIndexes(node: IntegrationNode): void {
    // Add to temporal index
    const timestamp = node.metadata.timestamp;
    const timeKey = Math.floor(timestamp / 1000) * 1000; // Group by second
    
    if (!this.temporalIndex.has(timeKey)) {
      this.temporalIndex.set(timeKey, new Set());
    }
    this.temporalIndex.get(timeKey)!.add(node.id);
  }

  private async findRelatedNodes(node: IntegrationNode): Promise<IntegrationNode[]> {
    const relatedNodes: IntegrationNode[] = [];
    
    // Find temporally related nodes
    const nodeTime = node.metadata.timestamp;
    const timeWindow = 5000; // 5 second window
    
    for (const [time, nodeIds] of this.temporalIndex.entries()) {
      if (Math.abs(time - nodeTime) <= timeWindow) {
        for (const id of nodeIds) {
          if (id !== node.id) {
            const relatedNode = this.nodes.get(id);
            if (relatedNode) {
              relatedNodes.push(relatedNode);
            }
          }
        }
      }
    }
    
    return relatedNodes;
  }

  private async mergeInsights(
    node: IntegrationNode,
    relatedNodes: IntegrationNode[]
  ): Promise<any> {
    const insights: any[] = [];
    
    // Add current node insights
    if (node.data.responses) {
      for (const response of node.data.responses) {
        if (response.success && response.data) {
          insights.push({
            type: 'direct',
            data: response.data,
            confidence: response.metadata.confidence
          });
        }
      }
    }
    
    // Add related insights
    for (const related of relatedNodes) {
      if (related.data.responses) {
        for (const response of related.data.responses) {
          if (response.success && response.data) {
            insights.push({
              type: 'related',
              data: response.data,
              confidence: response.metadata.confidence * 0.8 // Reduce confidence for related insights
            });
          }
        }
      }
    }
    
    return {
      primary: insights.filter(i => i.type === 'direct'),
      related: insights.filter(i => i.type === 'related')
    };
  }

  public getNode(id: string): IntegrationNode | undefined {
    return this.nodes.get(id);
  }

  public getRecentNodes(limit: number = 10): IntegrationNode[] {
    return Array.from(this.nodes.values())
      .sort((a, b) => b.metadata.timestamp - a.metadata.timestamp)
      .slice(0, limit);
  }
}