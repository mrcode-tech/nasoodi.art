"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;
const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "left" | "right" }>(({ className = "", side = "left", forceMount, children, ...props }, ref) => (
  <DialogPrimitive.Portal forceMount={forceMount}>
    <DialogPrimitive.Overlay className="sheet-overlay menu-backdrop" />
    <DialogPrimitive.Content ref={ref} data-slot="sheet-content" data-side={side} className={`sheet-content ${className}`} {...props}>{children}</DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";
export { Sheet, SheetTrigger, SheetClose, SheetTitle, SheetDescription, SheetContent };
