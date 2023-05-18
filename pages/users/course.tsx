import React, { ReactElement, SyntheticEvent } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { courses, exercises, files } from "../../utilities/type";
import { initialCourse, initialExercise } from "../../utilities/defaultData";
import Script from 'next/script'
import { dailyMotionAuth } from "../../utilities/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { file } from "googleapis/build/src/apis/file";
import rfdc from "rfdc";
import { rejects } from "assert";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const cloneDeep = rfdc();

const Course: NextPageWithLayout = () => {

    const router = useRouter();
    const [course, setCourse] = React.useState<courses>(initialCourse());
    const [trailerFile, setTrailerFile] = React.useState<files>();
    const [selectedExerciseId, setSelectedExerciseId] = React.useState<string>();
    const [currentExercise, setCurrentExercise] = React.useState<exercises>();
    const [thumbnailList, setThumbnailList] = React.useState<JSX.Element[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(1);
    const [checkedAnswerList, setCheckedAnswerList] = React.useState<string[]>([]);
    const [showCorrectAnswers, setShowCorrectAnswers] = React.useState(false);

    const changeVideo = (index: number) => {
        const options = {
            url: '/api/dailymotion_auth',
        };
        CapacitorHttp.get(options).then((response: HttpResponse) => {
            localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
            if (currentExercise && currentExercise.actualFiles) {
                const options = {
                    url: `https://api.dailymotion.com/video/${currentExercise.actualFiles[index].unique_name}?fields=private_id`,
                    headers: { 'Authorization': `Bearer ${response.data.access_token}` },
                };
                CapacitorHttp.get(options).then((response: HttpResponse) => {
                    const script = document.createElement("script");
                    script.src = 'https://geo.dailymotion.com/player/xbcbr.js';
                    script.setAttribute('data-video', response.data.private_id);
                    script.async = true;
                    script.onload = function () {
                    };
                    document.getElementById('trailer-dailymotion-player') && document.getElementById('trailer-dailymotion-player')?.replaceChildren(script);
                }).catch(err => {

                })
            }

        }).catch(err => {
            localStorage.removeItem('daily_motion_token');
        });
    }

    const playVideo = (id: any) => {
        if (!id) {
            return;
        }
        const options = {
            url: '/api/dailymotion_auth',
        };
        CapacitorHttp.get(options).then((response: HttpResponse) => {
            localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
            const options = {
                url: `https://api.dailymotion.com/video/${id}?fields=private_id`,
                headers: { 'Authorization': `Bearer ${response.data.access_token}` },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                const script = document.createElement("script");
                script.src = 'https://geo.dailymotion.com/player/xbcbr.js';
                script.setAttribute('data-video', response.data.private_id);
                script.async = true;
                script.onload = function () {
                };
                document.getElementById('trailer-dailymotion-player') && document.getElementById('trailer-dailymotion-player')?.replaceChildren(script);
            }).catch(err => {

            })
        }).catch(err => {
            localStorage.removeItem('daily_motion_token');
        });
        // if (!localStorage.getItem('daily_motion_token')) {

        // } else {
        //     const token = JSON.parse(localStorage.getItem('daily_motion_token') || '');
        //     const options = {
        //         url: process.env.NEXT_PUBLIC_URL +`https://api.dailymotion.com/video/${id}?fields=private_id`,
        //         headers: { 'Authorization': `Bearer ${token.access_token}` },
        //     };
        //     CapacitorHttp.get(options).then((response: HttpResponse) => {
        //         const script = document.createElement("script");
        //         script.src = 'https://geo.dailymotion.com/player/xbcbr.js'; // whatever url you want here
        //         script.charset = "utf-8";
        //         script.setAttribute('data-video', response.data.private_id);
        //         script.async = true;
        //         script.onload = function () {
        //         };
        //         document.getElementById('trailer-dailymotion-player')?.replaceChildren(script);
        //     }).catch(err => {

        //     })
        // }
    }

    const checkAnswer = (questId: number, answerId: number): void => {
        const clonedCheckedAnswerList = cloneDeep(checkedAnswerList);
        const index = clonedCheckedAnswerList.indexOf(`${questId}-${answerId}`);
        if (index !== -1) {
            clonedCheckedAnswerList.splice(index, 1);
        } else {
            clonedCheckedAnswerList.push(`${questId}-${answerId}`);
        }

        setCheckedAnswerList(clonedCheckedAnswerList);
    }

    const showResult = (): void => {
        if (currentExercise && currentExercise.questions && currentExercise.questions.length > 0) {
            checkedAnswerList.forEach(checkedAnswer => {
                const [questId, ansId] = checkedAnswer.split('-').map(dat => parseInt(dat));
                if (currentExercise.questions) {
                    const answerList = currentExercise.questions[questId].answers;
                    if (answerList) {
                        const answerObj = answerList[ansId];

                    }
                }
            })
        }
    }

    const getQuestionColor = (questionId: number) => {
        if (currentExercise && showCorrectAnswers && currentExercise.questions) {
            const answerList = currentExercise.questions[questionId].answers;
            let isFound = false;
            checkedAnswerList.forEach(chkAns => {
                const [questId, ansId] = chkAns.split('-').map(ind => parseInt(ind));
                if (questId === questionId) {
                    if (answerList && answerList[ansId].valid) {
                        isFound = true;
                    }
                }
            })

            return isFound ? 'text-green-400' : 'text-red-400';
        } else {
            return `text-black`;
        }

        // return showCorrectAnswers ? (`text-green-400`) : `text-black`
    }

    React.useEffect(() => {
        setLoading(true);
        if (router.query['id']) {
            const options = {
                url: process.env.NEXT_PUBLIC_URL +'/api/course/single',
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

    React.useEffect(() => {
        if (selectedExerciseId) {
            const options = {
                url: process.env.NEXT_PUBLIC_URL +'/api/exercise/single',
                params: { id: selectedExerciseId },
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setLoading(false);
                setCurrentExercise(response.data)
            }).catch(err => {
                setLoading(false);
                setCurrentExercise(initialExercise());
            })
        } else {
            setLoading(false);
        }
    }, [selectedExerciseId])

    React.useEffect(() => {
        if (course.trailer_id) {
            const options = {
                url: process.env.NEXT_PUBLIC_URL +`/api/file/single`,
                params: {
                    'id': course.trailer_id.toString()
                }
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                setTrailerFile(response.data);
            }).catch(err => {

            })
        }
    }, [course]);

    React.useEffect(() => {
        // return <script src="https://geo.dailymotion.com/player/xbcbr.js" data-video={"x84sh87"}></script>
        if (currentExercise && currentExercise.actualFiles && currentExercise.actualFiles.length > 0) {
            playVideo(currentExercise.actualFiles[0].unique_name);
        } else {
            playVideo(trailerFile?.unique_name);
        }

    }, [trailerFile, currentExercise]);

    const tabDetail = React.useMemo(() => {
        if (course) {
            if (activeTab === 1) {
                return <p>
                    {course.description}
                </p>
            } else if (activeTab === 2) {
                // return <div className="max-w-sm gap-y-2">
                //     {
                //         course.questions && course.questions.map(quest => {
                //             return <div>
                //                 <h1>
                //                     Question
                //                 </h1>
                //                 <div className="w-2/3 ml-auto">
                //                     <div className="form-control">
                //                         <label className="label cursor-pointer">
                //                             <span className="label-text">Remember me</span>
                //                             <input type="checkbox" checked={true} className="checkbox" />
                //                         </label>
                //                     </div>
                //                 </div>
                //             </div>
                //         })
                //     }

                // </div>
                if (currentExercise && currentExercise.questions && currentExercise.questions.length > 0) {
                    return <React.Fragment>
                        {currentExercise.questions.map((que, index) => {
                            return <div key={`quest-${index}`} className="gap-y-2">
                                <h4 className={getQuestionColor(index)}>
                                    {que.question}
                                </h4>
                                <div className="flex flex-col gap-y-1">
                                    {que.answers?.map((ans, ansIndex) => {
                                        return <div key={`ans-${ansIndex}`} className="form-control">
                                            <label className="label justify-start cursor-pointer space-x-2">
                                                <input type="checkbox" name="answers" className="checkbox" onChange={(e) => {
                                                    checkAnswer(index, ansIndex);
                                                }} checked={
                                                    checkedAnswerList.includes(`${index}-${ansIndex}`) ? true : false
                                                } />
                                                <span className="label-text">{ans.answer}</span>
                                                {ans.valid && showCorrectAnswers ? <FontAwesomeIcon id={`${index}-${ansIndex}`} icon={faCheck}></FontAwesomeIcon> : <></>}
                                            </label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                        <div className="flex justify-center gap-x-2">
                            <button type="button" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-success" onClick={e => { setShowCorrectAnswers(true) }}>Show Result</button>
                            <button type="button" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-info" onClick={e => { setShowCorrectAnswers(false) }}>Reset</button>
                        </div>

                    </React.Fragment>
                } else {
                    return <p> No Questions </p>
                }

            }
        } else {
            return <p>
                No Data yet!
            </p >
        }

    }, [course, activeTab, currentExercise, checkedAnswerList, showCorrectAnswers])

    React.useEffect(() => {
        if (currentExercise && currentExercise.actualFiles) {
            const options = {
                url: '/api/dailymotion_auth',
            };
            CapacitorHttp.get(options).then((response: HttpResponse) => {
                localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
                const promiseList: Promise<JSX.Element>[] = [];
                // Retrieve the thumnail one by one.
                currentExercise && currentExercise.actualFiles?.map((file, index) => {
                    const clonedThumbnailList = cloneDeep(thumbnailList);
                    const url = `https://api.dailymotion.com/video/${file.unique_name}?fields=thumbnail_small_url`;
                    const options = {
                        url: url,
                        headers: { 'Authorization': `Bearer ${response.data.access_token}` },
                    };
                    const prom = new Promise<JSX.Element>((resolved, rejects) => {
                        CapacitorHttp.get(options).then((response: HttpResponse) => {
                            resolved(
                                <li onClick={(event) => changeVideo(index)}><div className="avatar"><div className="lg:w-24 sm:w-12 md:w-16 rounded flex items-center">{response.data.thumbnail_small_url ? <img src={response.data.thumbnail_small_url} /> : <FontAwesomeIcon className="w-20 h-[60px] text-[50px]" icon={faQuestion}></FontAwesomeIcon>}</div></div></li>
                            )
                        }).catch(err => {
                            resolved(
                                <li onClick={(event) => changeVideo(index)}><div className="avatar"><div className="lg:w-24 sm:w-12 md:w-16 rounded"> <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon></div></div></li>
                            )
                        })
                    })
                    promiseList.push(prom);
                });

                Promise.all(promiseList).then(res => {
                    setThumbnailList(res);
                })

            }).catch(err => {
                localStorage.removeItem('daily_motion_token');
            });
        }
    }, [currentExercise]);

    const splitExerciseIds = React.useCallback(() => {
        if (course.exercise_ids) {
            return course.exercise_ids.split(',');
        } else {
            return [];
        }
    }, [course.exercise_ids])

    const onLoad = (event: SyntheticEvent<HTMLIFrameElement, Event>) => {
        const iFrame = document.getElementById('iframe-video');
        if (iFrame) {
            let i = iFrame as HTMLIFrameElement;
            console.log(i.contentWindow);
            console.log(iFrame.querySelector('div[data-tooltip="Pop-out"]'));
        }
    }



    return <div className="w-full px-4">
        <Script src="https://geo.dailymotion.com/libs/player/xbcbr.js"></Script>
        <div className="flex flex-row gap-x-6 items-center text-[30px] font-bold mb-8">
            <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer' onClick={(event) => {
                router.push('./dashboard')
            }}></FontAwesomeIcon> <h1>{course.name}</h1>
        </div>
        <div className="md:flex flex-row gap-x-4 gap-y-4">
            <div className="md:w-2/3 w-full relative">
                <div id="trailer-dailymotion-player"></div>
                <div className="flex justify-center mt-2">
                    <ul id='thumbnail-container' className="menu menu-horizontal bg-base-100 rounded-box">
                        {thumbnailList}
                    </ul>
                </div>

                {/* <iframe className="w-full aspect-video" src="https://geo.dailymotion.com/player/xbcbr.html?video=k3QDtfJQww6SwhyEmot" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0"></iframe> */}
                {/* <iframe id="iframe-video" onLoad={onLoad} src={`https://drive.google.com/file/d/1gPE1ar6nhhB1vyH2HhlQttsqZv9oPOi3/preview`} sandbox="allow-scripts allow-forms allow-same-origin" className="w-full aspect-video" allow="autoplay" allowFullScreen></iframe>
                <div className="removePopout">&nbsp;</div> */}
                {/* <ReactPlayer controls={true} url={"https://www.dailymotion.com/video/k66icVLCcISSo9yEmot"} config={{ dailymotion: { params: { "sharing-enable": false, 'ui-start-screen-info': false } } }} /> */}
            </div>
            <div className="md:w-1/3 w-full">
                <ul className="menu w-full border bg-base-100 menu-compact lg:menu-normal rounded-box">
                    <li className="bg-gray-200">
                        <div className="flex justify-between font-bold">
                            <a>
                                {course.exercise_counts} Lessons
                            </a>
                            <button type="button" className="hover:text-blue-600" onClick={() => { playVideo(trailerFile?.unique_name) }}>
                                Watch Intro
                            </button>
                        </div>

                    </li>
                    {course.exercise_names && course.exercise_names.split(',').map((name, index) => {
                        return <li className="pl-4" key={`exercise_name-${index}`}>
                            <a onClick={() => {
                                setSelectedExerciseId(splitExerciseIds()[index]);
                            }}>
                                {name}
                            </a>
                        </li>
                        // return <div className="collapse collapse-plus ">
                        //     <input type="checkbox" />
                        //     <div className="collapse-title text-xl font-medium">
                        //         {name}
                        //     </div>
                        //     <div className="collapse-content">
                        //         <p>hello</p>
                        //     </div>
                        // </div>
                    })}
                </ul>
            </div>
        </div>

        <div className="tabs my-4">
            <a onClick={() => setActiveTab(1)} className={`tab tab-lifted ${activeTab === 1 && 'tab-active'}`}>Description</a>
            <a onClick={() => setActiveTab(2)} className={`tab tab-lifted ${activeTab === 2 && 'tab-active'}`}>Exercises</a>
            {/* <a onClick={() => setActiveTab(3)} className={`tab tab-lifted ${activeTab === 3 && 'tab-active'}`}>Tab 3</a> */}
        </div>
        <div className="w-full">
            {
                tabDetail
            }
        </div>
    </div>
}

Course.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Course;