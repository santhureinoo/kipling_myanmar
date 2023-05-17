import React, { ChangeEvent, ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { groups } from "../../utilities/type";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import rfdc from "rfdc";
import ReactPaginate from 'react-paginate';

const cloneDeep = rfdc();

const Groups: NextPageWithLayout = () => {
    const router = useRouter();
    const [groups, setGroups] = React.useState<groups[]>([]);

    React.useEffect(() => {
        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/group/list`,
        };
        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setGroups(response.data);

        }).catch(err => {
            console.log(err);
        });

    }, [])

    const onChange = (event: ChangeEvent<HTMLInputElement>, index: number, attribute: string, value: any) => {
        const clonedGroups = cloneDeep(groups);

        clonedGroups[index][attribute] = value;

        const currentGroup: groups = clonedGroups[index];

        // delete currentCourse.created_at;
        // delete currentCourse.updated_at;

        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/group/update`,
            data: currentGroup,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setGroups(clonedGroups);
        }).catch(err => {
        })

    }

    return <React.Fragment>
        <div className="overflow-x-auto">
            <button onClick={() => {
                router.push('group/detail');
            }} className="btn btn-primary float-right">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Group</span>
            </button>
            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Users</th>
                        <th>Courses</th>
                        <th>Approve/Suspend</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, index) => {
                        return <tr key={index}>
                            <td>
                                {group.id}
                            </td>
                            <td>
                                {group.name}
                            </td>
                            <td>
                                {group.user_ids_string ? group.user_ids_string.split(',').length : 0}
                            </td>
                            <td>
                                {group.course_ids_string ? group.course_ids_string.split(',').length : 0}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" onChange={(event) => onChange(event, index, 'status', group.status === 1 ? 0 : 1)} checked={group.status === 1 ? true : false} />
                            </td>
                            <td>
                                <span onClick={(event) => {
                                    router.push(`group/detail?id=${group.id}`)
                                }} className="cursor-pointer mr-2">Edit</span>
                            </td>
                        </tr>
                    })}

                </tbody>
            </table>
            {/* <div className="float-right mt-4">
                <ReactPaginate
                    containerClassName={"flex flex-row items-center"}
                    pageClassName={"p-4 mx-2 bg-slate-400"}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={() => { }}
                    pageRangeDisplayed={5}
                    pageCount={10}
                    previousLabel="<"
                // renderOnZeroPageCount={<></>}
                />
            </div> */}

        </div>

    </React.Fragment>
}

Groups.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Groups;