import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface DualRangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  formatLabel?: (value: number) => string
  className?: string
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ min, max, step = 1, value, onValueChange, formatLabel, className }, ref) => {
  const defaultFormat = (val: number) => val.toString()
  const format = formatLabel || defaultFormat

  return (
    <div className={cn("relative pt-6 pb-2", className)}>
      {/* Value labels */}
      <div className="absolute top-0 left-0 right-0 flex justify-between text-sm text-white">
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
          {format(value[0])}
        </span>
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
          {format(value[1])}
        </span>
      </div>

      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        className="relative flex w-full touch-none select-none items-center"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8F5A]" />
        </SliderPrimitive.Track>

        {/* First thumb (min) */}
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[#FF6B35] bg-black shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:border-[#FF8F5A] cursor-grab active:cursor-grabbing" />

        {/* Second thumb (max) */}
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[#FF6B35] bg-black shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:border-[#FF8F5A] cursor-grab active:cursor-grabbing" />
      </SliderPrimitive.Root>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-xs text-white/50">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
})

DualRangeSlider.displayName = "DualRangeSlider"

export { DualRangeSlider }
