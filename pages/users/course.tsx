import React, { ReactElement, SyntheticEvent } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const Course: NextPageWithLayout = () => {

    const onLoad = (event: SyntheticEvent<HTMLIFrameElement, Event>) => {
        const iFrame = document.getElementById('iframe-video');
        if (iFrame) {
            let i = iFrame as HTMLIFrameElement;
            console.log(i.contentWindow);
            console.log(iFrame.querySelector('div[data-tooltip="Pop-out"]'));
        }
    }
    return <div className="w-full px-4">
        <h2 className="text-lg">Header 2</h2>
        <div className="md:flex flex-row gap-x-4 gap-y-4">
            <div className="md:w-1/2 w-full relative">
                <iframe className="w-full aspect-video" src="https://geo.dailymotion.com/player/xbcbr.html?video=k3QDtfJQww6SwhyEmot" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0"></iframe>
                {/* <iframe id="iframe-video" onLoad={onLoad} src={`https://drive.google.com/file/d/1gPE1ar6nhhB1vyH2HhlQttsqZv9oPOi3/preview`} sandbox="allow-scripts allow-forms allow-same-origin" className="w-full aspect-video" allow="autoplay" allowFullScreen></iframe>
                <div className="removePopout">&nbsp;</div> */}
                {/* <ReactPlayer controls={true} url={"https://www.dailymotion.com/video/k66icVLCcISSo9yEmot"} config={{ dailymotion: { params: { "sharing-enable": false, 'ui-start-screen-info': false } } }} /> */}
            </div>
            <div className="md:w-1/2 w-full">
                <ul className="menu w-full border bg-base-100 menu-compact lg:menu-normal rounded-box">
                    <li className="bg-gray-200">
                        <div className="flex justify-between">
                            <a>
                                3 Videos
                            </a>
                            <a href="" className="hover:text-blue-600">
                                Watch Intro
                            </a>
                        </div>

                    </li>
                    <li>
                        <a>
                            Chatper 01 : Intro
                        </a>
                    </li>
                    <li>
                        <a>
                            Chapter 02 : Vocabulary
                        </a>
                    </li>
                    <li>
                        <a>
                            Chapter 03 : Grammer
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="tabs my-4">
            <a className="tab tab-lifted">Description</a>
            <a className="tab tab-lifted tab-active">Exercises</a>
            <a className="tab tab-lifted">Tab 3</a>
        </div>
        <div className="w-full">

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