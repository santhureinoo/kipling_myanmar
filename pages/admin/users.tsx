import React, { ReactElement } from "react";
import { bulkUsers, groups, multiple_select, users } from "../../utilities/type";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import rfdc from "rfdc";
import ReactPaginate from "react-paginate";
import { Field, Form, Formik } from "formik";
import { MultiSelect } from "react-multi-select-component";
import xlsx from "json-as-xlsx";

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
    const [selectedBulkGroups, setSelectedBulkGroups] = React.useState<multiple_select[]>([]);
    const [bulkUsers, setBulkUsers] = React.useState<bulkUsers>({ usernames: '', groupIds: [] });
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

    const setGroupsInBulk = () => {
        const clonedBulkUsers = cloneDeep(bulkUsers);
        clonedBulkUsers.groupIds = selectedBulkGroups;
        setSelectedBulkGroups([]);
        setBulkUsers(clonedBulkUsers);
    }

    const filterOptions = async (options: any, filter: any) => {

        if (!filter) {
            return options;
        }
        const opt = {
            url: `/api/group/list`,
            params: { name: filter },
        };
        const response = await CapacitorHttp.post(opt);
        const groups: groups[] = response.data;
        if (groups && groups.length > 0) {
            // setOptions(files.map(fil => { return { label: fil.id?.toString() || '', value: fil.name } }));
            options = groups.map(gp => { return { value: gp.id?.toString() || '', label: gp.name } });
            const re = new RegExp(filter, "i");
            return options;
            //.filter(({ label }: any) => label && label.match(re));
        } else {
            return options;
        }
    }

    const removeBulkUser = (index: number) => {
        const clonedBulkUsers = cloneDeep(bulkUsers);
        delete clonedBulkUsers.groupIds[index];
        setBulkUsers(clonedBulkUsers);
    }

    const onChangeUserIds = (e: any) => {
        const clonedBulkUsers = cloneDeep(bulkUsers);
        clonedBulkUsers.usernames = e.currentTarget.value;
        setBulkUsers(clonedBulkUsers);
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
                        searchUsers();
                        getTotal();
                    }

                }} className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
                {/* <input type="checkbox" checked className="checkbox" /> */}

                <button onClick={() => {
                    router.push('user/detail');
                }} className="btn btn-primary float-right">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Create User</span>
                </button>

                {/* <button onClick={() => {
                    router.push('user/detail');
                }} className="">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Bulk Create Users</span>
                </button> */}

                {/* The button to open modal */}
                <label htmlFor="bulk-create" className="btn btn-primary float-right mx-2">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> <span className="ml-2">Bulk Create Users</span>
                </label>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id="bulk-create" className="modal-toggle" />
                <div className="modal">
                    <Formik
                        initialValues={bulkUsers}
                        validate={() => {
                            const errors: any = {};

                            if (!bulkUsers.usernames) {
                                errors.usernames = 'usernames are required'
                            }

                            if (!bulkUsers.groupIds) {
                                errors.groupIds = 'groups are required'
                            }
                            // else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(user.password)) {
                            //     errors.password = 'Password must be at least eight characters, one letter and one number.'
                            // }

                            console.log(errors);
                            return errors
                        }}
                        onSubmit={(_, { setSubmitting }) => {
                            const options = {
                                url: `/api/user/bulk_create`,
                                data: bulkUsers,
                            };

                            CapacitorHttp.post(options).then((response: HttpResponse) => {
                                const userList: users[] = response.data;
                                let data = [
                                    {
                                        sheet: "New Users",
                                        columns: [
                                            { label: "Id", value: "id" }, // Top level data
                                            { label: "Name", value: "name" },
                                            { label: "Password", value: "password" }, // Custom format
                                        ],
                                        content: userList.map(user => {
                                            return { id: user.id, name: user.name, password: user.password };
                                        })
                                        ,
                                    },

                                ]

                                let settings = {
                                    fileName: "NewUsers", // Name of the resulting spreadsheet
                                    // extraLength: 3, // A bigger number means that columns will be wider
                                    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                                    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                                    RTL: false, // Display the columns from right-to-left (the default value is false)
                                }

                                xlsx(data, settings) // Will download the excel file
                                router.back();

                                setSubmitting(false);
                            }).catch(err => {
                                setSubmitting(false);
                            })
                        }}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form className="modal-box w-11/12 max-w-5xl">
                                <h3 className="font-bold text-lg">Please enter student&apos;s names with comma separated and choose the groups.</h3>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Student List </span>
                                    </label>
                                    <Field as="textarea" onChange={(e: any) => onChangeUserIds(e)} value={bulkUsers.usernames} placeholder="example : Kyaw Kyaw, Aung Aung" name="name" className="textarea textarea-bordered h-24"></Field>
                                </div>
                                <div className="form-control col-span-2">
                                    <label className="label">
                                        <span className="label-text">Group List</span>
                                    </label>
                                    <div className="flex gap-x-2 w-full">
                                        <Field
                                            component={MultiSelect}
                                            selectionLimit={1}
                                            options={[]}
                                            ClearSelectedIcon={<React.Fragment />}
                                            className="w-full"
                                            value={selectedBulkGroups}
                                            filterOptions={filterOptions}
                                            onChange={(val: any) => {
                                                if (val && val.length > 0) {
                                                    setSelectedBulkGroups(val);
                                                }
                                            }}
                                            labelledBy="Select"
                                            name="students"
                                        />

                                        <button type="button" className="btn btn-square" onClick={(event) => {
                                            setGroupsInBulk();
                                        }}>
                                            <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                    <div className="collapse">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-xl font-medium">
                                            Click me to show/hide groups
                                        </div>
                                        <div className="collapse-content">
                                            <table className="table w-full table-zebra">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Remove?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        bulkUsers.groupIds && bulkUsers.groupIds.map((gId, index) => {
                                                            return <tr key={index}>
                                                                <td>
                                                                    {gId.value}
                                                                </td>
                                                                <td>
                                                                    {gId.label}
                                                                </td>
                                                                <td>
                                                                    <button type="button" className="btn btn-square" onClick={(event) => {
                                                                        removeBulkUser(index);
                                                                    }}>
                                                                        <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-action">
                                    <button type="submit" className="btn">Apply</button>
                                    <label htmlFor="bulk-create" className="btn">Cancel</label>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <table className="table w-full table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Approve/Suspend</th>
                        <th>Labels</th>
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
                                {user.isNew ? <span className="badge mx-1">New</span> : <></>}
                            </td>
                            <td>
                                <span onClick={(event) => {
                                    router.push(`user/detail?id=${user.id}`)
                                }} className="cursor-pointer mr-2">Edit</span>
                                {/* The button to open modal */}
                                {/* <label htmlFor={`my-modal-${index}`} className="cursor-pointer">Delete</label> */}

                                {/* Put this part before </body> tag */}
                                <input type="checkbox" id={`my-modal-${index}`} className="modal-toggle" />
                                {/* <div className="modal">
                                    <div className="modal-box">
                                        <p>Are you sure you want to delete?</p>
                                        <div className="modal-action">
                                            <label onClick={event => { onDelete(index) }} htmlFor={`my-modal-${index}`} className="btn btn-primary">Accept</label>
                                            <label htmlFor={`my-modal-${index}`} className="btn">Close</label>
                                        </div>
                                    </div>
                                </div> */}
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
    </React.Fragment >
}

Users.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default Users;