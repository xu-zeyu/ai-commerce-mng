export type AgentStreamStatus = 'connecting' | 'connected' | 'closed' | 'error'

export interface AgentStreamPacket {
  data: string
  eventType: string
}

export interface AgentStreamEvent extends AgentStreamPacket {
  id: number
  receivedAt: string
}
