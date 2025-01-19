/**
 * Example usage of the AI System
 */
import { AISystem } from './system';

// Example function showing how to use the AI system
export async function processUserInput(text: string) {
  try {
    // Initialize the AI system
    const aiSystem = new AISystem();
    
    // Create input from text
    const input = AISystem.createTextInput(text);
    
    // Process through the system
    const result = await aiSystem.process(input);
    
    // Access the results
    console.log('Processing Results:', {
      nodeId: result.node,
      primaryInsights: result.insights.primary,
      relatedInsights: result.insights.related
    });
    
    return result;
  } catch (error) {
    console.error('Error processing input:', error);
    throw error;
  }
}

// Example usage:
/*
processUserInput("Here's an example text to process through the AI system")
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
*/