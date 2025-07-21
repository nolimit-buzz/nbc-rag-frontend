"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Popover Root
export const Popover = PopoverPrimitive.Root

// Popover Trigger
export const PopoverTrigger = PopoverPrimitive.Trigger

// Popover Content with Arrow, Portal, and ref forwarding
export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[1111111] w-72 origin-[--radix-popover-content-transform-origin] rounded-md border p-4 shadow-md outline-none",
        className
      )}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-popover" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Popover Anchor (optional)
export const PopoverAnchor = PopoverPrimitive.Anchor

// Popover Close (optional, for close button inside content)
export const PopoverClose = PopoverPrimitive.Close
