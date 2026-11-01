"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Locale } from "@/lib/site";
type ThemeMode = "light" | "dark" | "system";
const icons = {
 light: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>,
 dark: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"/></svg>,
 system: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8m-4-4v4"/></svg>,
};
export function ThemeSelector({ locale }: { locale: Locale }) {
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);
 useEffect(() => setMounted(true), []);
 const labels: Record<ThemeMode,string> = locale === "fa" ? {light:"روشن",dark:"تیره",system:"سیستم"} : {light:"Light",dark:"Dark",system:"System"};
 const accessibleName = locale === "fa" ? "انتخاب پوسته" : "Choose theme";
 const selected: ThemeMode = mounted && (theme === "light" || theme === "dark" || theme === "system") ? theme : "system";
 return <div className="theme-selector"><DropdownMenu>
  <DropdownMenuTrigger asChild><Button className="theme-trigger" variant="ghost" size="sm" aria-label={accessibleName}>{icons[selected]}<span>{labels[selected]}</span><span aria-hidden="true">⌄</span></Button></DropdownMenuTrigger>
  <DropdownMenuContent align={locale === "fa" ? "start" : "end"} dir={locale === "fa" ? "rtl" : "ltr"} aria-label={accessibleName}>
   <DropdownMenuRadioGroup value={selected} onValueChange={(value)=>setTheme(value as ThemeMode)}>
    {(["light","dark","system"] as const).map(mode=><DropdownMenuRadioItem className="theme-menu-item" key={mode} value={mode}>{icons[mode]}<span>{labels[mode]}</span></DropdownMenuRadioItem>)}
   </DropdownMenuRadioGroup>
  </DropdownMenuContent>
 </DropdownMenu></div>;
}
