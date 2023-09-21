import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom'; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { authActions } from '_store';

export { Login };

function Login() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const authError = useSelector(x => x.auth.error);

    const location = useLocation();
    const { username: initUsername, password: initPassword } = location.state || {};

    useEffect(() => { 
        if (authUser) history.navigate('/'); 
    }, [authUser, history]);
    const navigateToSignUp = () => {
        history.navigate('/signUp');
    }
     
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook 
    const { register, handleSubmit, formState, setValue } = useForm(formOptions);
    useEffect(() => {
        if(initUsername) setValue('username', initUsername);
        if(initPassword) setValue('password', initPassword);
    }, [initUsername, initPassword, setValue]);

    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password }) {   
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5 flax">
            <div className="alert alert-info">
                Username: {initUsername || 'admin'}<br />
                Password: {initPassword || '123456'}
            </div>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} value={'admin'} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} value={123456} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-4"> 
                                    <button type="submit" disabled={isSubmitting} class="btn btn-outline-primary">
                                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Login
                                    </button> 
                                </div>
                                <div class="col-4">
                                    <button type="button"  onClick={navigateToSignUp} class="btn btn-outline-secondary"> Sign Up</button>
                                </div>
                            </div> 
                        </div> 
                        {authError &&
                            <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}
