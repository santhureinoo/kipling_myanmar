import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { exercises } from "../../utilities/type";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import rfdc from "rfdc";

const cloneDeep = rfdc();

const Exercises: NextPageWithLayout = () => {
    const router = useRouter();
    const [exercises, setExercises] = React.useState<exercises[]>([]);

    React.useEffect(() => {
        const options = {
            url: `/api/exercise/list`,
        };
        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setExercises(response.data);
        }).catch(err => {
            console.log(err);
        });

    }, [])

    const onDelete = (index: number) => {
        const clonedExercises = cloneDeep(exercises);
        const options = {
            url: '/api/exercise/delete',
            data: clonedExercises[index]
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            delete clonedExercises[index];
            setExercises(clonedExercises);
            // setUsers(cloneUsers);
            // console.log(response.data);
        }).catch(err => {

        })
    }

    return <React.Fragment>
        <div className="overflow-x-auto">
            <button onClick={() => {
                router.push('exercise/detail');
            }} className="btn btn-primary float-right">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Exam</span>
            </button>
            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        {/* <th>Approve/Suspend</th> */}
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exe, index) => {
                        return <tr key={`exe-${index}`}>
                            <td>
                                {exe.id}
                            </td>
                            <td>
                                {exe.name}
                            </td>
                            {/* <td>
                                <input type="checkbox" className="toggle" />
                            </td> */}
                            {/* <td>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </td> */}
                            <td>
                                <span onClick={(event) => {
                                    router.push(`exercise/detail?id=${exe.id}`)
                                }} className="cursor-pointer mr-2">Edit</span>
                                {/* The button to open modal */}
                                <label htmlFor={`my-modal-${index}`} className="cursor-pointer">Delete</label>

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

Exercises.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Exercises;