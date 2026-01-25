import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomDropdown.css';

const CustomDropdown = ({
    options = [],
    value,
    onChange,
    placeholder = "Select Option",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // Find the label for the selected value
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="custom-dropdown-container" ref={dropdownRef}>
            <div
                className={`custom-dropdown-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`trigger-text ${!selectedOption ? 'placeholder' : ''}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={20} className="trigger-arrow" />
            </div>

            {isOpen && !disabled && (
                <div className="custom-dropdown-menu">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <div
                                key={option.value}
                                className={`dropdown-item ${value === option.value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item" style={{ textAlign: 'center', color: '#9CA3AF', cursor: 'default' }}>
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
