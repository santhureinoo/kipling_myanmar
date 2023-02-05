import React, { ReactElement } from "react";
import excuteQuery from "../../utilities/db";
import { users } from "../../utilities/type";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import rfdc from "rfdc";

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
    const [pageIndex, setPageIndex] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {

        setLoading(true);

        const options = {
            url: '/api/user/list',
            params: { page: pageIndex.toString() },
        };

        CapacitorHttp.get(options).then((response: HttpResponse) => {
            setLoading(false);
            setUsers(response.data);
        }).catch(err => {
            setLoading(false);
            setUsers([]);
        })
    }, []);

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
            <button onClick={() => {
                router.push('user/detail');
            }} className="btn btn-primary float-right">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create User</span>
            </button>
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
                                <span onClick={(event)=>{
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