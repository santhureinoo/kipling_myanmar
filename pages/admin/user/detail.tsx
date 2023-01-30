import React, { FormEvent, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { courses, multiple_select, users } from "../../../utilities/type";
import { initialUser } from "../../../utilities/defaultData";
import rfdc from "rfdc";
import excuteQuery, { getUserSQLObj } from "../../../utilities/db";
import { Formik, Form, Field } from 'formik';
import { MultiSelect } from "react-multi-select-component";
import Layout from "../layout";

const cloneDeep = rfdc();
const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];

export async function getStaticProps(context: any) {

    const userSql = getUserSQLObj();
    const totalQuery = userSql.select(userSql.count()).toQuery();
    const countObj: any = await excuteQuery({ query: totalQuery.text });

    return {
        props: {
            total: JSON.stringify(countObj && countObj.length > 0 ? countObj[0].users_count : 0)
        }, // will be passed to the page component as props
    }
}

const UserDetail: NextPageWithLayout = ({ total }: any) => {

    const [user, setUser] = React.useState<users>(initialUser(parseInt(total) + 1));
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<{ label: string | null, value: any }[]>([]);
    const router = useRouter();

    React.useEffect(() => {
        setLoading(true);
        if (router.query['id']) {
            const options = {
                url: '/api/user/single',
                params: { id: router.query['id'] },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setLoading(false);
                setUser(response.data);
            }).catch(err => {
                setLoading(false);
                setUser(initialUser(total));
            })
        } else {
            setLoading(false);
        }
    }, [router.isReady])

    const multiOptions = React.useMemo(() => {
        let result: multiple_select[] = [];
        if (user.course_ids && user.course_ids !== '') {
            const courseNameArr = user.course_names?.split(',') || [];
            result = user.course_ids.split(',').map((id, index) => {
                return {
                    label: courseNameArr[index],
                    value: id
                }
            })
        }

        console.log(result);

        return result;
    }, [user.course_names, user.course_ids])

    const onSave = (event: any) => {
        setLoading(true);
        const options = {
            url: `/api/user/${router.query['id'] ? 'update' : 'create'}`,
            params: { size: 'XL' },
            data: user,
        };

        CapacitorHttp.post(options).then((response: HttpResponse) => {
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        })
    }

    const onChange = (attribute: string, value: any) => {
        const cloneUser = cloneDeep(user);
        if (attribute === 'course') {
            const coursesSelection: multiple_select[] = value;
            cloneUser.course_ids = coursesSelection.length > 0 ? coursesSelection.map(sel => sel.value).join(',') : '';
            cloneUser.course_names = coursesSelection.length > 0 ? coursesSelection.map(sel => sel.label).join(',') : '';
        } else {
            cloneUser[attribute] = value;

        }
        setUser(cloneUser);
    }

    const filterOptions = async (options: any, filter: any) => {
        // alert("filtering", filter);

        if (!filter) {
            return options;
        }
        const opt = {
            url: `/api/course/list`,
            params: { name: filter },
        };
        const response = await CapacitorHttp.post(opt);
        const courses: courses[] = response.data;
        if (courses && courses.length > 0) {
            // setOptions(courses.map(cou => { return { label: cou.id?.toString() || '', value: cou.name } }));
            options = courses.map(cou => { return { value: cou.id?.toString() || '', label: cou.name } });
            const re = new RegExp(filter, "i");
            return options.filter(({ label }: any) => label && label.match(re));
        } else {
            return options;
        }
    }

    return <React.Fragment>
        <div className="flex w-full min-h-screen bg-base-200">
            <Formik
                initialValues={user}
                validate={() => {
                    const errors: any = {};

                    if (!user.name) {
                        errors.name = 'Username is required'
                    }

                    if (!user.password) {
                        errors.password = 'Password is required'
                    }
                    // else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(user.password)) {
                    //     errors.password = 'Password must be at least eight characters, one letter and one number.'
                    // }
                    return errors
                }}
                onSubmit={(_, { setSubmitting }) => {
                    const options = {
                        url: `/api/user/${router.query['id'] ? 'update' : 'create'}`,
                        data: user,
                    };

                    CapacitorHttp.post(options).then((response: HttpResponse) => {
                        setSubmitting(false);
                    }).catch(err => {
                        setSubmitting(false);
                    })
                }}
            >
                {({ errors, isSubmitting }) => (
                    <Form className="w-screen lg:px-64 md:px-32 px-4">
                        <div className="grid grid-cols-2 gap-4 my-4">
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Name ({user.id})</span>
                                </label>
                                <Field id="username" name="username" type="text" onChange={(event: any) => { onChange('name', event.currentTarget.value) }} value={user.name} placeholder="username" className={` ${errors.name ? 'input-error' : ''} input input-bordered`} />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <Field id="password" name="password" type="text" onChange={(event: any) => { onChange('password', event.currentTarget.value) }} value={user.password} placeholder="password" className={` ${errors.password ? 'input-error' : ''} input input-bordered`} />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <Field id="password" name="password" type="text" onChange={(event: any) => { onChange('phoneNumber', event.currentTarget.value) }} value={user.phoneNumber} placeholder="Phone Number" className={`input input-bordered`} />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>
                            </div>

                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Courses</span>
                                </label>
                                <Field
                                    component={MultiSelect}
                                    options={options}
                                    value={multiOptions}
                                    filterOptions={filterOptions}
                                    onChange={(val: any) => {
                                        onChange('course', val);
                                    }}
                                    labelledBy="Select"
                                    name="trailers"
                                />

                            </div>
                            <div className="form-control col-span-2">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Status</span>
                                    <Field id="status" name="status" type="checkbox" className="toggle" onChange={(event: any) => { onChange('status', event.currentTarget.checked ? 1 : 0) }} checked={user.status === 0 ? false : true} />
                                </label>
                            </div>

                        </div>
                        <div className="flex md:justify-end md:gap-x-4 justify-center gap-x-2">
                            <button type="reset" className="btn btn-primary">Cancel</button>
                            <button type="submit" className={`btn btn-primary ${isSubmitting && 'loading btn-disabled'}`}>Save</button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    </React.Fragment >
}

UserDetail.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default UserDetail;