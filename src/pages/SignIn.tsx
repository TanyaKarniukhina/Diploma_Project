import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import background from '../image/background.svg';
import logo from '../image/pixema.svg';
import { setUser } from '../redux/UserSlice';
import './styles/SignIn.css';
import { useTheme } from '../components/Theme';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string | null>(null); 

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setName(storedUserName);
        }
    }, []);

    const isFieldValid = (field: string) => field.trim().length >= 6;

    const isFormValid = isFieldValid(email) && isFieldValid(password);

    const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handleSignIn = (event: any) => {
        event.preventDefault();
        setIsLoading(true);

        if (!isFormValid) {
            alert('The field is incorrect.'); 
            setIsLoading(false);
            return;
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                const displayName = user.displayName;
                if (displayName) {
                    localStorage.setItem('userName', displayName);
                }
                dispatch(setUser({
                    email: user.email,
                    id: user.uid,
                    token: user.refreshToken,
                }));
                navigate('/');
            })
            .catch((error) => {
                alert('Invalid user!');
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className={`sign-in-container ${theme === 'light' ? 'light' : 'dark'}`} style={{ backgroundSize: 'cover', backgroundImage: `url(${background})` }}>
            <div className='logo-sign-in-container'>
                <img className='logo-container_pic' src={logo} alt='logo' />
            </div>
            <div className='form-container'>
                <form onSubmit={handleSignIn} className={`form-sign-in ${theme === 'light' ? 'light' : 'dark'}`}>
                    <h1 className={`form__title ${theme === 'light' ? 'light' : 'dark'}`}>Sign In</h1>
                    <div className='sign-in-input'>
                        <Input 
                            title="Email" 
                            placeholderText="Your email" 
                            onChange={handleEmailChange} 
                        />
                        <Input 
                            title="Password" 
                            placeholderText="Your password" 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <Link to="/reset-password" className="forgot-password-sign-in" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                    </div>
                    <Button 
                        text="Sign In" 
                        isDisabled={!isFormValid || isLoading} 
                        typeButton="button-primary" 
                    />
                    <h5 className="sign-in-account">
                        Don’t have an account?
                        <Link to="/sign-up-page" className="sign-up-link" style={{ textDecoration: 'none' }}> Sign Up</Link>
                    </h5>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
