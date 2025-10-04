import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { DataTable } from 'mantine-datatable';
import { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconEdit from '../../../components/Icon/IconEdit';
import IconX from '../../../components/Icon/IconX';
import IconUser from '../../../components/Icon/IconUser';
import IconAt from '../../../components/Icon/IconAt';
import IconLock from '../../../components/Icon/IconLock';
import IconCamera from '../../../components/Icon/IconCamera';
import IconAward from '../../../components/Icon/IconAward';
import { fetchAllUser } from '../../../store/userSlice';
import { update } from '../../../store/userSlice';
import type { User } from '../../../store/userSlice';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allUsers } = useSelector((state: IRootState) => state.user);

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState<User[]>([]);
    const [initialRecords, setInitialRecords] = useState<User[]>([]);
    const [modal, setModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User & { password?: string }>({
        _id: '',
        fullName: '',
        email: '',
        profile: '',
        password: '',
        status: 'active',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('User List'));
        dispatch(fetchAllUser());
    }, [dispatch]);

    useEffect(() => {
        if (allUsers?.length) {
            setInitialRecords(allUsers);
        }
    }, [allUsers]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    const deleteRow = (id: string) => {
        if (window.confirm('Are you sure want to delete this user?')) {
            console.log('Deleting user ID:', id);
            // TODO: Dispatch delete logic here
        }
    };

    const handleUpdate = async () => {
        try {
            const fd = new FormData();
            fd.append("_id", selectedUser._id);
            fd.append("fullName", selectedUser.fullName);
            fd.append("email", selectedUser.email);
            fd.append("password", selectedUser.password);
            if (selectedFile) {
                fd.append("profile", selectedFile);
            } else {
                fd.append("profile", selectedUser.profile);
            }
            // You may need to update the dispatch to use fd if your update action expects FormData
            await dispatch(update(fd)).unwrap();
            await dispatch(fetchAllUser());
            setModal(false);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="datatables pagination-padding">
                    <h5 className="font-bold text-lg dark:text-white-light mb-5 ms-5">All Users</h5>
                    <DataTable
                        striped
                        className="whitespace-nowrap table-striped table-hover table-bordered table-compact"
                        records={records}
                        columns={[
                            {
                                accessor: 'fullName',
                                render: ({ fullName, profile }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                            <img
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={`${import.meta.env.VITE_API_BASE_URL}${profile}`}
                                                alt="profile"
                                            />
                                        </div>
                                        <div>{fullName}</div>
                                    </div>
                                ),
                            },
                            { accessor: 'email' },
                            {
                                accessor: 'status',
                                render: ({ status }) => (
                                    <span className={`badge badge-outline-${status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'danger'}`}>
                                        {status}
                                    </span>
                                ),
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
                                                const userToEdit = allUsers.find((u) => u._id === _id);
                                                if (userToEdit) {
                                                    setSelectedUser({ ...userToEdit, password: '' });
                                                    setModal(true);
                                                }
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
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
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
                                <DialogPanel className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 py-1 px-4 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between p-5 text-lg font-semibold dark:text-white">
                                        <h5>Edit User</h5>
                                        <button type="button" onClick={() => setModal(false)} className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="relative mb-4">
                                                <IconUser className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedUser.fullName}
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <IconAt className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 dark:text-white-dark" />
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedUser.email}
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <IconLock className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedUser.password}
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <IconCamera className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <input
                                                    type="file"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <IconAward className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 dark:text-white-dark" />
                                                <select
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedUser.status}
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as User['status'] })}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="blocked">Blocked</option>
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-primary w-full"
                                                onClick={handleUpdate}
                                            >
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

export default List;
