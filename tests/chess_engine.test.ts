import { ChessEngineInterface } from '../src/chess_engine'
import path from 'path'

describe('ChessEngineInterface', () => {
  let engineInterface: ChessEngineInterface

  beforeEach(() => {
    engineInterface = new ChessEngineInterface(
      path.join(__dirname, './alice-engine.exe')
    )
  })

  afterEach(() => {
    engineInterface.shutdown()
  })

  test('uci', async () => {
    const command = 'uci'
    const response = await engineInterface.uci()
    console.log(response)
    expect(response).toBeDefined()
  }, 5000) //(5 seconds)

  test('isready', async () => {
    const response = await engineInterface.isReady()
    console.log(response)
    expect(response).toBeDefined()
  }, 5000) //(5 seconds)

  test('position', async () => {
    await expect(
      engineInterface.position('startpos', ['e2e4', 'e7e5'])
    ).resolves.not.toThrow()
    console.log('position sent')
  }, 2) //(1 seconds)

  test('go depth', async () => {
    const response = await engineInterface.goDepth(6)
    console.log(response)
    expect(response).toBeDefined()
  }, 10000) //(10 seconds)
})
