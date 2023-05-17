import React, { ChangeEvent, ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { courses } from "../../utilities/type";
import rfdc from "rfdc";

const cloneDeep = rfdc();

const Courses: NextPageWithLayout = () => {
    const router = useRouter();
    const [courses, setCourses] = React.useState<courses[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/course/list`,
        };
        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setCourses(response.data);

        }).catch(err => {
            console.log(err);
        });

    }, [])

    const onDelete = (index: number) => {
        setLoading(true);
        const clonedCourses = cloneDeep(courses);
        const options = {
            url: process.env.NEXT_PUBLIC_URL +'/api/course/delete',
            data: clonedCourses[index]
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setLoading(false);
            delete clonedCourses[index];
            setCourses(clonedCourses);
            // setUsers(cloneUsers);
            // console.log(response.data);
        }).catch(err => {
            setLoading(false);
        })
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>, index: number, attribute: string, value: any) => {
        const clonedCourses = cloneDeep(courses);

        clonedCourses[index][attribute] = value;

        const currentCourse: courses = clonedCourses[index];

        delete currentCourse.created_at;
        delete currentCourse.updated_at;

        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/course/update`,
            data: currentCourse,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setCourses(clonedCourses);
        }).catch(err => {
        })

    }

    return <React.Fragment>
        <div className="overflow-x-auto">
            <button onClick={() => {
                router.push('course/detail');
            }} className="btn btn-primary float-right">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Course</span>
            </button>
            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Approve/Suspend</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => {
                        return <tr key={`tr-${index}`}>
                            <td>
                                {course.id}
                            </td>
                            <td>
                                {course.name}
                            </td>
                            <td>
                                {course.description}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" onChange={(event) => onChange(event, index, 'status', course.status === 1 ? 0 : 1)} checked={course.status === 1 ? true : false} />
                            </td>
                            {/* <td>
                                <input type="checkbox" className="toggle" />
                            </td> */}
                            {/* <td>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </td> */}
                            <td>
                                <span onClick={(event) => {
                                    router.push(`course/detail?id=${course.id}`)
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

Courses.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Courses;