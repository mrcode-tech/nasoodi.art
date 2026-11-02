"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>;

function ScrollArea({ className = "", children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      type="auto"
      data-slot="scroll-area"
      className={`scroll-area ${className}`}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        className="scroll-area-scrollbar"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner className="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };
