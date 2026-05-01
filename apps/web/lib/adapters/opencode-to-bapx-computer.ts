import { ToolCallInput } from '@/components/thread/bapx-media-hub/KortixComputer';
import { AgentStatus } from '@/types/opencode';

/**
 * Adapt OpenCode messages to BapxComputer tool calls
 */
export function adaptMessagesToToolCalls(messages: any[]): ToolCallInput[] {
  return messages
    .filter((msg: any) => msg.type === 'tool_call')
    .map((msg: any) => ({
      id: msg.id || `tool-${Date.now()}`,
      tool_call: {
        name: msg.name || '',
        arguments: msg.arguments || {}
      }
    }));
}

/**
 * Adapt OpenCode agent status to BapxComputer format
 */
export function adaptAgentStatus(status: any): AgentStatus {
  return {
    ...status,
    environment_data: status.data || status.environment_data || {},
    status: status.status || 'idle',
    last_active: status.last_active || new Date().toISOString()
  };
}