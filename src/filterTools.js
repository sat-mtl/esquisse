const PREFIX_RE = /^(in|out):(.*)$/i;

export function filterTools(tools, query, { lang = "en" } = {}) {
    const tokens = (query || "").trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (tokens.length === 0) return tools;

    return tools.filter(tool => {
        return tokens.every(token => {
            const match = token.match(PREFIX_RE);
            if (match) {
                const [, dir, protocol] = match;
                if (!protocol) return true; // "in:" / "out:" alone — no constraint, show everything
                const list = dir === "in" ? tool.input : tool.output;
                return (list || []).some(p => p.toLowerCase().includes(protocol));
            }
            const name = (lang === "fr" ? tool.nameFr : tool.name) || tool.name || "";
            return name.toLowerCase().includes(token);
        });
    });
}
