import React, { useState } from "react";

export function Dropdown({ options, value, onChange, placeholder = "select protocol" }) {
    const handleChange = (e) => {
        onChange?.(e.target.value)
    }

    return (
        <select
            className="edge-dropdown"
            value={value || ""}
            onChange={handleChange}
        >
            <option value="">{placeholder}</option>
            {options.map((option, i) => (
                <option key= { i } value= { option }>
                    { option }
                </option>
            ))}    
        </select>
    );
}