/**
 * Site metadata configuration - SIMPLE AND WORKING
 */

const baseUrl = process.env.BAPX_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || 'https://www.bapx.in';

export const siteMetadata = {
  name: 'Bapx Media Hub',
  title: 'Bapx Media Hub – The Autonomous Company Operating System',
  description:
    'A cloud computer where AI agents run your company. Connect 3,000+ tools, configure autonomous agents, set triggers — and the machine operates 24/7 with persistent memory.',
  url: baseUrl,
  keywords:
    'Bapx Media Hub, autonomous company operating system, AI agents, self-driving company, cloud computer, AI automation, agent orchestration, autowork, AI triggers, persistent memory, autonomous workforce, AI operations',
};
