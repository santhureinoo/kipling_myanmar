import React, { ReactElement } from "react";
import excuteQuery from "../../utilities/db";
import { users } from "../../utilities/type";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import rfdc from "rfdc";
import ReactPaginate from "react-paginate";

// export async function getStaticProps(context: any) {
//     let result;
//     try {
//         result = await excuteQuery({
//             query: 'SELECT * FROM users',
//         });

//         console.log(result);

//     } catch (error) {
//         console.log(error);
//     }
//     return {
//         props: {
//             result: JSON.stringify(result)
//         }, // will be passed to the page component as props
//     }
// }

const cloneDeep = rfdc();

const Users: NextPageWithLayout = ({ result }: any) => {
    const [users, setUsers] = React.useState<users[]>([]);
    const [pageTotal, setPageTotal] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [searchName, setSearchName] = React.useState('');
    const router = useRouter();

    const getTotal = React.useCallback(() => {
        const options = {
            url: `/api/total/users`,
            params: {
                name: searchName
            }
        };

        CapacitorHttp.get(options).then(result => {
            if (result.data && result.data.length > 0) {
                setPageTotal(Math.ceil(result.data[0].total / 10));
            }
        })
    }, [searchName])

    const searchUsers = React.useCallback(() => {
        const options = {
            url: `/api/user/list`,
            params: {
                name: searchName.toString(),
                pageIndex: pageIndex.toString(),
            },
        };

        CapacitorHttp.get(options).then((response: HttpResponse) => {
            setLoading(false);
            setUsers(response.data);
        }).catch(err => {
            setLoading(false);
            setUsers([]);
        })
    }, [searchName, pageIndex]);

    React.useEffect(() => {
        searchUsers();
        getTotal();
    }, [pageIndex]);

    const onChange = (index: number, attribute: string, value: any) => {
        setLoading(true);
        const cloneUsers = cloneDeep(users);
        cloneUsers[index][attribute] = value;
        const options = {
            url: '/api/user/update',
            data: cloneUsers[index]
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setLoading(false);
            setUsers(cloneUsers);
        }).catch(err => {
            setLoading(false);
        })
    }

    const onDelete = (index: number) => {
        setLoading(true);
        const cloneUsers = cloneDeep(users);
        const options = {
            url: '/api/user/delete',
            data: cloneUsers[index]
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setLoading(false);
            delete cloneUsers[index];
            setUsers(cloneUsers);
            // setUsers(cloneUsers);
            // console.log(response.data);
        }).catch(err => {
            setLoading(false);
        })
    }



    return <React.Fragment>
        <div className="overflow-x-auto">
            <div>
                <input type="text" placeholder="Search by Name" value={searchName} onChange={val => setSearchName(val.currentTarget.value)} className="input input-bordered w-full max-w-xs mr-2" />
                <button onClick={() => {
                    if (pageIndex > 1) {
                        setPageIndex(1);
                    } else {
                        searchUsers();
                        getTotal();
                    }

                }} className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
                <button onClick={() => {
                    router.push('user/detail');
                }} className="btn btn-primary float-right">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create User</span>
                </button>
            </div>

            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Approve/Suspend</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return <tr key={`userRow-${user.id}`}>
                            <td>
                                {user.id}
                            </td>
                            <td>
                                {user.name}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" onChange={(event) => {
                                    onChange(index, 'status', event.currentTarget.checked ? 1 : 0)
                                }} checked={user.status ? true : false} />
                            </td>
                            <td>
                                <span onClick={(event) => {
                                    router.push(`user/detail?id=${user.id}`)
                                }} className="cursor-pointer mr-2">Edit</span>
                                {/* The button to open modal */}
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
                    })}
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
        </div>
    </React.Fragment>
}

Users.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default Users;