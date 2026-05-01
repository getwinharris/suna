import { createTriggersPlugin } from "../../../triggers/src/index"
import { resolveBapxWorkspaceRoot } from "./lib/paths"

const workspaceRoot = resolveBapxWorkspaceRoot(import.meta.dir)
const webhookHost = process.env.BAPX_TRIGGER_WEBHOOK_HOST || "0.0.0.0"
const webhookPort = Number(process.env.BAPX_TRIGGER_WEBHOOK_PORT || 8099)

export default createTriggersPlugin({
  directory: workspaceRoot,
  webhookHost,
  webhookPort,
  publicBaseUrl: process.env.SANDBOX_PUBLIC_URL || "http://localhost:8000",
})
