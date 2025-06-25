
import React from "react"
import { cn } from "@/app/lib/utils"

interface StarBorderProps {
  as?: React.ElementType
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
  [key: string]: any
}

export function StarBorder({
  as: Component = "button",
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps) {
  const defaultColor = color || "#E50046"

  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )} 
      {...props}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-30" 
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-30"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className={cn(
        "relative z-10 border text-white text-center text-base py-4 px-8 rounded-[20px]",
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
      )}>
        {children}
      </div>
    </Component>
  )
}
