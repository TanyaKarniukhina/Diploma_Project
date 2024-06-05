import { IInput } from '../types/Input';
import './styles/Input.css';
import { useState } from "react";
import { useTheme } from '../components/Theme';

function Input({ title, placeholderText, disabled = false, onChange, type }: IInput) {
    const [text, setText] = useState("");
    const [hasError, setHasError] = useState(false);
    const { theme } = useTheme();

    function handleChange(e: any): void {
        const inputValue = e.target.value;
        setText(inputValue);
        if (inputValue.length < 6) {
            setHasError(true);
        } else {
            setHasError(false);
        }
        onChange(e);
    }

    return ( 
        <>
            <div><label className="inputlabel" htmlFor="id">{title}</label></div>
            <input
                id="id"
                value={text}
                className={`input ${theme === 'light' ? 'light' : 'dark'}`}
                placeholder={placeholderText}
                onChange={handleChange}
                style={{ border: hasError ? "2px solid red" : "" }}
                disabled={disabled}
                type={type}
            />
            {hasError && <div className="error">The field is incorrect</div>}
        </>
    );
}

export default Input;