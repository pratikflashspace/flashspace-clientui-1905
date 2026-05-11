import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

const Toaster = (props) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      duration={4000}
      position="top-center"
      offset="32px"
      expand={true}
      richColors={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/80 dark:group-[.toaster]:bg-[#0a0a0a]/80 group-[.toaster]:backdrop-blur-3xl group-[.toaster]:text-foreground group-[.toaster]:border-white/30 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_0_1px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.2)] group-[.toaster]:rounded-[28px] group-[.toaster]:px-7 group-[.toaster]:py-5 group-[.toaster]:transition-all group-[.toaster]:duration-500 group-[.toaster]:ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
          description: "group-[.toast]:text-muted-foreground font-medium text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-xl font-bold px-4",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-xl font-bold px-4",
          success: "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-emerald-500/15 group-[.toaster]:to-teal-500/5 dark:group-[.toaster]:from-emerald-500/25 dark:group-[.toaster]:to-teal-500/10 group-[.toaster]:border-emerald-500/40",
          error: "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-red-500/15 group-[.toaster]:to-rose-500/5 dark:group-[.toaster]:from-red-500/25 dark:group-[.toaster]:to-rose-500/10 group-[.toaster]:border-red-500/40",
          info: "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-blue-500/15 group-[.toaster]:to-indigo-500/5 dark:group-[.toaster]:from-blue-500/25 dark:group-[.toaster]:to-indigo-500/10 group-[.toaster]:border-blue-500/40",
          warning: "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-amber-500/15 group-[.toaster]:to-orange-500/5 dark:group-[.toaster]:from-amber-500/25 dark:group-[.toaster]:to-orange-500/10 group-[.toaster]:border-amber-500/40",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
