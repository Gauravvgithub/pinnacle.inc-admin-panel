import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconCamera from '../../components/Icon/IconCamera';
import { AppDispatch } from '../../store';
import { create, fetchAllUser } from '../../store/userSlice';

interface User{
    fullName: string,
    email: string,
    password: string,
    profile: string,
}

const RegisterBoxed = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<User>({
        fullName: '',
        email: '',
        profile: '',
        password: '',
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    useEffect(() => {
        dispatch(setPageTitle('Register Boxed'));
    });
    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const fd = new FormData();
            fd.append("fullName", form.fullName);
            fd.append("email", form.email);
            fd.append("password", form.password);
            if (selectedFile) {
                fd.append("profile", selectedFile);
            } else {
                fd.append("profile", form.profile);
            }
            await dispatch(create(fd))
            await dispatch(fetchAllUser())
            navigate('/apps/Manage-user');
        } catch (error) {
            console.error('create failed:', error);
        }
    };

    return (
            <div className="relative flex h-70 items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
            <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Create User</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to create user</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Name">Full Name</label>
                                    <div className="relative text-white-dark">
                                        <input id="Name" type="text" placeholder="Enter Full Name" className="form-input ps-10 placeholder:text-white-dark" onChange={(e)=>setForm({...form, fullName:e.target.value})} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" onChange={(e)=>setForm({...form, email: e.target.value})} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" onChange={(e)=>setForm({...form, password: e.target.value})} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Profile</label>
                                    <div className="relative text-white-dark">
                                        <input id="profile" type="file" placeholder="Enter profile" className="form-input ps-10 placeholder:text-white-dark" onChange={(e)=>setSelectedFile(e.target.files?.[0] || null)} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconCamera fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>          
            </div>
    );
};

export default RegisterBoxed;
