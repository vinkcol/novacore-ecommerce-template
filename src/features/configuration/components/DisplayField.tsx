export const DisplayField = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1.5 grayscale-[0.5] opacity-80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            {label}
        </span>
        <p className="text-sm font-semibold text-foreground/90 min-h-[1.5rem] break-words">
            {value || "—"}
        </p>
    </div>
);
