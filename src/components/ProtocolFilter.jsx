import React, { useState, useRef, useEffect } from "react";

export function ProtocolFilter({ tools, activeProtocol, onSelect }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const protocols = Array.from(
        new Set(tools.flatMap(t => [...(t.input || []), ...(t.output || [])]))
    ).sort();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const label = activeProtocol || "All protocols";

    return (
        <div className="protocol-filter" ref={ref}>
            <button
                type="button"
                className={`protocol-select-btn${open ? " open" : ""}`}
                onClick={() => setOpen(o => !o)}
            >
                <span>{label}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0l5 6 5-6z" fill="white" />
                </svg>
            </button>
            {open && (
                <div className="protocol-dropdown">
                    <div
                        className={`protocol-option${!activeProtocol ? " active" : ""}`}
                        onClick={() => { onSelect(null); setOpen(false); }}
                    >All protocols</div>
                    {protocols.map(p => (
                        <div
                            key={p}
                            className={`protocol-option${activeProtocol === p ? " active" : ""}`}
                            onClick={() => { onSelect(p); setOpen(false); }}
                        >{p}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
