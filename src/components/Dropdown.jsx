import React, { useState } from "react";

export function Dropdown({ options, value, onChange }) {
    const handleChange = (e) => {
        onChange?.(e.target.value)
    }

    return (
        <select
            className="edge-dropdown"
            value={value || ""}
            onChange={handleChange}
        >
            <option value=""> select protocol</option>
            {options.map((option, i) => (
                <option key= { i } value= { option }>
                    { option }
                </option>
            ))}    
        </select>
    );
}