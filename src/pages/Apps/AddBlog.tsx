import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconUser from '../../components/Icon/IconUser';
import IconCamera from '../../components/Icon/IconCamera';
import { AppDispatch } from '../../store';
import { create, fetchAllBlogs } from '../../store/blogSlice';
import CustomBlogEditor from '../../components/CustomBlogEditor';

interface Blog {
    blogTitle: string;
    blogDescription: string;
    blogImage: string;
    blogBanner: string;
}

const AddBlog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<Blog>({
        blogTitle: '',
        blogDescription: '',
        blogImage: '',
        blogBanner: '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
    useEffect(() => {
        dispatch(setPageTitle('Register Boxed'));
    });
    const navigate = useNavigate();

    const handleImageUpload = (type: 'blogImage' | 'blogBanner', value: File | null) => {
        if (type === 'blogImage') {
            setSelectedImage(value);
        } else {
            setSelectedBanner(value);
        }
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('object');
        try {
            const fd = new FormData();
            fd.append('blogTitle', form.blogTitle);
            fd.append('blogDescription', form.blogDescription);
             if (selectedImage) {
                fd.append('blogImage', selectedImage);
            } else {
                fd.append('blogImage', form.blogImage);
            }
            if (selectedBanner) {
                fd.append('blogBanner', selectedBanner);
            } else {
                fd.append('blogBanner', form.blogBanner);
            }
            await dispatch(create(fd));
            await dispatch(fetchAllBlogs());
            navigate('/apps/Manage-blog');
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
                            <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Create Blog</h1>
                        </div>
                        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                            <div>
                                <label htmlFor="Name">Blog Title</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="titile"
                                        type="text"
                                        placeholder="Enter Blog Title"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => setForm({ ...form, blogTitle: e.target.value })}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser fill={true} />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="Email">Blog Description</label>
                                <div className="relative text-white-dark">
                                    <CustomBlogEditor value={form.blogDescription} onChange={(value) => setForm({ ...form, blogDescription: value })} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="image">Blog Image</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="blogImage"
                                        type="file"
                                        placeholder="Enter blogImage"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => handleImageUpload('blogImage', e.target.files?.[0] || null)}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconCamera fill={true} />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="banner">Blog Banner</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="profile"
                                        type="file"
                                        placeholder="Enter profile"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => handleImageUpload('blogBanner', e.target.files?.[0] || null)}
                                        required
                                    />
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

export default AddBlog;
