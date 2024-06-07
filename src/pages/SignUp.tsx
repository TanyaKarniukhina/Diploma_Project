import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import background from '../image/background.png';
import logo from '../image/pixema.svg';
import { setUser } from '../redux/UserSlice';
import './styles/SignUp.css';
import { useTheme } from '../components/Theme';


function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 6;
        const isNameValid = name.length >= 3;
        const doPasswordsMatch = password === confirm;

        setIsValid(isEmailValid && isPasswordValid && isNameValid && doPasswordsMatch);
    }, [email, password, name, confirm]);

    const handleSignUp = (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                return updateProfile(user, { displayName: name })
                    .then(() => {
                        localStorage.setItem('userName', name);
                        console.log(user);
                        dispatch(setUser({
                            email: user.email,
                            id: user.uid,
                            token: user.refreshToken,
                        }));
                        navigate('/');
                    });
            })
            .catch(error => {
                console.error(error);
                setError('Failed to create an account');
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={`sign-up-container ${theme === 'light' ? 'light' : 'dark'}`} style={{ backgroundSize: 'cover', backgroundImage: `url(${background})` }}>
            <div className='logo-sign-up-container'>
                <img className='logo-container_pic' src={logo} alt='logo' />
            </div>
            <div className='form-container'>
                {isLoading ? <p className='loading-form'>Loading...</p> : (
                    <form onSubmit={handleSignUp} className={`form-sign-up ${theme === 'light' ? 'light' : 'dark'}`}>
                        <h1 className={`form__title ${theme === 'light' ? 'light' : 'dark'}`}>Sign Up</h1>
                        <div className='sign-up-input'>
                            <Input 
                                title="Name" 
                                placeholderText="Your name" 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            <Input 
                                title="Email" 
                                placeholderText="Your email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <Input 
                                title="Password" 
                                placeholderText="Your password" 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <Input 
                                title="Confirm password" 
                                placeholderText="Confirm password" 
                                type="password" 
                                onChange={(e) => setConfirm(e.target.value)} 
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <Button 
                            text="Sign Up" 
                            isDisabled={isLoading || !isValid} 
                            typeButton="button-primary" 
                        />
                    </form>
                )}
            </div>
        </div>
    );
}

export default SignUp;


