'use client'

import { useRef, useState, useEffect } from 'react'

interface DrawingCanvasProps {
  onSave: (imageBlob: Blob) => void
  isUploading: boolean
}

type Tool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'triangle' | 'fill'

export default function DrawingCanvas({ onSave, isUploading }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [tool, setTool] = useState<Tool>('brush')
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [fillMode, setFillMode] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const previewCanvas = previewCanvasRef.current
    if (!canvas || !previewCanvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Match preview canvas size
    previewCanvas.width = canvas.width
    previewCanvas.height = canvas.height

    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([imageData])
    setHistoryStep(0)
  }, [])

  // Keyboard shortcuts with proper state access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history, historyStep])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    
    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryStep(historyStep + 1)
    }
    
    setHistory(newHistory)
  }

  const undo = () => {
    if (historyStep <= 0) {
      console.log('Nothing to undo')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep - 1
    setHistoryStep(newStep)
    ctx.putImageData(history[newStep], 0, 0)
    console.log(`Undo: Step ${newStep + 1}/${history.length}`)
  }

  const redo = () => {
    if (historyStep >= history.length - 1) {
      console.log('Nothing to redo')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep + 1
    setHistoryStep(newStep)
    ctx.putImageData(history[newStep], 0, 0)
    console.log(`Redo: Step ${newStep + 1}/${history.length}`)
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    const canvas = canvasRef.current
    if (!canvas) return

    // If stamp is selected, place it and return
    if (selectedStamp) {
      placeStamp(pos.x, pos.y, selectedStamp)
      return
    }

    if (tool === 'fill') {
      floodFill(pos.x, pos.y)
      return
    }

    setIsDrawing(true)
    setStartPos(pos)
    setLastPos(pos)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const pos = getMousePos(e)
    const canvas = canvasRef.current
    const previewCanvas = previewCanvasRef.current
    if (!canvas || !previewCanvas) return

    // Always update lastPos for all tools
    setLastPos(pos)

    if (tool === 'brush' || tool === 'eraser') {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(pos.x, pos.y)
      
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = color
      }
      
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over'
    } else {
      // Preview shape
      const previewCtx = previewCanvas.getContext('2d')
      if (!previewCtx) return

      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
      previewCtx.strokeStyle = color
      previewCtx.fillStyle = color
      previewCtx.lineWidth = brushSize
      previewCtx.lineCap = 'round'
      previewCtx.lineJoin = 'round'

      // Create a custom draw context to pass tool for preview
      const originalTool = tool
      drawShape(previewCtx, startPos, pos, fillMode)
    }
  }

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const previewCanvas = previewCanvasRef.current
    if (!canvas || !previewCanvas) return

    // Get final position if event is provided
    const finalPos = e ? getMousePos(e) : lastPos

    if (tool !== 'brush' && tool !== 'eraser') {
      const ctx = canvas.getContext('2d')
      const previewCtx = previewCanvas.getContext('2d')
      if (!ctx || !previewCtx) return

      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      drawShape(ctx, startPos, finalPos, fillMode)
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
    }

    setIsDrawing(false)
    saveToHistory()
  }

  const drawShape = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, filled: boolean = false) => {
    const width = end.x - start.x
    const height = end.y - start.y

    ctx.beginPath()

    switch (tool) {
      case 'line':
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        break

      case 'rectangle':
        if (filled) {
          ctx.fillRect(start.x, start.y, width, height)
        } else {
          ctx.strokeRect(start.x, start.y, width, height)
        }
        break

      case 'circle':
        const radius = Math.sqrt(width * width + height * height)
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI)
        if (filled) {
          ctx.fill()
        } else {
          ctx.stroke()
        }
        break

      case 'triangle':
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.lineTo(start.x - (end.x - start.x), end.y)
        ctx.closePath()
        if (filled) {
          ctx.fill()
        } else {
          ctx.stroke()
        }
        break
    }
  }

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const targetColor = getPixelColor(pixels, Math.floor(startX), Math.floor(startY), canvas.width)
    const fillColor = hexToRgb(color)

    if (colorsMatch(targetColor, fillColor)) return

    const stack = [[Math.floor(startX), Math.floor(startY)]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (visited.has(key)) continue
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue

      const currentColor = getPixelColor(pixels, x, y, canvas.width)
      if (!colorsMatch(currentColor, targetColor)) continue

      visited.add(key)
      setPixelColor(pixels, x, y, canvas.width, fillColor)

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const getPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]]
  }

  const setPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const index = (y * width + x) * 4
    pixels[index] = color[0]
    pixels[index + 1] = color[1]
    pixels[index + 2] = color[2]
    pixels[index + 3] = 255
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob)
      }
    }, 'image/png', 0.8)
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `olive-doodle-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  const palestineColors = [
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Green', color: '#00732F' },
    { name: 'Red', color: '#EE2A35' },
    { name: 'Blue', color: '#3B5998' },
    { name: 'Yellow', color: '#FFD700' },
    { name: 'Brown', color: '#8B4513' },
    { name: 'Purple', color: '#9B59B6' },
  ]

  const tools = [
    { name: 'Brush', value: 'brush' as Tool, icon: '🖌️', desc: 'Free draw' },
    { name: 'Eraser', value: 'eraser' as Tool, icon: '🧹', desc: 'Erase' },
    { name: 'Line', value: 'line' as Tool, icon: '📏', desc: 'Straight line' },
    { name: 'Rectangle', value: 'rectangle' as Tool, icon: '▭', desc: 'Draw rectangle' },
    { name: 'Circle', value: 'circle' as Tool, icon: '⭕', desc: 'Draw circle' },
    { name: 'Triangle', value: 'triangle' as Tool, icon: '△', desc: 'Draw triangle' },
    { name: 'Fill', value: 'fill' as Tool, icon: '🪣', desc: 'Paint bucket' },
  ]

  const stamps = [
    { name: 'Olive Branch', emoji: '🫒', desc: 'Symbol of peace' },
    { name: 'Dove', emoji: '🕊️', desc: 'Peace dove' },
    { name: 'Flag', emoji: '🇵🇸', desc: 'Palestinian flag' },
    { name: 'Key', emoji: '🔑', desc: 'Right of return' },
    { name: 'Watermelon', emoji: '🍉', desc: 'Solidarity symbol' },
    { name: 'Heart', emoji: '❤️', desc: 'Love and support' },
    { name: 'Fist', emoji: '✊', desc: 'Resistance' },
    { name: 'Star', emoji: '⭐', desc: 'Hope' },
  ]

  const placeStamp = (x: number, y: number, emoji: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set font size for emoji
    ctx.font = `${brushSize * 10}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, x, y)
    
    saveToHistory()
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Tools & Controls */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* Tools */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🛠️</span>
                  Drawing Tools
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {tools.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTool(t.value)}
                      className={`group/tool relative transition-all ${
                        tool === t.value ? 'scale-105' : 'hover:scale-105'
                      }`}
                      title={t.desc}
                    >
                      <div className={`absolute -inset-0.5 rounded-xl blur transition-opacity ${
                        tool === t.value 
                          ? 'opacity-100 bg-gradient-to-r from-green-400 to-red-400' 
                          : 'opacity-0 group-hover/tool:opacity-50 bg-white'
                      }`}></div>
                      <div className={`relative p-4 rounded-xl border-2 transition-all ${
                        tool === t.value 
                          ? 'bg-green-600 border-green-400 shadow-lg shadow-green-600/50' 
                          : 'bg-slate-700 border-white/20 hover:border-white/40'
                      }`}>
                        <div className="text-2xl mb-1">{t.icon}</div>
                        <div className={`text-xs font-medium ${
                          tool === t.value ? 'text-white' : 'text-gray-400'
                        }`}>
                          {t.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎨</span>
                  Colors
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {palestineColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setColor(c.color)}
                      className={`relative group/color transition-all ${
                        color === c.color ? 'scale-110' : 'hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <div className={`absolute -inset-1 rounded-full blur transition-opacity ${
                        color === c.color 
                          ? 'opacity-100 bg-gradient-to-r from-green-400 to-red-400' 
                          : 'opacity-0 group-hover/color:opacity-50 bg-white'
                      }`}></div>
                      <div 
                        className={`relative w-full aspect-square rounded-full border-3 transition-all shadow-lg ${
                          color === c.color 
                            ? 'border-white border-4 shadow-white/50 ring-2 ring-green-400' 
                            : 'border-white/30 border-2 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: c.color }}
                      >
                        {color === c.color && (
                          <div className="absolute inset-0 flex items-center justify-center text-lg">
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {/* Current Color Display */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-white/30 shadow-lg"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-300 font-mono">{color}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brush Size */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>✏️</span>
                    Size
                  </span>
                  <span className="text-xl font-black text-green-400">
                    {brushSize}px
                  </span>
                </h3>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-green-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-green-500/50 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Fine</span>
                  <span>Bold</span>
                </div>
                {/* Size Preview */}
                <div className="mt-4 flex items-center justify-center">
                  <div 
                    className="rounded-full"
                    style={{ 
                      width: `${Math.min(brushSize * 2, 60)}px`, 
                      height: `${Math.min(brushSize * 2, 60)}px`,
                      backgroundColor: color,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Palestine Stamps */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-green-600 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🇵🇸</span>
                  Stamps
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {stamps.map((stamp) => (
                    <button
                      key={stamp.emoji}
                      onClick={() => setSelectedStamp(selectedStamp === stamp.emoji ? null : stamp.emoji)}
                      className={`relative group/stamp transition-all ${
                        selectedStamp === stamp.emoji ? 'scale-110' : 'hover:scale-105'
                      }`}
                      title={stamp.desc}
                    >
                      <div className={`absolute -inset-0.5 rounded-xl blur transition-opacity ${
                        selectedStamp === stamp.emoji 
                          ? 'opacity-100 bg-gradient-to-r from-green-400 to-red-400' 
                          : 'opacity-0 group-hover/stamp:opacity-50 bg-white'
                      }`}></div>
                      <div className={`relative p-3 rounded-xl border-2 transition-all text-2xl ${
                        selectedStamp === stamp.emoji 
                          ? 'bg-gradient-to-br from-green-600 to-red-600 border-white shadow-lg' 
                          : 'bg-slate-700 border-white/20 hover:border-white/40'
                      }`}>
                        {stamp.emoji}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedStamp && (
                  <div className="text-center">
                    <p className="text-xs text-green-400 font-bold">
                      ✓ Click canvas to place stamp
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fill Toggle (for shapes) */}
            {(tool === 'rectangle' || tool === 'circle' || tool === 'triangle') && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl opacity-50 blur"></div>
                <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-white font-bold flex items-center gap-2">
                      <span>🎨</span>
                      Fill Shape
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={fillMode}
                        onChange={(e) => setFillMode(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-14 h-7 rounded-full transition-all ${fillMode ? 'bg-green-600' : 'bg-slate-600'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${fillMode ? 'translate-x-7' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Undo/Redo */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={undo}
                  disabled={historyStep <= 0}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <span className="text-lg">↶</span>
                  Undo
                </button>
                <button
                  onClick={redo}
                  disabled={historyStep >= history.length - 1}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <span className="text-lg">↷</span>
                  Redo
                </button>
              </div>

              <button
                onClick={downloadDrawing}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 border border-blue-500/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">📥</span>
                Download
              </button>

              <button
                onClick={clearCanvas}
                className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">🗑️</span>
                Clear Canvas
              </button>
              
              <button
                onClick={saveDrawing}
                disabled={isUploading}
                className="w-full group/btn relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300"></div>
                <div className="relative px-6 py-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      Save & Share
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-white to-red-600 rounded-2xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🎨</span>
                  Your Canvas
                </h3>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="hidden sm:inline">Draw your message of solidarity</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">
                    {selectedStamp ? `${selectedStamp} Stamp` :
                     tool === 'brush' ? '🖌️ Brush' : 
                     tool === 'eraser' ? '🧹 Eraser' :
                     tool === 'line' ? '📏 Line' : 
                     tool === 'rectangle' ? '▭ Rectangle' : 
                     tool === 'circle' ? '⭕ Circle' : 
                     tool === 'triangle' ? '△ Triangle' : 
                     '🪣 Fill'}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-2xl p-2 border-4 border-white/10 relative">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="rounded-lg w-full touch-none"
                    style={{ cursor: 'crosshair' }}
                  />
                  <canvas
                    ref={previewCanvasRef}
                    width={800}
                    height={600}
                    className="absolute top-0 left-0 rounded-lg w-full touch-none"
                    style={{ cursor: 'crosshair' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
              {/* Helper Text */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  💡 <span className="text-gray-300">Tip:</span> {
                    selectedStamp ? 'Click anywhere on canvas to place the Palestine stamp!' :
                    tool === 'brush' ? 'Click and drag to draw freely' :
                    tool === 'eraser' ? 'Click and drag to erase. Use Ctrl+Z to undo!' :
                    tool === 'line' ? 'Click and drag to draw a straight line' :
                    tool === 'rectangle' ? 'Click and drag to draw a rectangle. Toggle fill mode!' :
                    tool === 'circle' ? 'Click and drag to draw a circle. Toggle fill mode!' :
                    tool === 'triangle' ? 'Click and drag to draw a triangle. Toggle fill mode!' :
                    'Click any area to fill it with the selected color'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

