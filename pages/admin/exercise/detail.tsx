import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faClose } from "@fortawesome/free-solid-svg-icons";
import rfdc from "rfdc";
import { answers, courses, exercises, files, multiple_select, questions } from "../../../utilities/type";
import { Formik, Form, Field, FieldArray } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { initialAnswer, initialExercise, initialQuestion } from "../../../utilities/defaultData";
import { useRouter } from "next/router";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import Layout from "../layout";

const cloneDeep = rfdc();

const ExerciseDetail: NextPageWithLayout = () => {

    // const [selected, setSelected] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [courses, setCourses] = React.useState<courses[]>([]);
    const [exercise, setExercise] = React.useState<exercises>(initialExercise());
    const router = useRouter();

    React.useEffect(() => {
        const options = {
            url: '/api/course/list'
        };
        CapacitorHttp.get(options).then((response: HttpResponse) => {
            setCourses(response.data);
        }).catch(err => {
            setCourses([]);
        })
    }, [])

    React.useEffect(() => {
        setLoading(true);
        if (router.query['id']) {
            const options = {
                url: '/api/exercise/single',
                params: { id: router.query['id'] },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setLoading(false);
                setExercise(response.data)
            }).catch(err => {
                setLoading(false);
                setExercise(initialExercise());
            })
        } else {
            setLoading(false);
        }
    }, [router.isReady])

    const addNewQuestion = () => {
        const clonedExercise = cloneDeep(exercise);
        clonedExercise.questions?.push(initialQuestion(clonedExercise.questions?.length || 0));

        // clonedAnswers.push([initialAnswer(clonedAnswers.length, 0)]);
        setExercise(clonedExercise);

    }

    const addNewAnswer = (questionId: number, index: number) => {
        const clonedExercise = cloneDeep(exercise);
        if (clonedExercise.questions && clonedExercise.questions[questionId]) {
            clonedExercise.questions[questionId].answers?.splice(index, 0, initialAnswer(clonedExercise.questions[questionId].answers?.length || 0, questionId))
        }
        setExercise(clonedExercise);
    }

    const removeAnswer = (questionId: number, index: number) => {
        const clonedExercise = cloneDeep(exercise);
        if (clonedExercise.questions && clonedExercise.questions[questionId]) {
            clonedExercise.questions[questionId].answers?.splice(index, 1);
        }
        setExercise(clonedExercise);
    }

    const onChange = (attribute: string, value: any) => {
        const clonedExercise = cloneDeep(exercise);
        if (attribute === 'File') {
            const files: multiple_select[] = value;
            clonedExercise.files = files.filter(fil => fil.label && fil.value);
        } else {
            clonedExercise[attribute] = value;
        }
        setExercise(clonedExercise);
    }

    const deleteQuestion = (index: number) => {
        const clonedExercise = cloneDeep(exercise);

        if (clonedExercise.questions && clonedExercise.questions.length > index) {
            delete clonedExercise.questions[index];
        }

        setExercise(clonedExercise);
    }

    const changeQuestion = (index: number, attribute: string, value: any) => {
        const clonedExercise = cloneDeep(exercise);
        if (clonedExercise.questions && clonedExercise.questions.length > index) {
            const quest = clonedExercise.questions[index];
            console.log(typeof value);
            quest[attribute] = value;
        }
        setExercise(clonedExercise);
    }

    const changeAnswer = (questionIndex: number, answerIndex: number, attribute: string, value: any) => {
        const clonedExercise = cloneDeep(exercise);
        if (clonedExercise.questions && clonedExercise.questions.length > questionIndex) {

            const selectedQuest = clonedExercise.questions[questionIndex];
            if (selectedQuest.answers && selectedQuest.answers.length > answerIndex) {
                const answer = selectedQuest.answers[answerIndex];
                answer[attribute] = value;
            }
        }
        setExercise(clonedExercise);
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

    const questionComp = React.useMemo(() => {
        return exercise.questions?.map((quest, index) => <div key={index} className="indicator w-full flex mt-4">
            <div className="indicator-item right-[35px]">
                <div className="badge badge-primary cursor-pointer w-8 h-8"><FontAwesomeIcon icon={faMinus} /></div>
                <div onClick={() => { deleteQuestion(index) }} className="badge badge-primary cursor-pointer w-8 h-8 ml-2"><FontAwesomeIcon icon={faClose} /></div>
            </div>
            <div className="bg-base-300 w-full place-items-center p-4">
                <div className="flex flex-col">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Question</span>
                        </label>
                        <Field type="text" value={quest.question} onChange={(event: any) => changeQuestion(index, 'question', event.currentTarget.value)} placeholder="Enter a question" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <Field as="select" className="select select-bordered" value={quest.type} onChange={(event: any) => changeQuestion(index, 'type', parseInt(event.currentTarget.value))}>
                            <option value={-1}>Please choose</option>
                            <option value={0}>Education</option>
                            <option value={1}>Knowledge</option>
                            <option value={2}>Important</option>
                        </Field>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Answers</span>
                        </label>
                        {quest.answers?.map((ans, ansIndex) => {
                            return <div key={`div-${ansIndex}`} className="flex flex-wrap justify-between">
                                <div className="flex">
                                    <input type="text" placeholder="username" value={ans.answer} onChange={event => changeAnswer(index, ansIndex, 'answer', event.currentTarget.value)} className="input input-bordered" />
                                    <label className="cursor-pointer label">
                                        <span className="label-text mr-2">Correct?</span>
                                        <input type="checkbox" className="checkbox checkbox-lg" value={ans.valid} onChange={event => changeAnswer(index, ansIndex, 'valid', event.currentTarget.value)} />
                                    </label>
                                </div>
                                <div className="btn-group gap-x-4">
                                    <button type="button" onClick={() => addNewAnswer(index, ansIndex)} className="btn btn-active"><FontAwesomeIcon icon={faPlus} /></button>
                                    <button type="button" className="btn" onClick={() => removeAnswer(index, ansIndex)}><FontAwesomeIcon icon={faMinus} /></button>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div >)
    }, [exercise.questions])

    return <React.Fragment>
        <div className="flex w-full md:min-h-screen bg-base-200">
            <Formik
                initialValues={exercise}
                validate={() => {
                    const errors: any = {};
                    if (!exercise.name) {
                        errors.name = 'Username is required'
                    }
                    return errors
                }}
                onSubmit={(_, { setSubmitting }) => {
                    const options = {
                        url: `/api/exercise/${router.query['id'] ? 'update' : 'create'}`,
                        data: exercise,
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
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Exercise Name</span>
                                </label>
                                <Field type="text" name="name" value={exercise.name} placeholder="Exercise Name" onChange={(event: any) => onChange('name', event.currentTarget.value)} className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">This exercise belongs to</span>
                                </label>
                                <Field as="select" value={exercise.courses_id} name="course_id" onChange={(event: any) => onChange('courses_id', event.currentTarget.value)} className="select select-bordered">
                                    <option value={-1}>Please choose</option>
                                    {
                                        courses.map((cou, index) => {
                                            return <option key={`course-${index}`} value={cou.id}>{cou.name}</option>
                                        })
                                    }
                                </Field>
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text">Content (video)</span>
                                </label>
                                <Field
                                    component={MultiSelect}
                                    selectionLimit={1}
                                    ClearSelectedIcon={<React.Fragment/>}
                                    options={[]}
                                    value={exercise.files}
                                    filterOptions={filterOptions}
                                    onChange={(val: any) => {
                                        onChange('File', val);
                                    }}
                                    labelledBy="Select"
                                    name="trailers"
                                />
                            </div>
                            {/* <div className="col-span-2">
                                {questionComp}
                            </div> */}
                        </div>
                        {/* <button type="button" className="btn btn-primary" onClick={addNewQuestion}>Add More Questions</button> */}
                        <div className="flex md:justify-end md:gap-x-4 justify-center gap-x-2">
                            <button type="reset" onClick={(event)=>{router.back()}} className="btn btn-primary">Cancel</button>
                            <button type="submit" className={`btn btn-primary ${isSubmitting && 'loading btn-disabled'}`}>Save</button>
                        </div>
                    </Form>
                )}

            </Formik>
        </div>
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
