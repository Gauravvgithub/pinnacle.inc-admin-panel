import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
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
    slug?: string; // Optional slug
}

const AddBlog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<Blog>({
        blogTitle: '',
        blogDescription: '',
        blogImage: '',
        blogBanner: '',
        slug: '',
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedBanner, setSelectedBanner] = useState<File | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Create Blog'));
    }, [dispatch]);

    const handleImageUpload = (type: 'blogImage' | 'blogBanner', value: File | null) => {
        if (type === 'blogImage') {
            setSelectedImage(value);
        } else {
            setSelectedBanner(value);
        }
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const fd = new FormData();
            fd.append('blogTitle', form.blogTitle);
            fd.append('blogDescription', form.blogDescription);

            // Optional: append custom slug if provided
            if (form.slug?.trim()) {
                fd.append('slug', form.slug.trim());
            }

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
            console.error('Create failed:', error);
        }
    };

    return (
        <div className="relative flex h-70 items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
            <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                    <div className="mx-auto w-full max-w-[440px]">
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                                Create Blog
                            </h1>
                        </div>
                        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                            {/* Blog Title */}
                            <div>
                                <label htmlFor="title">Blog Title</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="title"
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

                            {/* Custom Slug (Optional) */}
                            <div>
                                <label htmlFor="slug">Custom Slug (Optional)</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="slug"
                                        type="text"
                                        placeholder="Enter custom slug (optional)"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        value={form.slug}
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconUser fill={true} />
                                    </span>
                                </div>
                            </div>

                            {/* Blog Description */}
                            <div>
                                <label htmlFor="description">Blog Description</label>
                                <div className="relative text-white-dark">
                                    <CustomBlogEditor
                                        value={form.blogDescription}
                                        onChange={(value) => setForm({ ...form, blogDescription: value })}
                                    />
                                </div>
                            </div>

                            {/* Blog Image */}
                            <div>
                                <label htmlFor="blogImage">Blog Image</label>
                                <label htmlFor="blogImage">(800x600)<sup style={{color:"red"}}>*</sup></label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="blogImage"
                                        type="file"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => handleImageUpload('blogImage', e.target.files?.[0] || null)}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconCamera fill={true} />
                                    </span>
                                </div>
                            </div>

                            {/* Blog Banner */}
                            <div>
                                <label htmlFor="blogBanner">Blog Banner</label>
                                <label htmlFor="blogImage">(1200x628) <sup style={{color:"red"}}>*</sup> </label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="blogBanner"
                                        type="file"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        onChange={(e) => handleImageUpload('blogBanner', e.target.files?.[0] || null)}
                                        required
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconCamera fill={true} />
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
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
