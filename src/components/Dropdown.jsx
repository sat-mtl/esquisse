import React, { useState } from "react";

export function Dropdown({ options, value, onChange }) {
    const handleChange = (e) => {
        onChange?.(e.target.value)
    }

    return(    
        <select value={ value || "" } onChange={handleChange}>
            <option value="">-- Select --</option>
            {options.map((option, i) => (
                <option key= { i } value= { option }>
                    { option }
                </option>
            ))}    
        </select>
    );
}