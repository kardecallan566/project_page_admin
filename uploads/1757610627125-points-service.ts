import { mongoDb } from "./db-mongo"

export class PointsService {
  // Convert BRL to points (1 BRL = 100 points)
  convertBRLToPoints(amount: number): number {
    return Math.floor(amount * 100)
  }

  // Convert points to BRL for display
  convertPointsToBRL(points: number): number {
    return points / 100
  }

  async purchasePoints(
    userId: string,
    amountBRL: number,
    pixPaymentId: string,
  ): Promise<{ transaction: any; pointsAwarded: number }> {
    const pointsAwarded = this.convertBRLToPoints(amountBRL)

    const transaction = await mongoDb.createPendingTransaction(userId, amountBRL, pointsAwarded, pixPaymentId)

    return { transaction, pointsAwarded }
  }

  async confirmPayment(transactionId: string): Promise<boolean> {
    return await mongoDb.completeTransaction(transactionId)
  }

  async getUserBalance(userId: string): Promise<number> {
    return await mongoDb.getUserBalance(userId)
  }

  async spendPoints(userId: string, points: number, description: string): Promise<boolean> {
    const transaction = await mongoDb.spendUserPoints(userId, points, description)
    return transaction !== null
  }

  async getUserTransactionHistory(userId: string): Promise<any[]> {
    return await mongoDb.getUserTransactions(userId)
  }

  // Bonus points for achievements, daily login, etc.
  async awardBonusPoints(userId: string, points: number, reason: string): Promise<void> {
    await mongoDb.addPointsToUser(userId, points, `Bonus: ${reason}`)
  }

  // Get points packages for purchase
  getPointsPackages(): Array<{ id: string; name: string; points: number; price: number; bonus?: number }> {
    return [
      { id: "small", name: "Starter Pack", points: 1000, price: 1.0 },
      { id: "medium", name: "Gamer Pack", points: 2500, price: 1.0, bonus: 500 },
      { id: "large", name: "Pro Pack", points: 5500, price: 1.0, bonus: 1500 },
      { id: "mega", name: "Champion Pack", points: 12000, price: 1.0, bonus: 4000 },
    ]
  }
}
