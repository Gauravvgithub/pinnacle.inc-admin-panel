import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { DataTable } from 'mantine-datatable';
import { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import IconX from '../../components/Icon/IconX';
import IconCamera from '../../components/Icon/IconCamera';
import { Blog, deleteBlog, fetchAllBlogs, updateBlog } from '../../store/blogSlice';
import ReactQuill, { QuillOptions } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomBlogEditor from '../../components/CustomBlogEditor';

const Blogs = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allBlogs } = useSelector((state: IRootState) => state.blog);
    console.log(allBlogs);

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState<Blog[]>([]);
    const [initialRecords, setInitialRecords] = useState<Blog[]>([]);
    const [modal, setModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<Blog>({
        _id: '',
        blogTitle: '',
        blogDescription: '',
        createdBy: {
            fullName: '',
            _id: '',
        },
        slugName: '',
        blogImage: '',
        blogBanner: '',
        blogSeoDetails: {
        _id: '',
    }
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedBanner, setSelectedBanner] = useState<File | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Blog List'));
        dispatch(fetchAllBlogs());
    }, [dispatch]);

    useEffect(() => {
        if (allBlogs?.length) {
            setInitialRecords(allBlogs);
        }
    }, [allBlogs]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    const deleteRow = async (id:any) => {
        if (window.confirm('Are you sure want to delete this user?')) {
            await dispatch(deleteBlog(id))
            await dispatch(fetchAllBlogs())
        }
    };

    const handleImageUpload = (type: 'blogImage' | 'blogBanner', value: File | null) => {
        if (type === 'blogImage') {
            setSelectedImage(value);
        } else {
            setSelectedBanner(value);
        }
    };

    const handleUpdate = async () => {
        try {
            const fd = new FormData();
            fd.append('_id', selectedUser._id);
            fd.append('blogTitle', selectedUser.blogTitle);
            fd.append('blogDescription', selectedUser.blogDescription);
            if (selectedImage) {
                fd.append('blogImage', selectedImage);
            } else {
                fd.append('blogImage', selectedUser.blogImage);
            }
            if (selectedBanner) {
                fd.append('blogBanner', selectedBanner);
            } else {
                fd.append('blogBanner', selectedUser.blogBanner);
            }
            // You may need to update the dispatch to use fd if your update action expects FormData
            await dispatch(updateBlog(fd)).unwrap();
            await dispatch(fetchAllBlogs());
            setModal(false);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="datatables pagination-padding">
                    <h5 className="font-bold text-lg dark:text-white-light mb-5 ms-5">All Blogs</h5>
                    <DataTable
                        striped
                        className="whitespace-nowrap table-striped table-hover table-bordered table-compact"
                        records={records}
                        columns={[
                            {
                                accessor: 'blogTitle',
                                render: ({ blogTitle }) => <div>{blogTitle.slice(0, 20)}...</div>,
                            },
                            { accessor: 'blogDescription', render: ({ blogDescription }) => <div>{blogDescription.slice(0, 30)}...</div> },
                            {
                                accessor: 'blogImage',
                                render: ({ blogImage }) => (
                                    <div>
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${blogImage}`} className="h-auto w-10" alt="" />
                                    </div>
                                ),
                            },
                            {
                                accessor: 'blogBanner',
                                render: ({ blogBanner }) => (
                                    <div>
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${blogBanner}`} className="h-auto w-10" alt="" />
                                    </div>
                                ),
                            },
                            {
                                accessor: 'createdBy',
                                render: ({ createdBy }) => {
                                    return (
                                        <div>{createdBy.fullName}</div>
                                    );
                                },
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                textAlignment: 'center',
                                render: ({ _id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <button
                                            className="flex hover:text-info"
                                            onClick={() => {
                                                setSelectedUser(allBlogs.find((u:any) => u._id === _id) || selectedUser);
                                                setModal(true);
                                            }}
                                        >
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </button>
                                        <button className="flex hover:text-danger" onClick={() => deleteRow(_id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>

            {/* Modal */}
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-60" />
                    </TransitionChild>

                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 py-1 px-4 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between p-5 text-lg font-semibold dark:text-white">
                                        <h5>Edit User</h5>
                                        <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <label htmlFor="Name">Blog Title</label>
                                            <div className="relative mb-4">
                                                <textarea
                                                    // type="text"
                                                    placeholder="Blog Title"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedUser.blogTitle}
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, blogTitle: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="Name">Blog Description</label>
                                            <div className="relative mb-4">
                                                {/* Only use ReactQuill for blogDescription to preserve formatting */}
                                                <CustomBlogEditor value={selectedUser?.blogDescription} onChange={(value) => setSelectedUser({ ...selectedUser, blogDescription: value })} />
                                            </div>
                                            <label htmlFor="Name">Blog Image</label>
                                            <div className="relative mb-4">
                                                <IconCamera className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <input
                                                    type="file"
                                                    placeholder="Blog Image"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    onChange={(e) => handleImageUpload('blogImage', e.target.files?.[0] || null)}
                                                />
                                            </div>
                                            <label htmlFor="Name">Blog Banner</label>
                                            <div className="relative mb-4">
                                                <IconCamera className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <input type="file" className="form-input ltr:pl-10 rtl:pr-10" onChange={(e) => handleImageUpload('blogBanner', e.target.files?.[0] || null)} />
                                            </div>
                                            <button type="button" className="btn btn-primary w-full" onClick={handleUpdate}>
                                                Update
                                            </button>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Blogs;
