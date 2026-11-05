// Damped wave equation on a small height grid. Only the decorative lines refract.
export class WaterSurface {
  private readonly cell: number
  private readonly columns: number
  private readonly rows: number
  private readonly speed: number
  private current: Float32Array
  private previous: Float32Array
  private next: Float32Array
  private readonly normalX: Float32Array
  private readonly normalY: Float32Array
  private readonly damping: Float32Array
  private magnitude = 0
  x = 0
  y = 0

  constructor(width: number, height: number) {
    this.cell = Math.max(12, Math.ceil(width / 180))
    this.columns = Math.max(4, Math.ceil(width / this.cell) + 3)
    this.rows = Math.max(4, Math.ceil(height / this.cell) + 3)
    this.speed = (245 / 60 / this.cell) ** 2
    const count = this.columns * this.rows
    this.current = new Float32Array(count)
    this.previous = new Float32Array(count)
    this.next = new Float32Array(count)
    this.normalX = new Float32Array(count)
    this.normalY = new Float32Array(count)
    this.damping = new Float32Array(count)
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const edge = Math.min(row, column, this.rows - 1 - row, this.columns - 1 - column)
        this.damping[row * this.columns + column] = .024 + .1 * Math.max(0, 1 - edge / 6) ** 2
      }
    }
  }

  disturb(x: number, y: number, radius: number, strength: number) {
    this.magnitude = Math.max(this.magnitude, Math.abs(strength))
    const gx = x / this.cell + 1, gy = y / this.cell + 1
    const spread = radius / this.cell
    const left = Math.max(1, Math.floor(gx - spread * 3))
    const right = Math.min(this.columns - 2, Math.ceil(gx + spread * 3))
    const top = Math.max(1, Math.floor(gy - spread * 3))
    const bottom = Math.min(this.rows - 2, Math.ceil(gy + spread * 3))
    for (let row = top; row <= bottom; row++) {
      for (let column = left; column <= right; column++) {
        const distance = ((column - gx) ** 2 + (row - gy) ** 2) / (spread * spread)
        // A depression and a raised rim displace water without lifting the whole sheet.
        const impulse = strength * (1 - distance * .5) * Math.exp(-distance * .5)
        const index = row * this.columns + column
        this.current[index] += impulse
        this.previous[index] += impulse * .85
      }
    }
  }

  step() {
    const width = this.columns
    let magnitude = 0
    for (let row = 1; row < this.rows - 1; row++) {
      for (let column = 1; column < width - 1; column++) {
        const index = row * width + column
        const height = this.current[index]
        const laplacian = this.current[index - 1] + this.current[index + 1] + this.current[index - width] + this.current[index + width] - height * 4
        const next = height + (height - this.previous[index]) * (1 - this.damping[index]) + this.speed * laplacian
        this.next[index] = next
        magnitude = Math.max(magnitude, Math.abs(next), Math.abs(next - height) * 4)
      }
    }
    this.magnitude = magnitude
    const buffer = this.previous
    this.previous = this.current
    this.current = this.next
    this.next = buffer
  }

  get settled() { return this.magnitude < .015 }

  reset() {
    this.current.fill(0)
    this.previous.fill(0)
    this.next.fill(0)
    this.normalX.fill(0)
    this.normalY.fill(0)
    this.magnitude = 0
  }

  updateNormals() {
    const width = this.columns
    for (let row = 1; row < this.rows - 1; row++) {
      for (let column = 1; column < width - 1; column++) {
        const index = row * width + column
        this.normalX[index] = (this.current[index + 1] - this.current[index - 1]) / (this.cell * 2)
        this.normalY[index] = (this.current[index + width] - this.current[index - width]) / (this.cell * 2)
      }
    }
  }

  private sample(field: Float32Array, x: number, y: number) {
    const gx = Math.max(0, Math.min(this.columns - 2.001, x / this.cell + 1))
    const gy = Math.max(0, Math.min(this.rows - 2.001, y / this.cell + 1))
    const column = Math.floor(gx), row = Math.floor(gy)
    const tx = gx - column, ty = gy - row
    const index = row * this.columns + column
    return (field[index] * (1 - tx) + field[index + 1] * tx) * (1 - ty)
      + (field[index + this.columns] * (1 - tx) + field[index + this.columns + 1] * tx) * ty
  }

  heightAt(x: number, y: number) { return this.sample(this.current, x, y) }

  project(x: number, y: number) {
    const dx = this.sample(this.normalX, x, y) * 45
    const dy = this.sample(this.normalY, x, y) * 45
    this.x = x - dx / (1 + Math.abs(dx) / 12)
    this.y = y - dy / (1 + Math.abs(dy) / 12)
  }
}
