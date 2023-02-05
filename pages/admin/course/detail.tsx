import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faClose } from "@fortawesome/free-solid-svg-icons";
import rfdc from "rfdc";
import { answers, courses, exercises, files, questions } from "../../../utilities/type";
import { v4 as uuidv4 } from 'uuid';
import { initialCourse, initialExercise, initialQuestion } from "../../../utilities/defaultData";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { file } from "googleapis/build/src/apis/file";
import Layout from "../layout";

// const options = [
//     { label: "Trailer 1", value: 1 },
//     { label: "Trailer 2", value: 2 },
//     // { label: "Trailer 3", value: "strawberry", disabled: true },
// ];

const cloneDeep = rfdc();

const CourseDetail: NextPageWithLayout = () => {

    const [selected, setSelected] = React.useState([]);
    const [selectedTrailer, setSelectedTrailer] = React.useState<{ label: string, value?: any }>({ label: "", value: "" });
    const [loading, setLoading] = React.useState(false);
    const [course, setCourse] = React.useState<courses>(initialCourse);
    const [options, setOptions] = React.useState<{ label: string | null, value: any }[]>([]);
    const router = useRouter();

    React.useEffect(() => {
        setLoading(true);
        if (router.query['id']) {
            const options = {
                url: '/api/course/single',
                params: { id: router.query['id'] },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setLoading(false);
                setCourse(response.data);
            }).catch(err => {
                setLoading(false);
                setCourse(initialCourse());
            })
        } else {
            setLoading(false);
        }
    }, [router.isReady])

    const onChange = (attribute: string, value: any) => {
        if (attribute === 'trailer_id') {
            const clonedCourse = cloneDeep(course);
            clonedCourse[attribute] = value.value;
            setCourse(clonedCourse);
            setSelectedTrailer(value);
        } else {
            const clonedCourse = cloneDeep(course);
            clonedCourse[attribute] = value;
            setCourse(clonedCourse);
        }
    }

    const filterOptions = async (options: any, filter: any) => {
        // alert("filtering", filter);

        if (!filter) {
            return options;
        }
        const opt = {
            url: `/api/file/list`,
            params: { name: filter },
        };
        const response = await CapacitorHttp.post(opt);
        const files: files[] = response.data;
        if (files && files.length > 0) {
            // setOptions(files.map(fil => { return { label: fil.id?.toString() || '', value: fil.name } }));
            options = files.map(fil => { return { value: fil.id?.toString() || '', label: fil.name } });
            const re = new RegExp(filter, "i");
            return options.filter(({ label }: any) => label && label.match(re));
        } else {
            return options;
        }
    }

    React.useEffect(() => {
        if (course.trailer_id) {
            const options = {
                url: `/api/file/single`,
                params: {
                    'id': course.trailer_id.toString()
                }
            };


            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setSelectedTrailer({ label: response.data.name, value: response.data.id });
            }).catch(err => {
                setSelectedTrailer({ label: '', value: '' });
            })
        }
    }, [course.trailer_id])

    return <React.Fragment>
        <Formik
            initialValues={course}
            validate={() => {
                const errors: any = {};

                if (!course.name) {
                    errors.name = 'Course name is required'
                }
                // else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(user.password)) {
                //     errors.password = 'Password must be at least eight characters, one letter and one number.'
                // }
                return errors
            }}
            onSubmit={(_, { setSubmitting }) => {
                const modifiedCourse = cloneDeep(course);
                delete modifiedCourse.exercise_counts;
                delete modifiedCourse.exercise_ids;
                delete modifiedCourse.exercise_names;
                const options = {
                    url: `/api/course/${course.id ? 'update' : 'create'}`,
                    data: modifiedCourse,
                };
                setSubmitting(true);
                CapacitorHttp.post(options).then((response: HttpResponse) => {
                    setSubmitting(false);
                }).catch(err => {
                    setSubmitting(false);
                })
            }}
        >
            {({ errors, isSubmitting }) => (
                <Form className="flex w-full md:min-h-screen bg-base-200">
                    <div className="w-screen lg:px-64 md:px-32 px-4">
                        <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Course Name {course.id ? `(${course.id})` : ''}</span>
                                </label>
                                <Field type="text" placeholder="username" className="input input-bordered" value={course.name} onChange={(event: any) => {
                                    onChange('name', event.currentTarget.value)
                                }} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <Field component="textarea" className="textarea textarea-bordered" placeholder="Keep it between 20 - 30 words." value={course.description} onChange={(event: any) => {
                                    onChange('description', event.currentTarget.value)
                                }} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Trailer (video)</span>
                                </label>
                                <Field
                                    component={MultiSelect}
                                    selectionLimit={1}
                                    options={options}
                                    ClearSelectedIcon={<React.Fragment/>}
                                    value={[selectedTrailer]}
                                    filterOptions={filterOptions}
                                    onChange={(val: any) => {
                                        if (val && val.length > 0)
                                            onChange('trailer_id', val[1]);
                                    }}
                                    labelledBy="Select"
                                    name="trailers"
                                />

                            </div>
                        </div>
                        <div className="flex md:justify-end md:gap-x-4 justify-center gap-x-2">
                            <button type="reset" onClick={(event)=>{router.back()}} className="btn btn-primary">Cancel</button>
                            <button type="submit" className={`btn btn-primary ${isSubmitting && 'loading btn-disabled'}`}>Save</button>
                        </div>

                    </div>
                </Form>
            )}
        </Formik>

    </React.Fragment >
}

CourseDetail.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default CourseDetail;

function initialAnswer(length: number, arg1: number): answers {
    throw new Error("Function not implemented.");
}
