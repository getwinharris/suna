import * as React from 'react';
import { type ViewProps } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import type { Agent } from '@/api/types';

interface AgentAvatarProps extends ViewProps {
  agent?: Agent;
  size?: number;
}

/**
 * AgentAvatar Component - Agent-specific wrapper around unified Avatar
 * 
 * Uses the unified Avatar component with agent-specific configuration.
 * Automatically handles:
 * - Agent icon from backend (icon_name)
 * - Agent colors (icon_color, icon_background)
 * - BAPX/BAPX SUPER WORKER special case (Bapx symbol)
 * - Fallback to agent name initial
 * 
 * @example
 * <AgentAvatar agent={agent} size={48} />
 */
export function AgentAvatar({ agent, size = 48, style, ...props }: AgentAvatarProps) {
  // Check if this is the BAPX/BAPX SUPER WORKER
  const isBapxAgent = agent?.metadata?.is_bapX_default || 
                      agent?.name?.toLowerCase() === 'bapX' ||
                      agent?.name?.toLowerCase() === 'superworker' ||
                      agent?.name?.toLowerCase() === 'bapx super worker';

  return (
    <Avatar
      variant="agent"
      size={size}
      icon={agent?.icon_name || undefined}
      iconColor={isBapxAgent ? undefined : agent?.icon_color}
      backgroundColor={isBapxAgent ? undefined : agent?.icon_background}
      useBapxSymbol={isBapxAgent}
      fallbackText={agent?.name}
      style={style}
      {...props}
    />
  );
}

