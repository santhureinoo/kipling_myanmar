import React, { FormEvent } from "react";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { users } from "../../../utilities/type";
import { initialUser } from "../../../utilities/defaultData";
import rfdc from "rfdc";
import excuteQuery, { getUserSQLObj } from "../../../utilities/db";
import { Formik, Form, Field } from 'formik';
import { stringify } from "querystring";

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
            total: JSON.stringify(countObj[0].users_count)
        }, // will be passed to the page component as props
    }
}

const userDetail: NextPageWithLayout = ({ total }: any) => {

    const initial = initialUser(total);
    const [user, setUser] = React.useState<users>(initial);
    const [loading, setLoading] = React.useState(false);
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
                setUser(initial);
            })
        } else {
            setLoading(false);
        }
    }, [router.isReady])

    const onSave = (event: any) => {
        setLoading(true);
        const options = {
            url: `/api/user/${router.query['id'] ? 'update' : 'create'}`,
            headers: { 'X-Fake-Header': 'Fake-Value' },
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
        cloneUser[attribute] = value;
        setUser(cloneUser);
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
                        headers: { 'X-Fake-Header': 'Fake-Value' },
                        params: { size: 'XL' },
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

export default userDetail;