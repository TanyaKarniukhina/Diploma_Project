import { useState } from 'react';
import './styles/ResetPassword.css';
import background from '../image/background.svg';
import logo from '../image/pixema.svg';
import Input from '../components/Input';
import Button from '../components/Button';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/Theme';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const auth = getAuth();
    const history = useNavigate();
    const { theme } = useTheme();

    const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

    const isFormValid = isEmailValid(email) && email.trim().length >= 6;

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handleResetPassword = (e: any) => {
        e.preventDefault();

        if (!isFormValid) {
            console.log('The email field is incorrect or empty.'); 
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(data => {
                setMessage(`You will receive an email at ${email} with a link to reset your password!`);
                history("/")
            })
            .catch((error) => {
                console.error(error);
                setMessage('Failed to send reset email. Please try again.');
            });
    };

    return (
        <div className={`reset-container ${theme === 'light' ? 'light' : 'dark'}`} style={{backgroundSize: 'cover', backgroundImage: `url(${background})`}}>
            <div className='logo-reset-container'>
                <img className='logo-container_pic' src={logo} alt='logo' />
            </div>
            <div className='form-container'>
                <form onSubmit={(e)=>handleResetPassword(e)} className={`form-reset ${theme === 'light' ? 'light' : 'dark'}`}>
                    <h1 className={`form__title ${theme === 'light' ? 'light' : 'dark'}`}>Reset password</h1>
                    {message && <p className={`success-message ${theme === 'light' ? 'light' : 'dark'}`}>{message}</p>}
                    <div className='reset-input'>
                        <Input title="Email" placeholderText="Your email" disabled={false} onChange={handleEmailChange} />
                    </div>
                    <div className="button-container">
                        <Button text="Reset" isDisabled={!isFormValid} typeButton="button-primary" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
