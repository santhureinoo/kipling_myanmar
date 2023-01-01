import Head from "next/head";
import { google } from "googleapis";
import { NextPage } from "next";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "./layout";
import { useRouter } from "next/navigation";

export type DriveFile = {
    kind: string;
    id: string;
    name: string;
    mimeType: "image/jpeg";
};

export type Data = {
    files: DriveFile[];
};

const Dashboard: NextPageWithLayout = () => {

    const router = useRouter();
    // Array of API discovery doc URLs for APIs
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
    return (
        <React.Fragment>
            <section className="min-h-screen body-font text-primary">
                <div className="container mx-auto px-5 py-10">
                    <div className="-m-4 flex flex-col flex-wrap md:grid md:grid-cols-2 md:gap-x-4 gap-y-4 md:px-12">
                        {/* <div className="card lg:card-side card-bordered">
                            <div className="card-body">
                                <h2 className="card-title">No Images</h2>
                                <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary">Get Started</button>
                                    <button className="btn btn-ghost">More info</button>
                                </div>
                            </div>
                        </div> */}
                        <div className="card shadow-xl image-full shadow-2xl">
                            <figure>
                                <img src={`https://api.lorem.space/image/book?w=300&h=140`} />
                            </figure>
                            <div className="justify-end card-body">
                                <h2 className="card-title">Elementary Class</h2>
                                <p>This is for the kids who try to taste the world of Engish.</p>
                                <div className="card-actions">
                                    <button onClick={()=>{
                                        router.push('./course')
                                    }} className="btn btn-primary">Start Lesson</button>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-xl image-full shadow-2xl">
                            <figure>
                                <img src={`https://api.lorem.space/image/book?w=300&h=140`} />
                            </figure>
                            <div className="justify-end card-body">
                                <h2 className="card-title">Image overlay</h2>
                                <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary">Get Started</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <iframe src="https://drive.google.com/file/d/1gPE1ar6nhhB1vyH2HhlQttsqZv9oPOi3/preview" width="640" height="480" allow="autoplay"></iframe> */}
        </React.Fragment>
    )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Dashboard;