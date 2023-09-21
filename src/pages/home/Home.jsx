import { useEffect, useState } from 'react'; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history, fetchWrapper } from '_helpers'; 
 
import { userActions } from '_store';

export { Home };

function Home() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector(x => x.auth);
    const [showPopup, setShowPopup] = useState(false);


    // Form validation schema
    const validationSchema = Yup.object().shape({
        Name: Yup.string().required('Name is required'),
        Email: Yup.string().required('Email is required').email('Email is invalid'),
        Message: Yup.string().required('Message is required'),
        Phone_Number: Yup.number().required('Phone Number is required').typeError('Phone Number must be a number'),
        Date: Yup.date().nullable().default(undefined)
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState, reset} = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const onSubmit = async (data) => { 
        const res = await fetchWrapper.post(`${process.env.REACT_APP_API_URL}/Contacts/contact`, data)
        if(res?.message == "Contact created"){
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                reset(); 
            }, 5000);
        } else alert(res?.message) 
    };

    return (
        <div>
            <h1>Hi {authUser?.firstName}!</h1>
            <p>You're logged in with React 18 + Redux & JWT!!</p>
            <div className="col-md-6 offset-md-3 mt-5">
                <div className="card">
                    <h4 className="card-header">Contact Us</h4>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Name</label>
                                <input name="Name" type="text" {...register('Name')} className={`form-control ${errors.Name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.Name?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input name="Email" type="text" {...register('Email')} className={`form-control ${errors.Email ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.Email?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea name="Message" {...register('Message')} className={`form-control ${errors.Message ? 'is-invalid' : ''}`}></textarea>
                                <div className="invalid-feedback">{errors.Message?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input name="Phone_Number" type="text" {...register('Phone_Number')} className={`form-control ${errors.PhoneNumber ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.Phone_Number?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input name="Date" type="date" {...register('Date')} className={`form-control ${errors.Date ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.Date?.message}</div>
                            </div>
                            <center>
                                <button type="submit" class="btn btn-outline-info">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Submit
                                </button> 
                            </center>
                        </form>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div style={{
                    position: 'fixed', 
                    justifyItems:'center',
                    top: '50%', 
                    left: '50%', 
                    padding:'5rem',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    backgroundColor: 'rgba(0, 120, 0, 0.4)', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <h1>Thank you for contacting us! 🎉</h1>
                </div>
            )}
        </div>
    );
}
