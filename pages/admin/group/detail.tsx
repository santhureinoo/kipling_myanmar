import React from "react";
import { NextPageWithLayout } from "../../_app";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faClose, faSearch, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];

const ExerciseDetail: NextPageWithLayout = () => {

    const [selected, setSelected] = React.useState([]);


    return <React.Fragment>
        <div className="flex w-full md:min-h-screen bg-base-200">
            <div className="w-screen lg:px-64 md:px-32 px-4">
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="form-control col-span-2">
                        <label className="label">
                            <span className="label-text">Group Name</span>
                        </label>
                        <input type="text" placeholder="username" className="input input-bordered" />
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label">
                            <span className="label-text">Student List</span>
                        </label>
                        <div className="flex gap-x-2 w-full">
                            <input type="text" placeholder="Search by name or id" className="input input-bordered w-full" />
                            <button className="btn btn-square">
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </button>
                        </div>
                        <div className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium">
                                Click me to show/hide content
                            </div>
                            <div className="collapse-content">
                                <table className="table w-full table-zebra">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Approve/Suspend</th>
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
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="form-control col-span-2">
                            <label className="label">
                                <span className="label-text">Course List</span>
                            </label>
                            <div className="flex gap-x-2 w-full">
                                <input type="text" placeholder="Search by name or id" className="input input-bordered w-full" />
                                <button className="btn btn-square">
                                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                </button>
                            </div>
                            <div className="collapse">
                                <input type="checkbox" />
                                <div className="collapse-title text-xl font-medium">
                                    Click me to show/hide content
                                </div>
                                <div className="collapse-content">
                                    <table className="table w-full table-zebra">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Approve/Suspend</th>
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
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex md:justify-end md:gap-x-4 justify-center gap-x-2">
                    <button className="btn btn-primary">Cancel</button>
                    <button className="btn btn-primary">Save</button>
                </div>

            </div>
        </div>
    </React.Fragment >
}

export default ExerciseDetail;