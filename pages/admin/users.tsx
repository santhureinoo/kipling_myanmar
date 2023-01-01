import React, { ReactElement } from "react";
import excuteQuery from "../../utilities/db";
import { users } from "../../utilities/type";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";

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

const Users: NextPageWithLayout = ({ result }: any) => {
    const users: users[] = [];

    // const users: users[] = React.useMemo(() => {
    //     return JSON.parse(result);
    // }, [result]);

    return <React.Fragment>
        <div className="overflow-x-auto">
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
                    {users.map(user => {
                        return <tr key={`userRow-${user.id}`}>
                            <td>
                                {user.id}
                            </td>
                            <td>
                                {user.name}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" />
                            </td>
                            <td>
                                <label htmlFor={`my-modal-${user.id} cursor-pointer`} className="modal-button" >Delete</label>
                                <input type="checkbox" id={`my-modal-${user.id}`} className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box">
                                        <p>Are you sure you want to delete?</p>
                                        <div className="modal-action">
                                            <label htmlFor={`my-modal-${user.id}`} className="btn btn-primary">Accept</label>
                                            <label htmlFor={`my-modal-${user.id}`} className="btn">Close</label>
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