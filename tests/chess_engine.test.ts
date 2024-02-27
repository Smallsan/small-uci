import { ChessEngineInterface } from '../src/chess_engine'
import path from 'path'

describe('ChessEngineInterface', () => {
  let engine_interface: ChessEngineInterface

  beforeEach(() => {
    engine_interface = new ChessEngineInterface(
      path.join(__dirname, 'Path to your engine')
    )
  })

  afterEach(() => {
    engine_interface.shutdown()
  })

  test('uci', async () => {
    const command = 'uci'
    const response = await engine_interface .uci()
    console.log(response)
    expect(response).toBeDefined()
  }, 5000) //(5 seconds)

  test('isready', async () => {
    const response = await engine_interface.isReady()
    console.log(response)
    expect(response).toBeDefined()
  }, 5000) //(5 seconds)

  test('position', async () => {
    await expect(
    engine_interface.position('startpos', ['e2e4', 'e7e5'])
    ).resolves.not.toThrow()
    console.log("position sent")
  }, 1) //(1 seconds)

  test('go depth', async () => {
    const response = await engine_interface.go_depth(4)
    console.log(response)
    expect(response).toBeDefined()
  }, 10000) //(10 seconds)
})
