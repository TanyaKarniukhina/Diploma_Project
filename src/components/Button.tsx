import { IButton } from '../types/Button';
import './styles/Button.css';

function Button({text, isDisabled, typeButton}: IButton) {
    return (
        <button disabled={isDisabled} className={typeButton}>{text}</button>
    );
}

export default Button;