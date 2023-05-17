import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faClose, faSearch, faEllipsisV, faAdd } from "@fortawesome/free-solid-svg-icons";
import Layout from "../layout";
import { Field, Form, Formik } from "formik";
import { courses, groups, multiple_select, users } from "../../../utilities/type";
import { initialGroup, initialUser } from "../../../utilities/defaultData";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import router from "next/router";
import rfdc from "rfdc";
import { clone, uid } from "chart.js/dist/helpers/helpers.core";

const cloneDeep = rfdc();

const ExerciseDetail: NextPageWithLayout = () => {

    const [selectedStudents, setSelectedStudents] = React.useState<multiple_select[]>([]);
    const [selectedCourses, setSelectedCourses] = React.useState<multiple_select[]>([]);
    const [group, setGroup] = React.useState<groups>(initialGroup());

    const userFilterOptions = async (options: any, filter: any) => {
        // alert("filtering", filter);

        if (!filter) {
            return options;
        }
        const opt = {
            url: process.env.NEXT_PUBLIC_URL +`/api/user/list`,
            params: { name: filter },
        };
        const response = await CapacitorHttp.post(opt);
        const users: users[] = response.data;
        if (users && users.length > 0) {
            // setOptions(files.map(fil => { return { label: fil.id?.toString() || '', value: fil.name } }));
            options = users.map(usr => { return { value: usr.id?.toString() || '', label: usr.name } });
            const re = new RegExp(filter, "i");
            return options.filter(({ label }: any) => label && label.match(re));
        } else {
            return options;
        }
    }

    const courseFilterOptions = async (options: any, filter: any) => {
        // alert("filtering", filter);

        if (!filter) {
            return options;
        }
        const opt = {
            url: process.env.NEXT_PUBLIC_URL +`/api/course/list`,
            params: { name: filter },
        };
        const response = await CapacitorHttp.post(opt);
        const courses: courses[] = response.data;
        if (courses && courses.length > 0) {
            // setOptions(files.map(fil => { return { label: fil.id?.toString() || '', value: fil.name } }));
            options = courses.map(cour => { return { value: cour.id?.toString() || '', label: cour.name } });
            const re = new RegExp(filter, "i");
            return options.filter(({ label }: any) => label && label.match(re));
        } else {
            return options;
        }
    }

    const onChange = (attribute: string, value: any) => {
        const clonedGroup = cloneDeep(group);
        clonedGroup[attribute] = value;
        setGroup(clonedGroup);
    }

    const setStudentsInGroup = () => {
        const clonedGroup = cloneDeep(group);
        if (selectedStudents.length > 0) {
            selectedStudents.forEach(ss => {
                if (!clonedGroup.user_ids.find(ui => ui.value === ss.value)) {
                    clonedGroup.user_ids.push(ss);
                }
            })
            setGroup(clonedGroup);
            setSelectedStudents([]);
        }
    }

    const removeSelectedStudent = (index: number) => {
        const clonedGroup = cloneDeep(group);
        clonedGroup.user_ids && clonedGroup.user_ids.splice(index, 1);
        setGroup(clonedGroup);
    }

    const removeSelectedCourses = (index: number) => {
        const clonedGroup = cloneDeep(group);
        clonedGroup.course_ids && clonedGroup.course_ids.splice(index, 1);
        setGroup(clonedGroup);
    }

    const setCoursesInGroup = () => {
        const clonedGroup = cloneDeep(group);
        if (selectedCourses.length > 0) {
            selectedCourses.forEach(sc => {
                if (!clonedGroup.course_ids.find(ui => ui.value === sc.value)) {
                    clonedGroup.course_ids.push(sc);
                }
            })
            setGroup(clonedGroup);
            setSelectedCourses([]);
        }
    }


    React.useEffect(() => {
        // setLoading(true);
        if (router.query['id']) {
            const options = {
                url: process.env.NEXT_PUBLIC_URL +'/api/group/single',
                params: { id: router.query['id'] },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                // setLoading(false);
                setGroup(response.data)
            }).catch(err => {
                // setLoading(false);
                setGroup(initialGroup());
            })
        } else {
            // setLoading(false);
        }
    }, [router.isReady])

    return <React.Fragment>
        <Formik
            initialValues={group}
            validate={() => {
                const errors: any = {};

                if (!group.name) {
                    errors.name = 'Group name is required'
                }
                // else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(user.password)) {
                //     errors.password = 'Password must be at least eight characters, one letter and one number.'
                // }
                return errors
            }}
            onSubmit={(_, { setSubmitting }) => {
                const options = {
                    url: process.env.NEXT_PUBLIC_URL +`/api/group/${router.query['id'] ? 'update' : 'create'}`,
                    data: group,
                };

                CapacitorHttp.post(options).then((response: HttpResponse) => {
                    router.back();
                    setSubmitting(false);
                }).catch(err => {
                    setSubmitting(false);
                })
            }}
        >
            {({ errors, isSubmitting }) => (
                <Form className="flex w-full md:min-h-screen bg-base-200">
                    <div className="w-screen lg:px-64 md:px-32 px-4">
                        <div className="grid grid-cols-2 gap-4 my-4">
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Group Name</span>
                                </label>
                                <input value={group.name} type="text" onChange={(event) => { onChange('name', event.currentTarget.value) }} placeholder="username" className="input input-bordered" />
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Student List</span>
                                </label>
                                <div className="flex gap-x-2 w-full">
                                    <Field
                                        component={MultiSelect}
                                        selectionLimit={1}
                                        options={[]}
                                        ClearSelectedIcon={<React.Fragment />}
                                        className="w-full"
                                        value={selectedStudents}
                                        filterOptions={userFilterOptions}
                                        onChange={(val: any) => {
                                            if (val && val.length > 0)
                                                setSelectedStudents(val);
                                        }}
                                        labelledBy="Select"
                                        name="students"
                                    />

                                    <button type="button" className="btn btn-square" onClick={(event) => {
                                        setStudentsInGroup();
                                    }}>
                                        <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                                    </button>
                                </div>
                                <div className="collapse">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium">
                                        Click me to show/hide students
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
                                                    group.user_ids && group.user_ids.map((uId, index) => {
                                                        return <tr key={index}>
                                                            <td>
                                                                {uId.value}
                                                            </td>
                                                            <td>
                                                                {uId.label}
                                                            </td>
                                                            <td>
                                                                <button type="button" className="btn btn-square" onClick={(event) => {
                                                                    removeSelectedStudent(index);
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

                                <div className="form-control col-span-2">
                                    <label className="label">
                                        <span className="label-text">Course List</span>
                                    </label>
                                    <div className="flex gap-x-2 w-full">
                                        {/* <input type="text" placeholder="Search by name or id" className="input input-bordered w-full" /> */}
                                        <Field
                                            component={MultiSelect}
                                            selectionLimit={1}
                                            options={[]}
                                            ClearSelectedIcon={<React.Fragment />}
                                            className="w-full"
                                            value={selectedCourses}
                                            filterOptions={courseFilterOptions}
                                            onChange={(val: any) => {
                                                if (val && val.length > 0)
                                                    setSelectedCourses(val);
                                            }}
                                            labelledBy="Select"
                                            name="courses"
                                        />

                                        <button type="button" className="btn btn-square" onClick={(event) => {
                                            setCoursesInGroup();
                                        }}>
                                            <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                    <div className="collapse">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-xl font-medium">
                                            Click me to show/hide courses
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
                                                    {group.course_ids && group.course_ids.map((cid, index) => {
                                                        return <tr key={index}>
                                                            <td>
                                                                {cid.label}
                                                            </td>
                                                            <td>
                                                                {cid.value}
                                                            </td>
                                                            <td>
                                                                <button type="button" className="btn btn-square" onClick={(event) => {
                                                                    removeSelectedCourses(index);
                                                                }}>
                                                                    <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex md:justify-end md:gap-x-4 justify-center gap-x-2">
                            <button type="reset" onClick={(event) => { router.back() }} className="btn btn-primary">Cancel</button>
                            <button type="submit" className={`btn btn-primary  ${isSubmitting && 'loading btn-disabled'}`}>Save</button>
                        </div>

                    </div>
                </Form>

            )}
        </Formik>


    </React.Fragment >
}

ExerciseDetail.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default ExerciseDetail;