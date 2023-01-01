import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";

const Exercises: NextPageWithLayout = () => {
    const router =useRouter();
    return <React.Fragment>
        <div className="overflow-x-auto">
            <button onClick={()=>{
                router.push('exercise/detail');
            }} className="btn btn-primary float-right">
               <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Exam</span>
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
                    <tr>
                        <td>
                            id
                        </td>
                        <td>
                            name
                        </td>
                        <td>
                            <input type="checkbox" className="toggle" />
                        </td>
                        <td>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </React.Fragment>
}

Exercises.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Exercises;