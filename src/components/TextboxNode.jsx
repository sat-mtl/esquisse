import React, { useState } from "react";

export function TextboxNode({ data }) {
    const [text, setText] = useState(data.label || "");

    const handleChange = (e) => {
        setText(e.target.value);
        if(data.onTextChange) data.onTextChange(e.target.value);
    };

    return (
        <div>
            <textarea
                className="textbox" 
                value={ text }
                onChange={ handleChange }
                placeholder="Type text here"
            />
        </div>
    )
}