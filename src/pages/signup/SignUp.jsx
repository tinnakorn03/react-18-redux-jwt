import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history, fetchWrapper } from '_helpers'; 
 
export default function SignUp() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user); 

    useEffect(() => { 
        if (authUser) history.navigate('/'); 
    }, []);

    // Form validation schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        username: Yup.string().required('Username is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        role: Yup.string().required('Role is required'),
        email: Yup.string().required('Email is required').email('Email is invalid'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const onSubmit = async (data) => {  
        const res = await fetchWrapper.post(`${process.env.REACT_APP_API_URL}/Users/register`, data)
        if(res?.message == "User created")
            history.navigate('/login', { state: { username: data?.username, password: data?.password } });
        else 
            alert(res?.message) 
    }


    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Sign-Up</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="row"> 
                            <div class="col-12 col-md-8">
                                <label>Username</label>
                                <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.username?.message}</div>
                            </div>
                            <div className="col-6 col-md-4">
                                <label>Role</label>
                                <select name="role" {...register('role')} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
                                    <option value="User" selected>User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="invalid-feedback">{errors.role?.message}</div>
                            </div>
                        </div>  
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div class="row">
                            <div class="col-2">
                                <label>Title</label>
                                <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                            <div class="col-4 col-md-5"> 
                                <label>First Name</label>
                                <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.firstName?.message}</div>
                            </div>
                            <div class="col-4 col-md-5"> 
                                <label>Last Name</label>
                                <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.lastName?.message}</div>
                            </div>
                        </div> 
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div> 
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                        </div> 
                        <center>
                            <button type='submit' disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Sign Up
                            </button>
                        </center>
                    </form>
                </div>
            </div>
        </div> 
    )
}
