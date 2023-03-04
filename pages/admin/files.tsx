import React, { ChangeEvent, ReactElement, useRef } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { files } from "../../utilities/type";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import rfdc from "rfdc";
import ClipLoader from "react-spinners/ClipLoader";
import { dailyMotionAuth } from "../../utilities/db";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";

interface PresignedURL {
    progress_url: string;
    upload_url: string;
}

const cloneDeep = rfdc();

const Files: NextPageWithLayout = () => {

    const [files, setFiles] = React.useState<files[]>([]);
    const [uploadedFiles, setUploadedFiles] = React.useState<FileList | null>();
    const [newFileName, setNewFileName] = React.useState("");
    const btnClose = useRef<HTMLLabelElement | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [pageTotal, setPageTotal] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(1);
    const [searchName, setSearchName] = React.useState('');
    const router = useRouter();

    const getTotal = React.useCallback(() => {
        const options = {
            url: `/api/total/files`,
            params: {
                name: searchName,
                pageIndex: pageIndex.toString(),
            }
        };

        CapacitorHttp.get(options).then(result => {
            if (result.data && result.data.length > 0) {
                setPageTotal(Math.ceil(result.data[0].total / 10));
            }
        })
    }, [searchName, pageIndex])


    const refetchFiles = React.useCallback(() => {
        const options = {
            url: `/api/file/list`,
            params: {
                name: searchName.toString(),
                pageIndex: pageIndex.toString(),
            },
        };
        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setFiles(response.data);

        }).catch(err => {
            console.log(err);
        });
    }, [searchName, pageIndex]);

    const pushToDailyMotion = (selectedfiles: FileList, token: any) => {
        setLoading(true);
        const options = {
            url: 'https://api.dailymotion.com/file/upload',
            headers: { 'Authorization': `Bearer ${token.access_token}` },

        };

        CapacitorHttp.get(options).then((response: HttpResponse) => {
            const urls: PresignedURL = response.data;
            Array.prototype.forEach.call(selectedfiles, function (file: File, index: number) {
                const options = {
                    url: urls.upload_url,
                    headers: {
                        'Authorization': `Bearer ${token.access_token}`,
                        "Content-Type": 'multipart/form-data'
                    },
                    data: {
                        'file': file,
                    }

                };
                CapacitorHttp.post(options).then((response: HttpResponse) => {

                    const options = {
                        url: `https://api.dailymotion.com/user/SanThureinoo/videos`,
                        headers: {
                            'Authorization': `Bearer ${token.access_token}`,
                            "Content-Type": 'multipart/form-data'
                        },
                        data: {
                            'url': response.data.url
                        }

                    };
                    CapacitorHttp.post(options).then((response: HttpResponse) => {
                        if (response.status > 300) {
                            toast.error(response.data.error.message);
                            setLoading(false);
                            refetchFiles();
                            getTotal();
                            if (btnClose.current !== null) {
                                btnClose.current.click();
                            }
                            return;
                        }
                        const options = {
                            url: `https://api.dailymotion.com/video/${response.data.id}`,
                            headers: {
                                'Authorization': `Bearer ${token.access_token}`,
                                "Content-Type": 'multipart/form-data'
                            },
                            data: {
                                'published': true,
                                'title': file.name,
                                'private': true,
                                'channel': 'school',
                                'tags': 'react, nextjs, test_KP',
                                'is_created_for_kids': false,
                            }

                        };
                        CapacitorHttp.post(options).then((response: HttpResponse) => {
                            const currentFile: files = {
                                name: newFileName ? newFileName + (selectedfiles.length > 1 ? `-${index}` : '') : file.name.split('.')[0],
                                unique_name: response.data.id,
                                status: 0,
                            };

                            const options = {
                                url: `/api/file/create`,
                                data: currentFile,
                            };

                            CapacitorHttp.post(options).then((response: HttpResponse) => {
                                refetchFiles();
                                getTotal();
                                if (btnClose.current !== null) {
                                    btnClose.current.click();
                                }
                                setLoading(false);
                            }).catch(err => {
                                toast(err);
                            })

                        }).catch(err => {
                            toast(err);
                        });
                    }).catch(err => {
                        toast(err);
                    });
                }).catch(err => {
                    toast(err);
                });
            });
        }).catch(err => {
            toast(err);
        });
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>, index: number, attribute: string, value: any) => {
        const clonedFiles = cloneDeep(files);

        clonedFiles[index][attribute] = value;

        const currentFile: files = clonedFiles[index];

        delete currentFile.created_at;
        delete currentFile.updated_at;

        const options = {
            url: `/api/file/update`,
            data: currentFile,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setFiles(clonedFiles);
        }).catch(err => {
        })

    }

    const onDelete = (index: number) => {
        const clonedFiles = cloneDeep(files);
        const currentFile: files = clonedFiles[index];

        const options = {
            url: `/api/file/delete`,
            data: currentFile,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            delete clonedFiles[index];
            setFiles(clonedFiles);
        }).catch(err => {
        })

    }

    const onFileSelect = () => {

        if (uploadedFiles) {
            // if (!localStorage.getItem('daily_motion_token')) {
            //     const options = {
            //         url: '/api/dailymotion_auth',
            //     };
            //     CapacitorHttp.get(options).then((response: HttpResponse) => {
            //         localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
            //         pushToDailyMotion(uploadedFiles, response.data);
            //     }).catch(err => {
            //         localStorage.removeItem('daily_motion_token');
            //     });
            // } else {
            //     const token = JSON.parse(localStorage.getItem('daily_motion_token') || '');
            //     const options = {
            //         url: '/api/dailymotion_auth',
            //         params: token
            //     };
            //     CapacitorHttp.get(options).then((response: HttpResponse) => {
            //         localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
            //         pushToDailyMotion(uploadedFiles, response.data);
            //     }).catch(err => {
            //         localStorage.removeItem('daily_motion_token');
            //     });
            // }

            const options = {
                url: '/api/dailymotion_auth',
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
                pushToDailyMotion(uploadedFiles, response.data);
            }).catch(err => {
                localStorage.removeItem('daily_motion_token');
            });

        }
    }

    React.useEffect(() => {
        refetchFiles();
        getTotal();
    }, [pageIndex])


    return <React.Fragment>
        <div className="overflow-x-auto">
            <ToastContainer />
            <div>
                <input type="text" placeholder="Search by Name" value={searchName} onChange={val => setSearchName(val.currentTarget.value)} className="input input-bordered w-full max-w-xs mr-2" />
                <button onClick={() => {
                    refetchFiles();
                    getTotal();
                }} className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
                <label htmlFor="file-upload" className="cursor-pointer btn btn-primary float-right"><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create File</span></label>
            </div>

            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Approve/Suspend</th>
                        {/* <th>Options</th> */}
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) =>
                        <tr key={`row-${index}`}>
                            <td>
                                {file.id}
                            </td>
                            <td>
                                {file.name}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" onChange={(event) => onChange(event, index, 'status', file.status === 1 ? 0 : 1)} checked={file.status === 1 ? true : false} />
                            </td>
                            <td>
                                {/* <label htmlFor={`my-modal-${index}`} className="cursor-pointer">Delete</label> */}

                                {/* Put this part before </body> tag */}
                                <input type="checkbox" id={`my-modal-${index}`} className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box">
                                        <p>Are you sure you want to delete?</p>
                                        <div className="modal-action">
                                            <label onClick={event => { onDelete(index) }} htmlFor={`my-modal-${index}`} className="btn btn-primary">Accept</label>
                                            <label htmlFor={`my-modal-${index}`} className="btn">Close</label>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="float-right mt-4">
                <ReactPaginate
                    containerClassName={"flex flex-row items-center btn-group gap-x-2"}
                    pageClassName={"btn"}
                    activeClassName={"bg-gray-400 hover:bg-gray-300 border-none"}
                    previousClassName={"btn"}
                    nextClassName={"btn"}
                    breakClassName={"btn"}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={(selected) => {
                        setPageIndex(selected.selected + 1);
                    }}
                    forcePage={pageIndex - 1}
                    pageCount={pageTotal}
                    previousLabel="<"
                // renderOnZeroPageCount={<></>}
                />
            </div>
            {/* Put this part before </body> tag */}
            <input type="checkbox" id="file-upload" className="modal-toggle" />
            <label htmlFor="file-upload" className="modal modal-bottom sm:modal-middle cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <h3 className="font-bold text-lg text-center pb-6">Select File!</h3>
                    <div className="flex flex-col gap-y-2">
                        <input type="file" onChange={(event) => { setUploadedFiles(event.currentTarget.files); }} className="file-input file-input-bordered w-full" />
                        <div className="form-control w-full">
                            <label className="input-group">
                                <span className="w-1/4">File Name</span>
                                <input type="text" placeholder="Enter file name" value={newFileName} onChange={(event) => { setNewFileName(event.currentTarget.value) }} className="input w-3/4 input-bordered" />
                            </label>
                        </div>
                    </div>

                    <p className="py-4">Select videos first, then click the upload button below. This dialog will be closed once it is done uploading. Thank you!</p>
                    <div className="modal-action">
                        <label htmlFor="file-upload" className={`btn ${loading ? 'hidden' : ''}`} ref={btnClose}>Close</label>
                        <button className="btn" disabled={loading} onClick={() => onFileSelect()}>
                            {<ClipLoader
                                color={'white'}
                                loading={loading}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />}Upload</button>
                    </div>
                </label>
            </label>
            {/* <div className="modal modal-bottom sm:modal-middle">

            </div> */}


        </div>
    </React.Fragment>
}

Files.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Files;