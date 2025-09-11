import { promises as fs } from "fs"
import path from "path"

interface WebhookLog {
  id: string
  paymentId: string
  event: string
  status: "success" | "error" | "processed"
  metadata: any
  timestamp: string
}

export class WebhookLogger {
  private logsPath: string

  constructor() {
    this.logsPath = path.join(process.cwd(), "data", "webhook-logs.json")
  }

  private async ensureLogsFile(): Promise<void> {
    const logsDir = path.dirname(this.logsPath)
    try {
      await fs.access(logsDir)
    } catch {
      await fs.mkdir(logsDir, { recursive: true })
    }

    try {
      await fs.access(this.logsPath)
    } catch {
      await fs.writeFile(this.logsPath, JSON.stringify([]))
    }
  }

  async logEvent(
    paymentId: string,
    event: string,
    status: "success" | "error" | "processed",
    metadata: any = {},
  ): Promise<void> {
    try {
      await this.ensureLogsFile()

      const logs: WebhookLog[] = JSON.parse(await fs.readFile(this.logsPath, "utf-8"))

      const newLog: WebhookLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paymentId,
        event,
        status,
        metadata,
        timestamp: new Date().toISOString(),
      }

      logs.push(newLog)

      // Keep only the last 1000 logs to prevent file from growing too large
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000)
      }

      await fs.writeFile(this.logsPath, JSON.stringify(logs, null, 2))

      console.log(`[v0] Webhook logged: ${event} - ${status} for payment ${paymentId}`)
    } catch (error) {
      console.error("[v0] Failed to log webhook event:", error)
    }
  }

  async getLogs(limit = 50): Promise<WebhookLog[]> {
    try {
      await this.ensureLogsFile()
      const logs: WebhookLog[] = JSON.parse(await fs.readFile(this.logsPath, "utf-8"))
      return logs.slice(-limit).reverse() // Return most recent logs first
    } catch (error) {
      console.error("[v0] Failed to get webhook logs:", error)
      return []
    }
  }

  async getLogsByPaymentId(paymentId: string): Promise<WebhookLog[]> {
    try {
      const logs = await this.getLogs(1000) // Get more logs for searching
      return logs.filter((log) => log.paymentId === paymentId)
    } catch (error) {
      console.error("[v0] Failed to get logs by payment ID:", error)
      return []
    }
  }
}
