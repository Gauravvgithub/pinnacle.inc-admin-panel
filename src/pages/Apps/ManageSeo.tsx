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
import 'react-quill/dist/quill.snow.css';
import CustomBlogEditor from '../../components/CustomBlogEditor';
import { deleteSeo, fetchAllSeo, Seo, updateSeo } from '../../store/seoSlice';



const ManageSeo = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allSeos } = useSelector((state: IRootState) => state.seo);
    console.log(allSeos);

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState<Seo[]>([]);
    const [initialRecords, setInitialRecords] = useState<Seo[]>([]);
    const [modal, setModal] = useState(false);

    const [selectedSeo, setSelectedSeo] = useState<Seo>({
        _id: '',
        page_title: '',
        metaTitle: '',
        metaDes: '',
        metaKeywords: '',
        cannicalUrl: '',
        ogTitle: '',
        ogDes: '',
        OgImageUrl: '',
        OgType: '',
        OgImageType: '',
        OgImageWidth: '',
        OgImageHeight: '',
        hreflang: '',
        mobileFriendly: '',
        xmlSitemap: '',
        ampUrl: '',
        copyright: false,
        contentAuthor: 0,
        googleSiteVerification: false,
        schemaMaprkup: '',
        cspHeader: '',
        enableHTTP3: false,
        enableBrotli: false,
        securityTxt: '',
        robotsMeta: {
            index: false,
            follow: false,
        },
        createdBy: {
        _id: '',
        fullName: '',
    }
    });

    useEffect(() => {
        dispatch(setPageTitle('Blog List'));
        dispatch(fetchAllSeo());
    }, [dispatch]);

    useEffect(() => {
        if (allSeos?.length) {
            setInitialRecords(allSeos);
        }
    }, [allSeos]);

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
            await dispatch(deleteSeo(id))
            await dispatch(fetchAllSeo())
        }
    };


    const handleUpdate = async () => {
        try {
            // You may need to update the dispatch to use fd if your update action expects FormData
            await dispatch(updateSeo({id:selectedSeo._id ,data:selectedSeo})).unwrap();
            await dispatch(fetchAllSeo());
            setModal(false);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="datatables pagination-padding">
                    <h5 className="font-bold text-lg dark:text-white-light mb-5 ms-5">All Seo</h5>
                    <DataTable
                        striped
                        className="whitespace-nowrap table-striped table-hover table-bordered table-compact"
                        records={records}
                        columns={[
                            {
                                accessor: 'page title',
                                render: ({ page_title }) => <div>{page_title.slice(0,30)}...</div>,
                            },
                            {
                                accessor: 'meta Title',
                                render: ({ metaTitle }) => <div>{metaTitle.slice(0,30)}...</div>,
                            },
                            {
                                accessor: 'meta Description',
                                render: ({ metaDes }) => <div>{metaDes.slice(0,30)}...</div>,
                            },
                            { accessor: 'createBy', render: ({ createdBy }) => <div>{createdBy.fullName}</div> },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                textAlignment: 'center',
                                render: ({ _id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <button
                                            className="flex hover:text-info"
                                            onClick={() => {
                                                setSelectedSeo(allSeos.find((u) => u._id === _id) || selectedSeo);
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
                                            <label htmlFor="page_title">Page Title</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Page Title"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.page_title}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, page_title: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="metaTitle">Meta Title</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Meta Title"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.metaTitle}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, metaTitle: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="metaDes">Meta Description</label>
                                            <div className="relative mb-4">
                                                <textarea
                                                    placeholder="Meta Description"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.metaDes}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, metaDes: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="metaKeywords">Meta Keywords</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Meta Keywords"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.metaKeywords}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, metaKeywords: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="cannicalUrl">Canonical URL</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Canonical URL"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.cannicalUrl}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, cannicalUrl: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="ogTitle">OG Title</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Title"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.ogTitle}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, ogTitle: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="ogDes">OG Description</label>
                                            <div className="relative mb-4">
                                                <textarea
                                                    placeholder="OG Description"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.ogDes}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, ogDes: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="OgImageUrl">OG Image URL</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Image URL"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.OgImageUrl}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, OgImageUrl: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="OgType">OG Type</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Type"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.OgType}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, OgType: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="OgImageType">OG Image Type</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Image Type"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.OgImageType}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, OgImageType: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="OgImageWidth">OG Image Width</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Image Width"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.OgImageWidth}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, OgImageWidth: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="OgImageHeight">OG Image Height</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="OG Image Height"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.OgImageHeight}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, OgImageHeight: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="hreflang">Hreflang</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Hreflang"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.hreflang}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, hreflang: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="mobileFriendly">Mobile Friendly</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Mobile Friendly"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.mobileFriendly}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, mobileFriendly: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="xmlSitemap">XML Sitemap</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="XML Sitemap"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.xmlSitemap}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, xmlSitemap: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="ampUrl">AMP URL</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="AMP URL"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.ampUrl}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, ampUrl: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="copyright">Copyright</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSeo.copyright}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, copyright: e.target.checked })}
                                                />
                                            </div>
                                            <label htmlFor="contentAuthor">Content Author</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="number"
                                                    placeholder="Content Author"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.contentAuthor}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, contentAuthor: Number(e.target.value) })}
                                                />
                                            </div>
                                            <label htmlFor="googleSiteVerification">Google Site Verification</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSeo.googleSiteVerification}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, googleSiteVerification: e.target.checked })}
                                                />
                                            </div>
                                            <label htmlFor="schemaMaprkup">Schema Markup</label>
                                            <div className="relative mb-4">
                                                <textarea
                                                    placeholder="Schema Markup"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.schemaMaprkup}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, schemaMaprkup: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="cspHeader">CSP Header</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="CSP Header"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.cspHeader}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, cspHeader: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="enableHTTP3">Enable HTTP3</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSeo.enableHTTP3}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, enableHTTP3: e.target.checked })}
                                                />
                                            </div>
                                            <label htmlFor="enableBrotli">Enable Brotli</label>
                                            <div className="relative mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSeo.enableBrotli}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, enableBrotli: e.target.checked })}
                                                />
                                            </div>
                                            <label htmlFor="securityTxt">Security Txt</label>
                                            <div className="relative mb-4">
                                                <textarea
                                                    placeholder="Security Txt"
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                    value={selectedSeo.securityTxt}
                                                    onChange={e => setSelectedSeo({ ...selectedSeo, securityTxt: e.target.value })}
                                                />
                                            </div>
                                            <label htmlFor="robotsMeta">Robots Meta</label>
                                            <div className="relative mb-4 flex gap-4 items-center">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSeo.robotsMeta.index}
                                                        onChange={e => setSelectedSeo({ ...selectedSeo, robotsMeta: { ...selectedSeo.robotsMeta, index: e.target.checked } })}
                                                    /> Index
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSeo.robotsMeta.follow}
                                                        onChange={e => setSelectedSeo({ ...selectedSeo, robotsMeta: { ...selectedSeo.robotsMeta, follow: e.target.checked } })}
                                                    /> Follow
                                                </label>
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

export default ManageSeo;
