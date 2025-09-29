"use client"

import { useEffect, useRef, useState } from "react"

export default function HockeyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    if (!ctx) return

    canvas.width = 600
    canvas.height = 400

    // Paddle (stick)
    const paddle = {
      x: canvas.width / 2 - 50,
      y: canvas.height - 20,
      width: 100,
      height: 12,
      speed: 7,
      dx: 0,
    }

    // Puck (ball)
    const puck = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 10,
      dx: 4,
      dy: 4,
    }

    function drawPaddle() {
      ctx.fillStyle = "white"
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    }

    function drawPuck() {
      ctx.beginPath()
      ctx.arc(puck.x, puck.y, puck.size, 0, Math.PI * 2)
      ctx.fillStyle = "cyan"
      ctx.fill()
      ctx.closePath()
    }

    function movePaddle() {
      paddle.x += paddle.dx
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width
      }
    }

    function movePuck() {
      puck.x += puck.dx
      puck.y += puck.dy

      // Left/right wall
      if (puck.x - puck.size < 0 || puck.x + puck.size > canvas.width) {
        puck.dx *= -1
      }

      // Top wall
      if (puck.y - puck.size < 0) {
        puck.dy *= -1
      }

      // Paddle collision
      if (
        puck.x > paddle.x &&
        puck.x < paddle.x + paddle.width &&
        puck.y + puck.size > paddle.y
      ) {
        puck.dy *= -1
      }

      // Game over
      if (puck.y + puck.size > canvas.height) {
        setGameOver(true)
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPaddle()
      drawPuck()
    }

    function update() {
      if (gameOver) return
      movePaddle()
      movePuck()
      draw()
      requestAnimationFrame(update)
    }

    function keyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") paddle.dx = paddle.speed
      else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed
    }

    function keyUp(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") paddle.dx = 0
    }

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    update()

    return () => {
      document.removeEventListener("keydown", keyDown)
      document.removeEventListener("keyup", keyUp)
    }
  }, [gameOver])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-green-800 text-white">
      <h1 className="text-4xl font-bold mb-4">🏑 Hockey Game</h1>
      <canvas ref={canvasRef} className="bg-black rounded-lg shadow-lg" />
      {gameOver && (
        <p className="mt-4 text-xl text-red-400">Game Over! Refresh to Play Again 🔄</p>
      )}
    </main>
  )
}
