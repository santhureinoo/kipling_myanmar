import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';

const Courses: NextPageWithLayout = () => {
    return <React.Fragment>
        <div className="overflow-x-auto">
            <button className="btn btn-primary float-right">
               <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Course</span>
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

Courses.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Courses;