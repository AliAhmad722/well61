"use client"

import { useEffect, useRef, useState } from "react"

export default function HockeyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 600
    canvas.height = 400

    // Paddle (hockey stick)
    const paddle = {
      x: canvas.width / 2 - 50,
      y: canvas.height - 30,
      width: 100,
      height: 15,
      speed: 7,
      dx: 0,
    }

    // Puck (ball)
    const puck = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 12,
      dx: 4,
      dy: 4,
    }

    // Draw Paddle
    function drawPaddle() {
      ctx.fillStyle = "white"
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    }

    // Draw Puck
    function drawPuck() {
      ctx.beginPath()
      ctx.arc(puck.x, puck.y, puck.size, 0, Math.PI * 2)
      ctx.fillStyle = "cyan"
      ctx.fill()
      ctx.closePath()
    }

    // Move Paddle
    function movePaddle() {
      paddle.x += paddle.dx
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width
    }

    // Move Puck
    function movePuck() {
      puck.x += puck.dx
      puck.y += puck.dy

      // Wall collision (left/right)
      if (puck.x - puck.size < 0 || puck.x + puck.size > canvas.width) {
        puck.dx *= -1
      }

      // Wall collision (top)
      if (puck.y - puck.size < 0) {
        puck.dy *= -1
      }

      // Paddle collision
      if (
        puck.x > paddle.x &&
        puck.x < paddle.x + paddle.width &&
        puck.y + puck.size > paddle.y &&
        puck.y - puck.size < paddle.y + paddle.height
      ) {
        puck.dy *= -1
      }

      // Game over (bottom)
      if (puck.y + puck.size > canvas.height) {
        setGameOver(true)
      }
    }

    // Draw everything
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPaddle()
      drawPuck()
    }

    // Update
    function update() {
      if (gameOver) return
      movePaddle()
      movePuck()
      draw()
      requestAnimationFrame(update)
    }

    // Controls
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-green-700 text-white">
      <h1 className="text-4xl font-extrabold mb-4">🏑 Hockey Game</h1>
      <canvas ref={canvasRef} className="bg-black rounded shadow-lg" />
      {gameOver && <p className="mt-6 text-xl text-red-400">Game Over! Refresh to Play Again 🚀</p>}
    </main>
  )
}
