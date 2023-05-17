import React, { ChangeEvent, ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { exercises } from "../../utilities/type";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import rfdc from "rfdc";
import ReactPaginate from "react-paginate";

const cloneDeep = rfdc();

const Exercises: NextPageWithLayout = () => {
    const router = useRouter();
    const [exercises, setExercises] = React.useState<exercises[]>([]);
    const [searchName, setSearchName] = React.useState('');
    const [pageTotal, setPageTotal] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(1);

    const getTotal = React.useCallback(() => {
        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/total/exercises`,
            params: {
                name: searchName,
            }
        };

        CapacitorHttp.get(options).then(result => {
            if (result.data && result.data.length > 0) {
                setPageTotal(Math.ceil(result.data[0].total / 10));
            }
        })
    }, [searchName])

    const refatchExercise = React.useCallback(() => {
        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/exercise/list`,
            params: {
                name: searchName.toString(),
                pageIndex: pageIndex.toString(),
            },
        };
        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setExercises(response.data);
        }).catch(err => {
            console.log(err);
        });
    }, [searchName, pageIndex])


    React.useEffect(() => {
        refatchExercise();
        getTotal();
    }, [pageIndex])

    const onDelete = (index: number) => {
        const clonedExercises = cloneDeep(exercises);
        const options = {
            url: process.env.NEXT_PUBLIC_URL +'/api/exercise/delete',
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

    const onChange = (event: ChangeEvent<HTMLInputElement>, index: number, attribute: string, value: any) => {
        const clonedExercises = cloneDeep(exercises);

        clonedExercises[index][attribute] = value;

        const currentExercise: exercises = clonedExercises[index];

        delete currentExercise.created_at;
        delete currentExercise.updated_at;

        const options = {
            url: process.env.NEXT_PUBLIC_URL +`/api/exercise/update`,
            data: currentExercise,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setExercises(clonedExercises);
        }).catch(err => {
        })

    }

    return <React.Fragment>
        <div className="overflow-x-auto">
            <div>
                <input type="text" placeholder="Search by Name" value={searchName} onChange={val => setSearchName(val.currentTarget.value)} className="input input-bordered w-full max-w-xs mr-2" />
                <button onClick={() => {
                    if (pageIndex > 1) {
                        setPageIndex(1);
                        getTotal();
                    } else {
                        refatchExercise();
                        getTotal();
                    }

                }} className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
                <button onClick={() => {
                    router.push('exercise/detail');
                }} className="btn btn-primary float-right">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create Exam</span>
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
                    {exercises.map((exe, index) => {
                        return <tr key={`exe-${index}`}>
                            <td>
                                {exe.id}
                            </td>
                            <td>
                                {exe.name}
                            </td>
                            <td>
                                <input type="checkbox" className="toggle" onChange={(event) => onChange(event, index, 'status', exe.status === 1 ? 0 : 1)} checked={exe.status === 1 ? true : false} />
                            </td>
                            <td>
                                <span onClick={(event) => {
                                    router.push(`exercise/detail?id=${exe.id}`)
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

Exercises.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Exercises;